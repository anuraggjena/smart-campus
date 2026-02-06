import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { announcements, departments } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq, desc } from "drizzle-orm";

export async function POST(req: Request) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const {
    title,
    message,
    audience,
    departmentId,
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

  // ✅ Validate department if provided
  if (departmentId) {
    const dept = await db
      .select()
      .from(departments)
      .where(eq(departments.id, departmentId))
      .limit(1);

    if (dept.length === 0) {
      return NextResponse.json(
        { error: "Invalid department" },
        { status: 400 }
      );
    }
  }

  await db.insert(announcements).values({
    title,
    message,
    audience: audience ?? "ALL",
    departmentId: departmentId ?? null,
    priority: priority ?? "NORMAL",
    activeFrom,
    activeUntil: activeUntil ?? null,
    isActive: true,
  });

  return NextResponse.json({
    success: true,
    message: "Announcement created",
  });
}

export async function GET() {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const list = await db
    .select()
    .from(announcements)
    .orderBy(desc(announcements.createdAt));

  return NextResponse.json(list);
}
