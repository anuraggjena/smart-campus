import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { getActiveAnnouncements } from "@/lib/services/studentService";

export async function GET() {
  const user = await getSessionUser();
  requireRole(user, ["STUDENT"]);

  const data = await getActiveAnnouncements(user);

  return NextResponse.json(data);
}
