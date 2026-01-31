import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { db } from "@/lib/db/client";
import { studentInteractions } from "@/lib/db/schema.runtime";
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

  const interactions = await db
    .select()
    .from(studentInteractions)
    .where(eq(studentInteractions.intent, domain));

  const pci = aggregateDomainPCI(interactions);

  return NextResponse.json({
    domain,
    pci,
    interactions: interactions.length,
  });
}
