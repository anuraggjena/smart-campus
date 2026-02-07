import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { academicEvents } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
  const student = await getSessionUser();
  requireRole(student, ["STUDENT"]);

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type === "DEPT") {
    const deptEvents = await db
      .select()
      .from(academicEvents)
      .where(eq(academicEvents.departmentId, student.departmentId))
      .orderBy(desc(academicEvents.startDate));

    return NextResponse.json(deptEvents);
  }

  const campusEvents = await db
    .select()
    .from(academicEvents)
    .where(eq(academicEvents.createdByRole, "ADMIN"))
    .orderBy(desc(academicEvents.startDate));

  return NextResponse.json(campusEvents);
}
