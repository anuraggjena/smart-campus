import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema.runtime";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    name,
    email,
    password,
    departmentId,
    isHosteller,
  } = body;

  if (
    !name ||
    !email ||
    !password ||
    !departmentId
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Check if email already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const passwordHash = await hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    passwordHash,
    role: "STUDENT",
    departmentId,
    isHosteller: Boolean(isHosteller),
  });

  return NextResponse.json({
    success: true,
    message: "Student registered successfully",
  });
}
