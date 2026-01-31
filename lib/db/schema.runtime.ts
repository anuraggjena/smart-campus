import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", {
    enum: ["STUDENT", "HOD", "ADMIN"],
  }).notNull(),
  departmentId: text("department_id").notNull()
  .references(() => departments.id),
  isHosteller: integer("is_hosteller", { mode: "boolean" })
    .default(false),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const departments = sqliteTable("departments", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),   // CSE, ECE, MECH
  name: text("name").notNull(),            // Computer Science Engineering
});

export const offices = sqliteTable("offices", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
});


export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const campusServices = sqliteTable("campus_services", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category", {
    enum: [
      "HOSTEL",
      "TRANSPORT",
      "FEES",
      "SCHOLARSHIP",
      "LIBRARY",
      "GENERAL",
    ],
  }).notNull(),
  owningOffice: text("owning_office").notNull()
  .references(() => offices.id),
  // Visibility control
  visibility: text("visibility", {
    enum: ["ALL_STUDENTS", "HOSTELLERS_ONLY"],
  })
    .notNull()
    .default("ALL_STUDENTS"),
  isActive: integer("is_active", { mode: "boolean" })
    .notNull()
    .default(true),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const announcements = sqliteTable("announcements", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  // Targeting
  audience: text("audience", {
    enum: ["ALL", "STUDENTS", "HODS"],
  })
    .notNull()
    .default("ALL"),
  visibility: text("visibility", {
    enum: ["ALL_STUDENTS", "HOSTELLERS_ONLY"],
  })
    .notNull()
    .default("ALL_STUDENTS"),
  departmentId: text("department_id").notNull()
  .references(() => departments.id),
  priority: text("priority", {
    enum: ["NORMAL", "IMPORTANT", "URGENT"],
  })
    .notNull()
    .default("NORMAL"),
  activeFrom: text("active_from").notNull(),
  activeUntil: text("active_until"), // nullable
  isActive: integer("is_active", { mode: "boolean" })
    .notNull()
    .default(true),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const policies = sqliteTable("policies", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  domain: text("domain", {
    enum: [
      "FEES",
      "EXAMS",
      "HOSTEL",
      "ACADEMICS",
      "GENERAL",
    ],
  }).notNull(),
  owningOffice: text("owning_office").notNull()
  .references(() => offices.id),
  content: text("content").notNull(),
  version: text("version").notNull(),
  isActive: integer("is_active", { mode: "boolean" })
    .notNull()
    .default(true),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const studentInteractions = sqliteTable("student_interactions", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").notNull(),
  departmentId: text("department_id").notNull()
  .references(() => departments.id),
  role: text("role").notNull(), // STUDENT (future-proof)
  intent: text("intent").notNull(), // FEES, EXAMS, HOSTEL, etc.
  policyCode: text("policy_code"), 
  // nullable: not every query maps to a policy
  aiConfidence: integer("ai_confidence"), 
  // 0–100
  followUp: integer("follow_up", { mode: "boolean" })
    .notNull()
    .default(false),
  // true if student asked again in same domain
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const academicEvents = sqliteTable("academic_events", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  departmentId: text("department_id").notNull()
  .references(() => departments.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type", {
    enum: ["EXAM", "ASSESSMENT", "SCHEDULE"],
  }).notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  createdByRole: text("created_by_role").notNull(), // HOD
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const procedures = sqliteTable("procedures", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  code: text("code").notNull().unique(),
  // e.g. LEAVE_APPLICATION, EXAM_REVALUATION
  title: text("title").notNull(),
  domain: text("domain", {
    enum: [
      "ACADEMICS",
      "EXAMS",
      "FEES",
      "HOSTEL",
      "GENERAL",
    ],
  }).notNull(),
  stepsJson: text("steps_json").notNull(),
  // JSON array of steps
  owningOffice: text("owning_office").notNull()
  .references(() => offices.id),
  isActive: integer("is_active", { mode: "boolean" })
    .notNull()
    .default(true),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const feedback = sqliteTable("feedback", {
  id: text("id")
    .primaryKey()
    .default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").notNull(),
  departmentId: text("department_id").notNull()
  .references(() => departments.id),
  domain: text("domain", {
    enum: [
      "ACADEMICS",
      "EXAMS",
      "FEES",
      "HOSTEL",
      "GENERAL",
    ],
  }).notNull(),
  message: text("message").notNull(),
  sentiment: text("sentiment", {
    enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"],
  }),
  priority: text("priority", {
    enum: ["LOW", "MEDIUM", "HIGH"],
  }),
  status: text("status", {
    enum: ["OPEN", "REVIEWED"],
  })
    .default("OPEN")
    .notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});