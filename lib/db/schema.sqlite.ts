import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";

/* USERS */

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // uuid stored as text
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  department: text("department"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

/* SESSIONS */

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

/* POLICIES */

export const policies = sqliteTable("policies", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  title: text("title").notNull(),
  domain: text("domain").notNull(),
  owningDepartment: text("owning_department"),
  clarityScoreCached: text("clarity_score_cached"),
  active: text("active").default("true"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

/* POLICY DOCUMENTS */

export const policyDocuments = sqliteTable("policy_documents", {
  id: text("id").primaryKey(),
  policyId: text("policy_id").notNull(),
  contentText: text("content_text").notNull(),
  version: text("version").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

/* CAMPUS SERVICES */

export const campusServices = sqliteTable("campus_services", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  department: text("department"),
  contactInfo: text("contact_info"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

/* ANNOUNCEMENTS */

export const announcements = sqliteTable("announcements", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  targetRole: text("target_role").default("STUDENT"),
  activeFrom: integer("active_from", { mode: "timestamp" }).notNull(),
  activeTo: integer("active_to", { mode: "timestamp" }),
});

export const aiInteractions = sqliteTable("ai_interactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  rawQuery: text("raw_query").notNull(),
  intent: text("intent").notNull(),
  confidence: integer("confidence").notNull(), // 0–100
  aiResponse: text("ai_response").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const intents = sqliteTable("intents", {
  key: text("key").primaryKey(), // FEES, EXAMS, HOSTEL, LEAVE
  description: text("description").notNull(),
});