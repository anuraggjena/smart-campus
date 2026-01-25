import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { feedback } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";

export async function POST(req: Request) {
  const user = await getSessionUser();
  requireRole(user, ["STUDENT"]);

  const body = await req.json();

  await db.insert(feedback).values({
    userId: user!.id,
    department: user!.department,
    domain: body.domain,
    message: body.message,
    sentiment: body.sentiment, // from UI selection
    priority: body.priority,
  });

  return NextResponse.json({ ok: true });
}
