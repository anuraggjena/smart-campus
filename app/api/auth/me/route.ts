import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("smartcampus_session")?.value;

  if (!sessionId) {
    return NextResponse.json(
      { error: "Unauthenticated" },
      { status: 401 }
    );
  }

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (session.length === 0) {
    return NextResponse.json(
      { error: "Invalid session" },
      { status: 401 }
    );
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session[0].userId))
    .limit(1);

  return NextResponse.json(user[0]);
}
