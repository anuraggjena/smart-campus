export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, sessions } from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

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

  const sessionId = uuidv4();
  
  const session = await db
    .insert(sessions)
    .values({
      id: sessionId,
      userId: user[0].id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      createdAt: new Date(),
    })
    .returning();

  (await cookies()).set("smartcampus_session", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({
    success: true,
    role: user[0].role,
  });
}
