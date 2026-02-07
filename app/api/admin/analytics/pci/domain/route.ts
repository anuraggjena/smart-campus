import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { db } from "@/lib/db/client";
import {
  studentInteractions,
  policies,
  procedures,
} from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";
import { aggregateDomainPCI } from "@/lib/analytics/pciAggregator";
import { isValidDomain } from "@/lib/constants/domains";

export async function GET(req: Request) {
  const user = await getSessionUser();
  requireRole(user, ["ADMIN"]);

  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain || !isValidDomain(domain)) {
    return NextResponse.json(
      { error: "valid domain required" },
      { status: 400 }
    );
  }

  // Step 1: interactions of this domain
  const interactions = await db
    .select()
    .from(studentInteractions)
    .where(eq(studentInteractions.intent, domain));

  const pci = aggregateDomainPCI(interactions);

  // Step 2: group by policy & procedure code
  const grouped: Record<
    string,
    { total: number; followUps: number; lowConfidence: number }
  > = {};

  interactions.forEach((i) => {
    const code = i.policyCode ?? i.procedureCode;
    if (!code) return;

    if (!grouped[code]) {
      grouped[code] = {
        total: 0,
        followUps: 0,
        lowConfidence: 0,
      };
    }

    grouped[code].total++;
    if (i.followUp) grouped[code].followUps++;
    if ((i.aiConfidence ?? 100) < 60)
      grouped[code].lowConfidence++;
  });

  // Step 3: Enrich with real title and type
  const confusingItems: any[] = [];

  for (const code of Object.keys(grouped)) {
    const policy = await db
      .select()
      .from(policies)
      .where(eq(policies.code, code))
      .limit(1);

    if (policy.length > 0) {
      const g = grouped[code];
      confusingItems.push({
        type: "POLICY",
        code,
        title: policy[0].title,
        pci: aggregateDomainPCI([
          {
            intent: domain,
            followUp: g.followUps > 0,
            aiConfidence:
              g.lowConfidence > 0 ? 50 : 100,
          },
        ]),
        ...g,
      });
      continue;
    }

    const procedure = await db
      .select()
      .from(procedures)
      .where(eq(procedures.code, code))
      .limit(1);

    if (procedure.length > 0) {
      const g = grouped[code];
      confusingItems.push({
        type: "PROCEDURE",
        code,
        title: procedure[0].title,
        pci: aggregateDomainPCI([
          {
            intent: domain,
            followUp: g.followUps > 0,
            aiConfidence:
              g.lowConfidence > 0 ? 50 : 100,
          },
        ]),
        ...g,
      });
    }
  }

  return NextResponse.json({
    domain,
    pci,
    interactions: interactions.length,
    confusingItems,
  });
}
