import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import {
  announcements,
  academicEvents,
  feedback,
  policies,
  studentInteractions,
  users,
} from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { aggregateDomainPCI } from "@/lib/analytics/pciAggregator";
import { eq, inArray } from "drizzle-orm";

export async function GET() {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const dept = hod.departmentId;

  // Basic dashboard counts
  const [
    ann,
    events,
    fb,
  ] = await Promise.all([
    db.select().from(announcements).where(eq(announcements.departmentId, dept)),
    db.select().from(academicEvents).where(eq(academicEvents.departmentId, dept)),
    db.select().from(feedback).where(eq(feedback.departmentId, dept)),
  ]);

  // --- PCI SECTION (your correct logic kept) ---

  const deptStudents = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.departmentId, dept));

  const studentIds = deptStudents.map((s) => s.id);

  let overallPCI = 100;
  let domainPCI: any[] = [];

  if (studentIds.length > 0) {
    const interactions = await db
      .select()
      .from(studentInteractions)
      .where(inArray(studentInteractions.userId, studentIds));

    const grouped: Record<string, any[]> = {};

    interactions.forEach((i) => {
      if (!grouped[i.intent]) grouped[i.intent] = [];
      grouped[i.intent].push(i);
    });

    domainPCI = Object.entries(grouped).map(([domain, items]) => ({
      domain,
      pci: aggregateDomainPCI(items),
      interactions: items.length,
    }));

    overallPCI =
      domainPCI.length === 0
        ? 100
        : Math.round(
            domainPCI.reduce((a, b) => a + b.pci, 0) /
              domainPCI.length
          );
  }

  return NextResponse.json({
    departmentId: dept,
    announcements: ann.length,
    events: events.length,
    feedback: fb.length,
    overallPCI,
    domainPCI,
  });
}
