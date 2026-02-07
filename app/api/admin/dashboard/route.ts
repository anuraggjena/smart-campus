import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import {
  studentInteractions,
  users,
  departments,
} from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { aggregateDomainPCI } from "@/lib/analytics/pciAggregator";
import { eq } from "drizzle-orm";

export async function GET() {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const interactions = await db
  .select({
    intent: studentInteractions.intent,
    aiConfidence: studentInteractions.aiConfidence,
    followUp: studentInteractions.followUp,
    departmentId: users.departmentId,
  })
  .from(studentInteractions)
  .innerJoin(users, eq(users.id, studentInteractions.userId));

  // -------- Domain PCI --------
  const domainGrouped: Record<string, any[]> = {};
  interactions.forEach((i) => {
    if (!domainGrouped[i.intent]) domainGrouped[i.intent] = [];
    domainGrouped[i.intent].push(i);
  });

  const domainPCI = Object.entries(domainGrouped).map(
    ([domain, items]) => ({
      domain,
      pci: aggregateDomainPCI(items),
      interactions: items.length,
    })
  );

  // -------- Department PCI --------
  const deptGrouped: Record<string, any[]> = {};
  interactions.forEach((i) => {
    if (!deptGrouped[i.departmentId])
      deptGrouped[i.departmentId] = [];
    deptGrouped[i.departmentId].push(i);
  });

  const deptPCI = await Promise.all(
    Object.entries(deptGrouped).map(async ([deptId, items]) => {
      const dept = await db
        .select()
        .from(departments)
        .where(eq(departments.id, deptId))
        .limit(1);

      return {
        department: dept[0]?.name ?? "Unknown",
        pci: aggregateDomainPCI(items),
        interactions: items.length,
      };
    })
  );

  // -------- Overall PCI --------
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
    departmentPCI: deptPCI,
    totalInteractions: interactions.length,
  });
}
