import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { db } from "@/lib/db/client";
import {
  studentInteractions,
  users,
  departments,
} from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";
import { aggregateDomainPCI } from "@/lib/analytics/pciAggregator";

export async function GET(req: Request) {
  const user = await getSessionUser();
  requireRole(user, ["ADMIN"]);

  const { searchParams } = new URL(req.url);
  const departmentId = searchParams.get("department");

  if (!departmentId) {
    return NextResponse.json(
      { error: "department required" },
      { status: 400 }
    );
  }

  const interactions = await db
  .select({
    intent: studentInteractions.intent,
    aiConfidence: studentInteractions.aiConfidence,
    followUp: studentInteractions.followUp,
  })
  .from(studentInteractions)
  .innerJoin(users, eq(users.id, studentInteractions.userId))
  .where(eq(users.departmentId, departmentId));

  const pci = aggregateDomainPCI(interactions);

  const dept = await db
    .select()
    .from(departments)
    .where(eq(departments.id, departmentId))
    .limit(1);

  return NextResponse.json({
    department: dept[0]?.name ?? "Unknown",
    pci,
    interactions: interactions.length,
  });
}
