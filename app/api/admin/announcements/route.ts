import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { announcements } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";

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
    .orderBy(announcements.createdAt);

  return NextResponse.json(list);
}
