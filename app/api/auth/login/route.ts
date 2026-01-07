export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, sessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    return NextResponse.json({ error: "Invalid user" }, { status: 401 });
  }

  const session = await db
    .insert(sessions)
    .values({
      userId: user[0].id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    })
    .returning();

  (await cookies()).set("smartcampus_session", session[0].id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({
    success: true,
    role: user[0].role,
  });
}
