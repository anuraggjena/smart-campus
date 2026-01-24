import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { studentInteractions, users } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { aggregateDomainPCI } from "@/lib/analytics/pciAggregator";
import { eq, inArray } from "drizzle-orm";

export async function GET() {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  // Fetch students of this department
  const deptStudents = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.department, hod.department));

  const studentIds = deptStudents.map(s => s.id);

  if (studentIds.length === 0) {
    return NextResponse.json({
      overallPCI: 100,
      domainPCI: [],
    });
  }

  // Fetch interactions by those students
  const interactions = await db
    .select()
    .from(studentInteractions)
    .where(inArray(studentInteractions.userId, studentIds));

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
    department: hod.department,
    overallPCI,
    domainPCI,
  });
}
