import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { db } from "@/lib/db/client";
import { feedback, users, departments } from "@/lib/db/schema.runtime";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const allFeedbacks = await db
    .select({
      id: feedback.id,
      message: feedback.message,
      sentiment: feedback.sentiment,
      priority: feedback.priority,
      createdAt: feedback.createdAt,
      studentName: users.name,
      department: departments.name,
    })
    .from(feedback)
    .innerJoin(users, eq(users.id, feedback.userId))
    .innerJoin(
      departments,
      eq(departments.id, users.departmentId)
    )
    .orderBy(desc(feedback.createdAt));

  return NextResponse.json(allFeedbacks);
}
