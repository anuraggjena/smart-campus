import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, departments } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const { name, email, password, departmentId } =
    await req.json();

  if (!name || !email || !password || !departmentId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // ✅ Validate department
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

  // ✅ Check email already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    passwordHash,
    role: "HOD",
    departmentId,
    isHosteller: false,
  });

  return NextResponse.json({
    success: true,
    message: "HOD account created successfully",
  });
}
