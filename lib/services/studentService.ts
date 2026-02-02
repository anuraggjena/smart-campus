import { db } from "@/lib/db/client";
import {
  announcements,
  campusServices,
  policies,
  procedures,
  academicEvents,
  studentInteractions,
} from "@/lib/db/schema.runtime";
import {
  and,
  lte,
  gte,
  isNull,
  or,
  eq,
  desc,
  inArray,
} from "drizzle-orm";

export async function getStudentDashboard(user: any) {
  const now = new Date().toISOString();

  /* ------------------------------------------------------------------ */
  /* 1️⃣ Announcements truly relevant to THIS student                   */
  /* ------------------------------------------------------------------ */

  const allAnnouncements = await db
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

  const importantAnnouncements = allAnnouncements.filter((a) => {
    if (a.visibility === "ALL_STUDENTS") return true;
    if (a.visibility === "HOSTELLERS_ONLY" && user.isHosteller)
      return true;
    if (a.departmentId && a.departmentId === user.departmentId)
      return true;
    return false;
  });

  /* ------------------------------------------------------------------ */
  /* 2️⃣ Upcoming events ONLY for this department (next 7 days)        */
  /* ------------------------------------------------------------------ */

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcomingEvents = await db
    .select()
    .from(academicEvents)
    .where(
      and(
        eq(academicEvents.departmentId, user.departmentId),
        gte(academicEvents.startDate, now),
        lte(academicEvents.startDate, nextWeek.toISOString())
      )
    )
    .orderBy(academicEvents.startDate);

  /* ------------------------------------------------------------------ */
  /* 3️⃣ What THIS student and others are struggling with               */
  /* ------------------------------------------------------------------ */

  const recentInteractions = await db
    .select()
    .from(studentInteractions)
    .orderBy(desc(studentInteractions.createdAt))
    .limit(300);

  const intentCount: Record<string, number> = {};

  recentInteractions.forEach((i) => {
    intentCount[i.intent] = (intentCount[i.intent] || 0) + 1;
  });

  const trendingIntents = Object.entries(intentCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([intent]) => intent);

  const suggestedProcedures = trendingIntents.length
    ? await db
        .select()
        .from(procedures)
        .where(
          and(
            eq(procedures.isActive, true),
            inArray(procedures.code, trendingIntents)
          )
        )
    : [];

  /* ------------------------------------------------------------------ */
  /* 4️⃣ Contextual services based on student type                      */
  /* ------------------------------------------------------------------ */

  const allServices = await db
    .select()
    .from(campusServices)
    .where(eq(campusServices.isActive, true));

  const suggestedServices = allServices.filter((s) => {
    if (s.visibility === "ALL_STUDENTS") return true;
    if (
      s.visibility === "HOSTELLERS_ONLY" &&
      user.isHosteller
    )
      return true;
    return false;
  });

  /* ------------------------------------------------------------------ */
  /* 5️⃣ Policies from domains students ask most about                  */
  /* ------------------------------------------------------------------ */

  const confusingPolicies = trendingIntents.length
    ? await db
        .select()
        .from(policies)
        .where(eq(policies.isActive, true))
    : [];

  /* ------------------------------------------------------------------ */
  /* 6️⃣ Student recent activity (for dashboard timeline)               */
  /* ------------------------------------------------------------------ */

  const myRecentActivity = await db
    .select()
    .from(studentInteractions)
    .where(eq(studentInteractions.userId, user.id))
    .orderBy(desc(studentInteractions.createdAt))
    .limit(5);

  return {
    importantAnnouncements: importantAnnouncements.slice(0, 5),
    upcomingEvents: upcomingEvents.slice(0, 5),
    suggestedProcedures: suggestedProcedures.slice(0, 5),
    suggestedServices: suggestedServices.slice(0, 5),
    confusingPolicies: confusingPolicies.slice(0, 5),
    myRecentActivity,
  };
}
