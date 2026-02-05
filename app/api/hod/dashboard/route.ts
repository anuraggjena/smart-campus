import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { db } from "@/lib/db/client";
import { users, studentInteractions } from "@/lib/db/schema.runtime";
import { eq, inArray } from "drizzle-orm";
import { aggregateDomainPCI } from "@/lib/analytics/pciAggregator";

export async function GET() {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  // 1️⃣ Students of this department
  const deptStudents = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.departmentId, hod.departmentId));

  const studentIds = deptStudents.map((s) => s.id);

  if (studentIds.length === 0) {
    return NextResponse.json({
      overallPCI: 100,
      interactions: 0,
      domainPCI: [],
    });
  }

  // 2️⃣ All interactions of those students
  const interactions = await db
    .select()
    .from(studentInteractions)
    .where(inArray(studentInteractions.userId, studentIds));

  // 3️⃣ Group by domain
  const grouped: Record<string, any[]> = {};

  interactions.forEach((i) => {
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

  // 4️⃣ Overall PCI
  const overallPCI = aggregateDomainPCI(interactions);

  return NextResponse.json({
    overallPCI,
    interactions: interactions.length,
    domainPCI,
  });
}
