import { db } from "@/lib/db/client";
import {
  announcements,
  campusServices,
  policies,
  procedures,
  academicEvents,
} from "@/lib/db/schema.runtime";
import { and, lte, gte, isNull, or, eq } from "drizzle-orm";

export async function getStudentDashboard() {
  const now = new Date().toISOString();

  const [
    activeAnnouncements,
    urgentAnnouncements,
    activeServices,
    activePolicies,
    activeProcedures,
    upcomingEvents,
  ] = await Promise.all([
    // All active announcements
    db
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
      ),

    // Urgent only
    db
      .select()
      .from(announcements)
      .where(
        and(
          eq(announcements.priority, "URGENT"),
          eq(announcements.isActive, true)
        )
      ),

    db
      .select()
      .from(campusServices)
      .where(eq(campusServices.isActive, true)),

    db
      .select()
      .from(policies)
      .where(eq(policies.isActive, true)),

    db
      .select()
      .from(procedures)
      .where(eq(procedures.isActive, true)),

    db
      .select()
      .from(academicEvents)
      .where(gte(academicEvents.startDate, now)),
  ]);

  return {
    urgentAnnouncements: urgentAnnouncements.length,
    upcomingEvents: upcomingEvents.length,
    activePolicies: activePolicies.length,
    procedures: activeProcedures.length,
    services: activeServices.length,
    policies: activePolicies.length,
    announcements: activeAnnouncements.length,
  };
}

export async function getActiveAnnouncements() {
  const now = new Date().toISOString();

  return db
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
    .orderBy(announcements.activeFrom);
}
