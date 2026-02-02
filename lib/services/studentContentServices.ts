import { db } from "@/lib/db/client";
import {
  announcements,
  campusServices,
} from "@/lib/db/schema.runtime";
import { and, lte, gte, isNull, or, eq, desc } from "drizzle-orm";

export async function listStudentAnnouncements(user: any) {
  const now = new Date().toISOString();

  const list = await db
    .select()
    .from(announcements)
    .where(
      and(
        eq(announcements.isActive, true),
        lte(announcements.activeFrom, now),
        or(
          isNull(announcements.activeUntil),
          gte(announcements.activeUntil, now)
        )
      )
    )
    .orderBy(desc(announcements.priority));

  return list.filter((a) => {
    if (a.visibility === "ALL_STUDENTS") return true;
    if (a.visibility === "HOSTELLERS_ONLY" && user.isHosteller)
      return true;
    if (a.departmentId && a.departmentId === user.departmentId)
      return true;
    return false;
  });
}

export async function listStudentCampusServices(user: any) {
  const services = await db
    .select()
    .from(campusServices)
    .where(eq(campusServices.isActive, true));

  return services.filter((s) => {
    if (s.visibility === "ALL_STUDENTS") return true;
    if (s.visibility === "HOSTELLERS_ONLY" && user.isHosteller)
      return true;
    return false;
  });
}
