import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { getStudentDashboard } from "@/lib/services/studentService";

export async function GET() {
  const user = await getSessionUser();
  requireRole(user, ["STUDENT"]);

  const data = await getStudentDashboard();

  return NextResponse.json({
    urgentAnnouncements: data.urgentAnnouncements ?? 0,
    upcomingEvents: data.upcomingEvents ?? 0,
    activePolicies: data.activePolicies ?? 0,
    procedures: data.procedures ?? 0,
    services: data.services ?? 0,
    policies: data.policies ?? 0,
    announcements: data.announcements ?? 0,
  });
}
