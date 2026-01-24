import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { announcements } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const {
    title,
    message,
    priority,
    activeFrom,
    activeUntil,
  } = await req.json();

  if (!title || !message || !activeFrom) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  await db.insert(announcements).values({
    title,
    message,
    audience: "STUDENTS",
    department: hod.department, // enforced from session
    priority: priority ?? "NORMAL",
    activeFrom,
    activeUntil: activeUntil ?? null,
    isActive: true,
  });

  return NextResponse.json({
    success: true,
    message: "Department announcement created",
  });
}

export async function GET() {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const list = await db
    .select()
    .from(announcements)
    .where(eq(announcements.department, hod.department))
    .orderBy(announcements.createdAt);

  return NextResponse.json(list);
}
