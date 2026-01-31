import { db } from "@/lib/db/client";
import {
  announcements,
  campusServices,
  policies,
  procedures,
  academicEvents,
  studentInteractions,
} from "@/lib/db/schema.runtime";
import { and, lte, gte, isNull, or, eq, desc } from "drizzle-orm";

export async function getStudentDashboard(user: any) {
  const now = new Date().toISOString();

  // 1️⃣ Important announcements for this student
  const importantAnnouncements = await db
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

  const filteredAnnouncements = importantAnnouncements.filter((a) => {
    if (a.visibility === "ALL_STUDENTS") return true;
    if (a.visibility === "HOSTELLERS_ONLY" && user.isHosteller)
      return true;
    if (a.departmentId && a.departmentId === user.departmentId)
      return true;
    return false;
  });

  // 2️⃣ Upcoming department events
  const upcomingEvents = await db
    .select()
    .from(academicEvents)
    .where(
      and(
        gte(academicEvents.startDate, now),
        eq(academicEvents.departmentId, user.departmentId)
      )
    );

  // 3️⃣ What students are searching the most (procedures)
  const interactions = await db
    .select()
    .from(studentInteractions)
    .orderBy(desc(studentInteractions.createdAt))
    .limit(200);

  const intentCount: Record<string, number> = {};

  interactions.forEach((i) => {
    intentCount[i.intent] = (intentCount[i.intent] || 0) + 1;
  });

  const topIntents = Object.entries(intentCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([intent]) => intent);

  const suggestedProcedures = await db
    .select()
    .from(procedures)
    .where(eq(procedures.isActive, true));

  const filteredProcedures = suggestedProcedures.filter((p) =>
    topIntents.includes(p.code)
  );

  // 4️⃣ Contextual services
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

  // 5️⃣ Policies students don’t understand (low PCI domains)
  const confusingPolicies = await db
    .select()
    .from(policies)
    .where(eq(policies.isActive, true));

  return {
    importantAnnouncements: filteredAnnouncements.slice(0, 5),
    upcomingEvents: upcomingEvents.slice(0, 5),
    suggestedProcedures: filteredProcedures.slice(0, 5),
    suggestedServices: suggestedServices.slice(0, 5),
    confusingPolicies: confusingPolicies.slice(0, 5),
  };
}
