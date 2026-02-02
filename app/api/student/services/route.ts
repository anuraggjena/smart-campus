import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { listStudentCampusServices } from "@/lib/services/studentContentServices";

export async function GET() {
  const user = await getSessionUser();
  requireRole(user, ["STUDENT"]);

  const data = await listStudentCampusServices(user);

  return NextResponse.json(data);
}
