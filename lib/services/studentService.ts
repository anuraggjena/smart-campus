import { db } from "@/lib/db/client";
import {
  policies,
  campusServices,
  announcements,
} from "@/lib/db/schema.pg";
import { and, eq, lte, gte } from "drizzle-orm";

export async function getStudentDashboard() {
  const [policyCount, serviceCount] = await Promise.all([
    db.select().from(policies),
    db.select().from(campusServices),
  ]);

  return {
    policiesAvailable: policyCount.length,
    servicesAvailable: serviceCount.length,
  };
}

export async function getActivePolicies() {
  return db
    .select()
    .from(policies)
    .where(eq(policies.active, "true"));
}

export async function getCampusServices() {
  return db.select().from(campusServices);
}

export async function getActiveAnnouncements() {
  const now = new Date();

  return db
    .select()
    .from(announcements)
    .where(
      and(
        lte(announcements.activeFrom, now),
        eq(announcements.targetRole, "STUDENT")
      )
    );
}
