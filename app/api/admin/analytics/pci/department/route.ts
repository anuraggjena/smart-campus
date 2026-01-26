import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { db } from "@/lib/db/client";
import { studentInteractions, users } from "@/lib/db/schema.runtime";
import { eq, inArray } from "drizzle-orm";
import { aggregateDomainPCI } from "@/lib/analytics/pciAggregator";

export async function GET(req: Request) {
  const user = await getSessionUser();
  requireRole(user, ["ADMIN"]);

  const { searchParams } = new URL(req.url);
  const departments = searchParams.get("department");

  if (!departments) {
    return NextResponse.json(
      { error: "department required" },
      { status: 400 }
    );
  }

  const deptUsers = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.departmentId, departments));

  const userIds = deptUsers.map(u => u.id);

  if (userIds.length === 0) {
    return NextResponse.json({
      departments,
      pci: 100,
      interactions: 0,
    });
  }

  const interactions = await db
    .select()
    .from(studentInteractions)
    .where(inArray(studentInteractions.userId, userIds));

  const pci = aggregateDomainPCI(interactions);

  return NextResponse.json({
    departments,
    pci,
    interactions: interactions.length,
  });
}
