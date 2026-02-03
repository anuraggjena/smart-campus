import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { db } from "@/lib/db/client";
import {
  users,
  studentInteractions,
} from "@/lib/db/schema.runtime";
import { eq, inArray } from "drizzle-orm";
import { aggregateDomainPCI } from "@/lib/analytics/pciAggregator";

export async function GET() {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  // 1️⃣ Students of department
  const deptStudents = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.departmentId, hod.departmentId));

  const studentIds = deptStudents.map(s => s.id);

  if (studentIds.length === 0) {
    return NextResponse.json({
      overallPCI: 100,
      domainPCI: [],
      interactions: 0,
    });
  }

  // 2️⃣ All interactions
  const interactions = await db
    .select()
    .from(studentInteractions)
    .where(inArray(studentInteractions.userId, studentIds));

  // 3️⃣ Group by intent (domain)
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
    interactions: interactions.length,
  });
}
