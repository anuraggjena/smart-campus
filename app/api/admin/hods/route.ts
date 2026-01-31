import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, departments } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

export async function GET() {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const list = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      departmentName: departments.name,
    })
    .from(users)
    .innerJoin(
      departments,
      eq(users.departmentId, departments.id)
    )
    .where(eq(users.role, "HOD"));

  return NextResponse.json(list);
}
