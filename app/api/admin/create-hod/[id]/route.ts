import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, departments } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { hash } from "bcryptjs";
import { eq, and, ne } from "drizzle-orm";

// UPDATE HOD
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const { id } = await params;
  const { name, email, password, departmentId } = await req.json();

  if (!name || !email || !departmentId) {
    return NextResponse.json(
      { error: "Missing required fields (Name, Email, or Department)" },
      { status: 400 }
    );
  }

  // 1. Validate Department (if changed)
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

  // 2. Check if Email is taken by ANOTHER user
  const existingEmail = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.email, email),
        ne(users.id, id) // Exclude current user from check
      )
    )
    .limit(1);

  if (existingEmail.length > 0) {
    return NextResponse.json(
      { error: "Email already in use by another account" },
      { status: 409 }
    );
  }

  // 3. Prepare Update Object
  const updateData: any = {
    name,
    email,
    departmentId,
  };

  // Only hash and update password if a new one is provided
  if (password && password.trim() !== "") {
    updateData.passwordHash = await hash(password, 10);
  }

  await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id));

  return NextResponse.json({
    success: true,
    message: "HOD account updated successfully",
  });
}

// DELETE HOD
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const { id } = await params;

  // Optional: Prevent deleting yourself if you are an admin
  if (admin.id === id) {
    return NextResponse.json(
      { error: "Cannot delete your own administrator account" },
      { status: 403 }
    );
  }

  await db.delete(users).where(eq(users.id, id));

  return NextResponse.json({
    success: true,
    message: "HOD account deleted",
  });
}