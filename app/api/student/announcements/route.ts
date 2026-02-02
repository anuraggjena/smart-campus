import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { listStudentAnnouncements } from "@/lib/services/studentContentServices";

export async function GET() {
  const user = await getSessionUser();
  requireRole(user, ["STUDENT"]);

  const data = await listStudentAnnouncements(user);

  return NextResponse.json(data);
}
