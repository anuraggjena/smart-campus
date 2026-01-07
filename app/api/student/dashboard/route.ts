export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { getStudentDashboard } from "@/lib/services/studentService";

export async function GET() {
  const user = await getSessionUser();
  requireRole(user, ["STUDENT"]);

  const data = await getStudentDashboard();
  return NextResponse.json(data);
}
