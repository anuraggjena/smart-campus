import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { academicEvents } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const {
    title,
    description,
    type,
    startDate,
    endDate,
  } = await req.json();

  if (!title || !description || !type || !startDate) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  await db.insert(academicEvents).values({
    departmentId: hod.departmentId,
    title,
    description,
    type,
    startDate,
    endDate: endDate ?? null,
    createdByRole: "HOD",
  });

  return NextResponse.json({
    success: true,
    message: "Academic event created",
  });
}

export async function GET() {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const list = await db
    .select()
    .from(academicEvents)
    .where(eq(academicEvents.departmentId, hod.departmentId))
    .orderBy(academicEvents.startDate);

  return NextResponse.json(list);
}
