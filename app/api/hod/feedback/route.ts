import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { departments, feedback, studentInteractions, users } from "@/lib/db/schema.runtime";
import { desc, eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";

export async function GET() {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const dept = hod.departmentId;

  // Department feedback list
  const deptFeedback = await db
    .select({
        id: feedback.id,
        message: feedback.message,
        sentiment: feedback.sentiment,
        priority: feedback.priority,
        createdAt: feedback.createdAt,
        studentName: users.name,
      })
    .from(feedback)
    .innerJoin(users, eq(users.id, feedback.userId))
    .where(eq(feedback.departmentId, dept))
    .orderBy(desc(feedback.createdAt));

  return NextResponse.json(deptFeedback);
}
