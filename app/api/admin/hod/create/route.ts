import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    // 1. Auth & RBAC
    const admin = await getSessionUser();
    requireRole(admin, ["ADMIN"]);

    // 2. Parse input
    const {
      name,
      email,
      departmentId,
      password,
    } = await req.json();

    if (!name || !email || !departmentId || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3. Check existing user
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

    // 4. Hash password
    const passwordHash = await hash(password, 10);

    // 5. Create HOD account
    await db.insert(users).values({
      name,
      email,
      passwordHash,
      role: "HOD",
      departmentId,
      isHosteller: false, // not applicable
    });

    return NextResponse.json({
      success: true,
      message: "HOD account created successfully",
    });
  } catch (err) {
    console.error("CREATE_HOD_ERROR", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
