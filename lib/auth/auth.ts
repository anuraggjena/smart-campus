import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";

const SESSION_COOKIE = "smartcampus_session";

export async function getSessionUser() {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const result = await db
  .select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    departmentId: users.departmentId,
    isHosteller: users.isHosteller,
    expiresAt: sessions.expiresAt,
  })
  .from(sessions)
  .innerJoin(users, eq(users.id, sessions.userId))
  .where(eq(sessions.id, sessionId))
  .limit(1);

  if (result.length === 0) return null;

  const user = result[0];

  if (new Date(user.expiresAt) < new Date()) {
    return null;
  }

  return user;
}
