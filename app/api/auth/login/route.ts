import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, sessions } from "@/lib/db/schema.runtime";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { addDays } from "date-fns";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1. Fetch user
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = result[0];

    // 2. Verify password
    const isValid = await compare(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3. Create session
    const sessionId = crypto.randomUUID();
    const expiresAt = addDays(new Date(), 7).toISOString();

    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      expiresAt,
    });

    // 4. Set session cookie
    (await
      // 4. Set session cookie
      cookies()).set("smartcampus_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(expiresAt),
      path: "/",
    });

    // 5. Return role for frontend redirect
    return NextResponse.json({
      role: user.role,
    });
  } catch (err) {
    console.error("LOGIN_ERROR", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
