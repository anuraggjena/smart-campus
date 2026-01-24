import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { studentInteractions } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { aggregateDomainPCI } from "@/lib/analytics/pciAggregator";

export async function GET() {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const interactions = await db
    .select()
    .from(studentInteractions);

  const grouped: Record<string, any[]> = {};

  interactions.forEach(i => {
    if (!grouped[i.intent]) grouped[i.intent] = [];
    grouped[i.intent].push(i);
  });

  const domainPCI = Object.entries(grouped).map(
    ([domain, items]) => ({
      domain,
      pci: aggregateDomainPCI(items),
      interactions: items.length,
    })
  );

  const overallPCI =
    domainPCI.length === 0
      ? 100
      : Math.round(
          domainPCI.reduce((a, b) => a + b.pci, 0) /
            domainPCI.length
        );

  return NextResponse.json({
    overallPCI,
    domainPCI,
  });
}
