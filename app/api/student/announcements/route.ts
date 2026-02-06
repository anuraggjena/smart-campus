import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { announcements } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { and, eq, lte, or } from "drizzle-orm";

export async function GET() {
  const student = await getSessionUser();
  requireRole(student, ["STUDENT"]);

  const now = new Date().toISOString();

  const list = await db
    .select()
    .from(announcements)
    .where(
      and(
        eq(announcements.isActive, true),

        // Date validity
        lte(announcements.activeFrom, now),

        // Audience rules
        or(
          // Campus wide
          eq(announcements.audience, "ALL"),

          // Department specific
          eq(announcements.departmentId, student.departmentId)
        ),

        // Visibility rules
        or(
          eq(announcements.visibility, "ALL_STUDENTS"),
          student.isHosteller
            ? eq(announcements.visibility, "HOSTELLERS_ONLY")
            : eq(announcements.visibility, "ALL_STUDENTS")
        )
      )
    )
    .orderBy(announcements.activeFrom);

  return NextResponse.json(list);
}
