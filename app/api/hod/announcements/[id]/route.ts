import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { announcements } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { and, eq } from "drizzle-orm";

// ✏️ EDIT
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const { id } = await context.params;
  const body = await req.json();

  await db
    .update(announcements)
    .set({
      title: body.title,
      message: body.message,
      priority: body.priority,
      activeFrom: body.activeFrom,
      activeUntil: body.activeUntil || null,
    })
    .where(
      and(
        eq(announcements.id, id),
        eq(announcements.departmentId, hod.departmentId)
      )
    );

  return NextResponse.json({ success: true });
}

// 🗑 DELETE
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const { id } = await context.params;

  await db
    .delete(announcements)
    .where(
      and(
        eq(announcements.id, id),
        eq(announcements.departmentId, hod.departmentId)
      )
    );

  return NextResponse.json({ success: true });
}
