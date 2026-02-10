import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { academicEvents } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

// UPDATE EVENT
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const { id } = await params;
  const body = await req.json();

  // We only update the content fields, keeping metadata (createdByRole, departmentId) intact
  await db
    .update(academicEvents)
    .set({
      title: body.title,
      description: body.description,
      startDate: body.startDate,
      endDate: body.endDate,
    })
    .where(eq(academicEvents.id, id));

  return NextResponse.json({ success: true, message: "Event updated" });
}

// DELETE EVENT
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const { id } = await params;

  await db
    .delete(academicEvents)
    .where(eq(academicEvents.id, id));

  return NextResponse.json({ success: true, message: "Event deleted" });
}