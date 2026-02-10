import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { departments } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

// UPDATE DEPARTMENT
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  // Await params for Next.js 15
  const { id } = await params;
  const body = await req.json();

  await db
    .update(departments)
    .set(body)
    .where(eq(departments.id, id));

  return NextResponse.json({ success: true });
}

// DELETE DEPARTMENT
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  // Await params for Next.js 15
  const { id } = await params;

  await db
    .delete(departments)
    .where(eq(departments.id, id));

  return NextResponse.json({ success: true });
}