import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { getVisibleCampusServices } from "@/lib/services/studentService";

export async function GET() {
  const user = await getSessionUser();
  requireRole(user, ["STUDENT"]);

  const data = await getVisibleCampusServices(user);

  return NextResponse.json(data);
}
