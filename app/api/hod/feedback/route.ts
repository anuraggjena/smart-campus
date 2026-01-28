import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { feedback, studentInteractions } from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { aggregateDomainPCI } from "@/lib/analytics/pciAggregator";

export async function GET() {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const dept = hod.departmentId;

  // Department feedback list
  const deptFeedback = await db
    .select()
    .from(feedback)
    .where(eq(feedback.departmentId, dept));

  // All student interactions for this department
  const interactions = await db
    .select()
    .from(studentInteractions)
    .where(eq(studentInteractions.departmentId, dept));

  // 🎯 REAL PCI using your engine
  const departmentPCI = aggregateDomainPCI(interactions);

  return NextResponse.json({
    feedback: deptFeedback,
    pci: departmentPCI,
  });
}
