import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN"]);

export const studyPlanStatusEnum = pgEnum("study_plan_status", [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "PAUSED",
  "CANCELLED",
]);

export const priorityEnum = pgEnum("priority", ["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const taskStatusEnum = pgEnum("task_status", ["TODO", "IN_PROGRESS", "DONE"]);

export const moodEnum = pgEnum("mood", ["FOCUSED", "NORMAL", "TIRED", "DISTRACTED"]);

export const feedbackTypeEnum = pgEnum("feedback_type", ["BUG", "FEATURE_REQUEST", "GENERAL"]);

export const feedbackStatusEnum = pgEnum("feedback_status", ["OPEN", "REVIEWED", "CLOSED"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash"),
    image: text("image"),
    role: userRoleEnum("role").default("USER").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  })
);

export const subjects = pgTable(
  "subjects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description"),
    color: varchar("color", { length: 20 }).default("#4F46E5").notNull(),
    targetHours: integer("target_hours"),
    isArchived: boolean("is_archived").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("subjects_user_id_idx").on(table.userId),
    userNameIdx: uniqueIndex("subjects_user_name_idx").on(table.userId, table.name),
  })
);

export const studyPlans = pgTable(
  "study_plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 180 }).notNull(),
    description: text("description"),
    goal: text("goal"),
    startDate: date("start_date"),
    endDate: date("end_date"),
    status: studyPlanStatusEnum("status").default("NOT_STARTED").notNull(),
    priority: priorityEnum("priority").default("MEDIUM").notNull(),
    estimatedHours: integer("estimated_hours"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("study_plans_user_id_idx").on(table.userId),
    subjectIdx: index("study_plans_subject_id_idx").on(table.subjectId),
    statusIdx: index("study_plans_status_idx").on(table.status),
  })
);

export const studyTasks = pgTable(
  "study_tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    studyPlanId: uuid("study_plan_id")
      .notNull()
      .references(() => studyPlans.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 180 }).notNull(),
    description: text("description"),
    status: taskStatusEnum("status").default("TODO").notNull(),
    priority: priorityEnum("priority").default("MEDIUM").notNull(),
    dueDate: date("due_date"),
    position: integer("position").default(0).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("study_tasks_user_id_idx").on(table.userId),
    studyPlanIdx: index("study_tasks_study_plan_id_idx").on(table.studyPlanId),
    statusIdx: index("study_tasks_status_idx").on(table.status),
    dueDateIdx: index("study_tasks_due_date_idx").on(table.dueDate),
  })
);

export const studySessions = pgTable(
  "study_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    studyPlanId: uuid("study_plan_id").references(() => studyPlans.id, {
      onDelete: "set null",
    }),
    taskId: uuid("task_id").references(() => studyTasks.id, {
      onDelete: "set null",
    }),
    durationMinutes: integer("duration_minutes").notNull(),
    note: text("note"),
    mood: moodEnum("mood").default("NORMAL").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("study_sessions_user_id_idx").on(table.userId),
    subjectIdx: index("study_sessions_subject_id_idx").on(table.subjectId),
    studyPlanIdx: index("study_sessions_study_plan_id_idx").on(table.studyPlanId),
    taskIdx: index("study_sessions_task_id_idx").on(table.taskId),
    startedAtIdx: index("study_sessions_started_at_idx").on(table.startedAt),
  })
);

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    name: varchar("name", { length: 120 }).notNull(),
    role: varchar("role", { length: 120 }),
    message: text("message").notNull(),
    rating: integer("rating").default(5).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("testimonials_user_id_idx").on(table.userId),
    publishedIdx: index("testimonials_is_published_idx").on(table.isPublished),
  })
);

export const feedbacks = pgTable(
  "feedbacks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    type: feedbackTypeEnum("type").default("GENERAL").notNull(),
    message: text("message").notNull(),
    status: feedbackStatusEnum("status").default("OPEN").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("feedbacks_user_id_idx").on(table.userId),
    typeIdx: index("feedbacks_type_idx").on(table.type),
    statusIdx: index("feedbacks_status_idx").on(table.status),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;

export type StudyPlan = typeof studyPlans.$inferSelect;
export type NewStudyPlan = typeof studyPlans.$inferInsert;

export type StudyTask = typeof studyTasks.$inferSelect;
export type NewStudyTask = typeof studyTasks.$inferInsert;

export type StudySession = typeof studySessions.$inferSelect;
export type NewStudySession = typeof studySessions.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export type Feedback = typeof feedbacks.$inferSelect;
export type NewFeedback = typeof feedbacks.$inferInsert;

export const databaseHealthCheck = sql`select 1`;
