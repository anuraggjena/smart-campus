import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { announcements, departments } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const body = await req.json();

  if (body.departmentId) {
    const dept = await db
      .select()
      .from(departments)
      .where(eq(departments.id, body.departmentId))
      .limit(1);

    if (dept.length === 0) {
      return NextResponse.json(
        { error: "Invalid department" },
        { status: 400 }
      );
    }
  }

  await db
    .update(announcements)
    .set(body)
    .where(eq(announcements.id, params.id));

  return NextResponse.json({
    success: true,
    message: "Announcement updated",
  });
}
