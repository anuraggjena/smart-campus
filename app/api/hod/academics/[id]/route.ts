import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { academicEvents } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { and, eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const { id } = await context.params; // ✅ important

  const body = await req.json();

  await db
    .update(academicEvents)
    .set({
      title: body.title,
      description: body.description,
      type: body.type,
      startDate: body.startDate,
      endDate: body.endDate,
    })
    .where(
      and(
        eq(academicEvents.id, id),
        eq(academicEvents.departmentId, hod.departmentId)
      )
    );

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const { id } = await context.params; // ✅ important

  await db
    .delete(academicEvents)
    .where(
      and(
        eq(academicEvents.id, id),
        eq(academicEvents.departmentId, hod.departmentId)
      )
    );

  return NextResponse.json({ success: true });
}
