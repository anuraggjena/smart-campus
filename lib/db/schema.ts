import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: varchar("role", { length: 50 }).notNull(),
  department: varchar("department", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const policies = pgTable("policies", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 100 }).notNull(), // ACADEMICS, FEES, HOSTEL
  owningDepartment: varchar("owning_department", { length: 100 }),
  clarityScoreCached: varchar("clarity_score_cached", { length: 10 }),
  active: varchar("active", { length: 5 }).default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const policyDocuments = pgTable("policy_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  policyId: uuid("policy_id")
    .notNull()
    .references(() => policies.id, { onDelete: "cascade" }),
  contentText: varchar("content_text", { length: 5000 }).notNull(),
  version: varchar("version", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const campusServices = pgTable("campus_services", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 2000 }).notNull(),
  department: varchar("department", { length: 100 }),
  contactInfo: varchar("contact_info", { length: 255 }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const announcements = pgTable("announcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: varchar("content", { length: 3000 }).notNull(),
  targetRole: varchar("target_role", { length: 20 }).default("STUDENT"),
  activeFrom: timestamp("active_from").notNull(),
  activeTo: timestamp("active_to"),
});