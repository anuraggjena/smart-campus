import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const SESSION_COOKIE = "smartcampus_session";

export async function getSessionUser() {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const result = await db
    .select({
      user: users,
      session: sessions,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (result.length === 0) return null;

  const { user, session } = result[0];

  if (new Date() > session.expiresAt) {
    return null;
  }

  return user;
}
