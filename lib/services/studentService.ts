import { db } from "@/lib/db/client";
import {
  announcements,
  campusServices,
  policies,
  procedures,
  academicEvents,
  studentInteractions,
} from "@/lib/db/schema.runtime";
import { and, lte, gte, isNull, or, eq, desc, asc } from "drizzle-orm";

export async function getStudentDashboard(user: any) {
  const now = new Date().toISOString();

  // 1️⃣ Important announcements
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
  );

  allAnnouncements.sort(
    (a, b) =>
      new Date(b.activeFrom).getTime() -
      new Date(a.activeFrom).getTime()
  );

  const filteredAnnouncements = allAnnouncements.filter((a) => {
  // role targeting
  if (!(a.audience === "ALL" || a.audience === "STUDENTS"))
    return false;

  // department targeting
  if (a.departmentId !== user.departmentId)
    return false;

  // hostel targeting
  if (a.visibility === "HOSTELLERS_ONLY" && !user.isHosteller)
    return false;

  return true;
});

  // 2️⃣ Upcoming events
  const upcomingEvents = await db
    .select()
    .from(academicEvents)
    .where(
      and(
        gte(academicEvents.startDate, now),
        eq(academicEvents.departmentId, user.departmentId)
      )
    );

  // 3️⃣ Find top domains students ask about
  const interactions = await db
    .select()
    .from(studentInteractions)
    .orderBy(desc(studentInteractions.createdAt))
    .limit(300);

  const domainCount: Record<string, number> = {};

  interactions.forEach((i) => {
    domainCount[i.intent] = (domainCount[i.intent] || 0) + 1;
  });

  const topDomains = Object.entries(domainCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([domain]) => domain);

  // ✅ Match procedures by DOMAIN (not code)
  const allProcedures = await db
    .select()
    .from(procedures)
    .where(eq(procedures.isActive, true));

  const suggestedProcedures = allProcedures.filter((p) =>
    topDomains.includes(p.domain)
  );

  // 4️⃣ Contextual services
  const services = await db
    .select()
    .from(campusServices)
    .where(eq(campusServices.isActive, true));

  const suggestedServices = services.filter((s) => {
    if (s.visibility === "ALL_STUDENTS") return true;
    if (s.visibility === "HOSTELLERS_ONLY" && user.isHosteller)
      return true;
    return false;
  });

  // 5️⃣ Policies from frequently asked domains
  const allPolicies = await db
    .select()
    .from(policies)
    .where(eq(policies.isActive, true));

  const confusingPolicies = allPolicies.filter((p) =>
    topDomains.includes(p.domain)
  );

  const myRecentActivity = await db
    .select()
    .from(studentInteractions)
    .where(eq(studentInteractions.userId, user.id))
    .orderBy(desc(studentInteractions.createdAt))
    .limit(5);

  return {
    importantAnnouncements: filteredAnnouncements.slice(0, 5),
    upcomingEvents: upcomingEvents.slice(0, 5),
    suggestedProcedures: suggestedProcedures.slice(0, 5),
    suggestedServices: suggestedServices.slice(0, 5),
    confusingPolicies: confusingPolicies.slice(0, 5),
    myRecentActivity,
  };
}
