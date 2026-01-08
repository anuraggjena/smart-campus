export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { handleStudentQuery } from "@/lib/ai/assistant";

export async function POST(req: Request) {
  const user = await getSessionUser();
  requireRole(user, ["STUDENT"]);

  const { query } = await req.json();

  const result = await handleStudentQuery(user.id, query);

  return NextResponse.json(result);
}
