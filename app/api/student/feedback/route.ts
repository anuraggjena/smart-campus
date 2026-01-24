import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { feedback } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";

export async function POST(req: Request) {
  const student = await getSessionUser();
  requireRole(student, ["STUDENT"]);

  const { domain, message } = await req.json();

  if (!domain || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  await db.insert(feedback).values({
    userId: student.id,
    department: student.department,
    domain,
    message,
  });

  return NextResponse.json({
    success: true,
    message: "Feedback submitted successfully",
  });
}
