import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { academicEvents } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq, and } from "drizzle-orm";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const body = await req.json();

  await db
    .update(academicEvents)
    .set({
      title: body.title,
      description: body.description,
      type: body.type,
      startDate: body.startDate,
      endDate: body.endDate ?? null,
    })
    .where(
      and(
        eq(academicEvents.id, params.id),
        eq(academicEvents.departmentId, hod.departmentId)
      )
    );

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  await db
    .delete(academicEvents)
    .where(
      and(
        eq(academicEvents.id, params.id),
        eq(academicEvents.departmentId, hod.departmentId)
      )
    );

  return NextResponse.json({ success: true });
}
