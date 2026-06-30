# ISSUE-003 — Setup Drizzle and PostgreSQL Schema

## Status

Planned

## Priority

High

## Type

Database / Data Layer

## Summary

Setup Drizzle ORM dan PostgreSQL untuk project StudyFlow. Issue ini fokus membuat pondasi database, konfigurasi Drizzle, schema tabel utama, migration script, database connection, dan seed data awal.

Folder database diletakkan langsung di root project:

```txt
db/
├── index.ts
├── schema.ts
├── relations.ts
└── seed.ts
```

Bukan di dalam `src/`.

## Background

Pada issue sebelumnya, project sudah memiliki setup UI foundation menggunakan Radix UI primitives dan custom Tailwind components.

Pada issue ini, project mulai masuk ke data layer. StudyFlow membutuhkan database relasional karena aplikasi memiliki data yang saling berhubungan:

```txt
User → Subject → Study Plan → Task → Study Session
```

Database yang digunakan adalah PostgreSQL, sedangkan ORM yang digunakan adalah Drizzle ORM.

## Goals

- Menginstall Drizzle ORM.
- Menginstall Drizzle Kit.
- Menginstall PostgreSQL driver `pg`.
- Menginstall `dotenv`, `tsx`, dan `@types/pg`.
- Membuat file environment database.
- Membuat konfigurasi `drizzle.config.ts`.
- Membuat folder `db/` di root project.
- Membuat database connection helper.
- Membuat schema tabel utama StudyFlow.
- Membuat enum database.
- Membuat relasi dasar antar tabel.
- Membuat script migration.
- Membuat script push schema.
- Membuat script Drizzle Studio.
- Membuat seed data awal.
- Memastikan migration berhasil dijalankan.
- Memastikan database bisa diakses dari project.

## Non-Goals

- Tidak membuat authentication flow.
- Tidak membuat login/register.
- Tidak membuat protected route.
- Tidak membuat CRUD UI.
- Tidak membuat dashboard data real.
- Tidak membuat API endpoint.
- Tidak membuat Server Actions.
- Tidak membuat AI feature.
- Tidak membuat production deployment.
- Tidak setup storage/upload.

## Tech Stack

- Drizzle ORM
- Drizzle Kit
- PostgreSQL
- node-postgres / `pg`
- dotenv
- tsx
- TypeScript
- Next.js App Router

## Required Packages

Install dependencies:

```bash
pnpm add drizzle-orm pg dotenv
```

Install dev dependencies:

```bash
pnpm add -D drizzle-kit tsx @types/pg
```

## Environment Variables

Buat file:

```txt
.env
```

Isi:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/studyflow"
```

Buat juga file contoh:

```txt
.env.example
```

Isi:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/studyflow"
```

Catatan:

- Jangan commit file `.env`.
- File `.env.example` boleh dicommit.
- Untuk local development, bisa menggunakan PostgreSQL lokal, Supabase, Neon, atau database PostgreSQL lain.

## Root Folder Structure

Karena project tidak memakai `src/`, gunakan struktur seperti ini:

```txt
app/
components/
constants/
db/
features/
hooks/
lib/
types/
utils/
```

Folder database:

```txt
db/
├── index.ts
├── schema.ts
├── relations.ts
└── seed.ts
```

## Import Alias Check

Pastikan `tsconfig.json` menggunakan alias root project, bukan `src`.

Cek file:

```txt
tsconfig.json
```

Pastikan bagian `paths` seperti ini:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Jika masih seperti ini:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

ubah menjadi:

```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

Tujuannya agar import seperti ini bisa berjalan:

```ts
import { db } from "@/db";
import { users } from "@/db/schema";
```

## Database Tables

Tabel utama yang dibuat pada issue ini:

```txt
users
subjects
study_plans
study_tasks
study_sessions
testimonials
feedbacks
```

Tabel opsional seperti `goals`, `achievements`, `user_achievements`, dan `ai_generations` belum dibuat di issue ini agar MVP tidak terlalu besar.

## Entity Relationship Overview

```txt
users
 ├── subjects
 │    ├── study_plans
 │    │    ├── study_tasks
 │    │    └── study_sessions
 │    └── study_sessions
 │
 ├── testimonials
 └── feedbacks
```

## Implementation Steps

### 1. Install Drizzle Dependencies

Jalankan:

```bash
pnpm add drizzle-orm pg dotenv
pnpm add -D drizzle-kit tsx @types/pg
```

Setelah itu jalankan:

```bash
pnpm lint
pnpm format
```

Expected:

```txt
Tidak ada error lint dan format.
```

---

### 2. Create Drizzle Config

Buat file di root project:

```txt
drizzle.config.ts
```

Isi:

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Fungsi file ini:

```txt
schema = lokasi schema Drizzle
out = folder hasil migration
dialect = jenis database
dbCredentials = koneksi database
```

---

### 3. Create Database Folder

Buat folder:

```txt
db/
```

Struktur yang dibuat:

```txt
db/
├── index.ts
├── schema.ts
├── relations.ts
└── seed.ts
```

---

### 4. Create Database Connection

Buat file:

```txt
db/index.ts
```

Isi:

```ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as relations from "./relations";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, {
  schema: {
    ...schema,
    ...relations,
  },
});
```

Catatan:

- `Pool` digunakan agar koneksi database bisa dipakai ulang.
- Jangan membuat banyak instance pool di banyak file.
- Semua query database nanti sebaiknya menggunakan `db` dari file ini.
- Karena file ada di root `db/`, gunakan relative import untuk file internal database.

---

### 5. Create Database Schema

Buat file:

```txt
db/schema.ts
```

Isi:

```ts
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
```

Catatan schema:

- Menggunakan `uuid` untuk primary key.
- Menggunakan `pgEnum` agar status dan role lebih aman.
- Menggunakan `index` untuk kolom yang sering difilter.
- Menggunakan `uniqueIndex` untuk email user.
- Menggunakan `onDelete: "cascade"` untuk data milik user.
- Menggunakan `onDelete: "set null"` untuk data histori yang tetap boleh tersimpan.

---

### 6. Create Relations File

Buat file:

```txt
db/relations.ts
```

Isi:

```ts
import { relations } from "drizzle-orm";

import {
  feedbacks,
  studyPlans,
  studySessions,
  studyTasks,
  subjects,
  testimonials,
  users,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  subjects: many(subjects),
  studyPlans: many(studyPlans),
  studyTasks: many(studyTasks),
  studySessions: many(studySessions),
  testimonials: many(testimonials),
  feedbacks: many(feedbacks),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  user: one(users, {
    fields: [subjects.userId],
    references: [users.id],
  }),
  studyPlans: many(studyPlans),
  studySessions: many(studySessions),
}));

export const studyPlansRelations = relations(studyPlans, ({ one, many }) => ({
  user: one(users, {
    fields: [studyPlans.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [studyPlans.subjectId],
    references: [subjects.id],
  }),
  tasks: many(studyTasks),
  sessions: many(studySessions),
}));

export const studyTasksRelations = relations(studyTasks, ({ one, many }) => ({
  user: one(users, {
    fields: [studyTasks.userId],
    references: [users.id],
  }),
  studyPlan: one(studyPlans, {
    fields: [studyTasks.studyPlanId],
    references: [studyPlans.id],
  }),
  sessions: many(studySessions),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, {
    fields: [studySessions.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [studySessions.subjectId],
    references: [subjects.id],
  }),
  studyPlan: one(studyPlans, {
    fields: [studySessions.studyPlanId],
    references: [studyPlans.id],
  }),
  task: one(studyTasks, {
    fields: [studySessions.taskId],
    references: [studyTasks.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  user: one(users, {
    fields: [testimonials.userId],
    references: [users.id],
  }),
}));

export const feedbacksRelations = relations(feedbacks, ({ one }) => ({
  user: one(users, {
    fields: [feedbacks.userId],
    references: [users.id],
  }),
}));
```

Catatan:

- File `relations.ts` dipisahkan agar `schema.ts` tidak terlalu panjang.
- Relasi ini berguna untuk query nested data di fase berikutnya.
- Karena file ada di root `db/`, gunakan import relatif dari `./schema`.

---

### 7. Add Database Scripts

Edit `package.json`.

Tambahkan scripts berikut:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx db/seed.ts"
  }
}
```

Jika script lama sudah ada, jangan hapus. Gabungkan saja dengan script existing:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx db/seed.ts"
  }
}
```

---

### 8. Generate Migration

Jalankan:

```bash
pnpm db:generate
```

Expected:

```txt
Folder drizzle/ berhasil dibuat.
File migration SQL berhasil dibuat.
Tidak ada error pada schema.
```

Contoh struktur:

```txt
drizzle/
├── 0000_initial_schema.sql
└── meta/
```

Nama file migration bisa berbeda tergantung Drizzle Kit.

---

### 9. Apply Migration

Jalankan:

```bash
pnpm db:migrate
```

Expected:

```txt
Migration berhasil dijalankan ke database PostgreSQL.
Tabel users, subjects, study_plans, study_tasks, study_sessions, testimonials, dan feedbacks berhasil dibuat.
```

Alternatif untuk development cepat:

```bash
pnpm db:push
```

Catatan:

- Gunakan `db:generate` + `db:migrate` untuk workflow migration yang lebih rapi.
- Gunakan `db:push` hanya untuk iterasi cepat saat local development.

---

### 10. Create Seed File

Buat file:

```txt
db/seed.ts
```

Isi:

```ts
import "dotenv/config";

import { db } from "./index";
import {
  feedbacks,
  studyPlans,
  studySessions,
  studyTasks,
  subjects,
  testimonials,
  users,
} from "./schema";

async function main() {
  console.log("Seeding database...");

  const [user] = await db
    .insert(users)
    .values({
      name: "Bagus Rex",
      email: "bagus@example.com",
      passwordHash: null,
      role: "USER",
      image: null,
    })
    .returning();

  const [nextSubject] = await db
    .insert(subjects)
    .values({
      userId: user.id,
      name: "Next.js",
      description: "Belajar Next.js fullstack dengan App Router.",
      color: "#4F46E5",
      targetHours: 40,
    })
    .returning();

  const [djangoSubject] = await db
    .insert(subjects)
    .values({
      userId: user.id,
      name: "Django",
      description: "Belajar integrasi Django API untuk project skripsi.",
      color: "#06B6D4",
      targetHours: 30,
    })
    .returning();

  const [nextPlan] = await db
    .insert(studyPlans)
    .values({
      userId: user.id,
      subjectId: nextSubject.id,
      title: "Belajar Next.js Fullstack",
      description:
        "Membangun aplikasi fullstack menggunakan Next.js, Drizzle, PostgreSQL, dan dashboard analytics.",
      goal: "Mampu membuat aplikasi fullstack portfolio-ready.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      estimatedHours: 40,
      startDate: "2026-07-01",
      endDate: "2026-07-14",
    })
    .returning();

  const [djangoPlan] = await db
    .insert(studyPlans)
    .values({
      userId: user.id,
      subjectId: djangoSubject.id,
      title: "Belajar Django API Integration",
      description:
        "Mempelajari struktur API, integrasi data, dan dashboard berbasis data warehouse.",
      goal: "Mampu mengintegrasikan API warehouse ke sistem Django.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      estimatedHours: 30,
      startDate: "2026-07-01",
      endDate: "2026-07-21",
    })
    .returning();

  const [taskOne] = await db
    .insert(studyTasks)
    .values({
      userId: user.id,
      studyPlanId: nextPlan.id,
      title: "Setup Next.js project",
      description: "Setup project dengan TypeScript, Tailwind, Prettier, dan Husky.",
      status: "DONE",
      priority: "HIGH",
      dueDate: "2026-07-01",
      position: 1,
      completedAt: new Date(),
    })
    .returning();

  await db.insert(studyTasks).values([
    {
      userId: user.id,
      studyPlanId: nextPlan.id,
      title: "Setup Drizzle and PostgreSQL schema",
      description: "Membuat schema database awal StudyFlow.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDate: "2026-07-02",
      position: 2,
    },
    {
      userId: user.id,
      studyPlanId: nextPlan.id,
      title: "Build authentication flow",
      description: "Membuat register, login, logout, dan protected route.",
      status: "TODO",
      priority: "HIGH",
      dueDate: "2026-07-04",
      position: 3,
    },
    {
      userId: user.id,
      studyPlanId: djangoPlan.id,
      title: "Review Django API structure",
      description: "Mempelajari endpoint dan data response dari API warehouse.",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: "2026-07-05",
      position: 1,
    },
  ]);

  await db.insert(studySessions).values([
    {
      userId: user.id,
      subjectId: nextSubject.id,
      studyPlanId: nextPlan.id,
      taskId: taskOne.id,
      durationMinutes: 90,
      note: "Belajar setup project dan struktur folder awal.",
      mood: "FOCUSED",
      startedAt: new Date("2026-07-01T09:00:00+07:00"),
      endedAt: new Date("2026-07-01T10:30:00+07:00"),
    },
    {
      userId: user.id,
      subjectId: nextSubject.id,
      studyPlanId: nextPlan.id,
      durationMinutes: 60,
      note: "Merapikan komponen UI dasar dan layout dashboard.",
      mood: "NORMAL",
      startedAt: new Date("2026-07-01T20:00:00+07:00"),
      endedAt: new Date("2026-07-01T21:00:00+07:00"),
    },
  ]);

  await db.insert(testimonials).values([
    {
      userId: user.id,
      name: "Bagus Rex",
      role: "Fullstack Developer",
      message: "StudyFlow membantu saya menyusun target belajar coding dengan lebih terarah.",
      rating: 5,
      isPublished: true,
    },
    {
      name: "Demo User",
      role: "Student",
      message: "Dashboard-nya clean dan progres belajar jadi lebih mudah dipantau.",
      rating: 5,
      isPublished: true,
    },
  ]);

  await db.insert(feedbacks).values({
    userId: user.id,
    type: "FEATURE_REQUEST",
    message: "Tambahkan fitur calendar view untuk deadline belajar.",
    status: "OPEN",
  });

  console.log("Database seeded successfully.");
}

main().catch((error) => {
  console.error("Failed to seed database:");
  console.error(error);
  process.exit(1);
});
```

---

### 11. Run Seed

Jalankan:

```bash
pnpm db:seed
```

Expected:

```txt
Database seeded successfully.
```

Jika seed dijalankan lebih dari sekali, kemungkinan error karena email `bagus@example.com` sudah ada. Untuk MVP, ini tidak masalah.

Nanti bisa dibuat seed yang idempotent di issue terpisah.

---

### 12. Open Drizzle Studio

Jalankan:

```bash
pnpm db:studio
```

Expected:

```txt
Drizzle Studio terbuka.
Tabel database bisa dilihat.
Data seed bisa dicek.
```

Cek tabel:

```txt
users
subjects
study_plans
study_tasks
study_sessions
testimonials
feedbacks
```

## Expected Folder Structure

Setelah issue selesai:

```txt
app/
components/
constants/
db/
├── index.ts
├── relations.ts
├── schema.ts
└── seed.ts
drizzle/
├── meta/
└── *.sql
features/
hooks/
lib/
types/
utils/

.env.example
drizzle.config.ts
package.json
```

## Acceptance Criteria

- Package `drizzle-orm` berhasil diinstall.
- Package `pg` berhasil diinstall.
- Package `dotenv` berhasil diinstall.
- Package `drizzle-kit` berhasil diinstall.
- Package `tsx` berhasil diinstall.
- Package `@types/pg` berhasil diinstall.
- File `.env.example` tersedia.
- File `drizzle.config.ts` tersedia.
- Folder `db/` tersedia di root project.
- File `db/index.ts` tersedia.
- File `db/schema.ts` tersedia.
- File `db/relations.ts` tersedia.
- File `db/seed.ts` tersedia.
- Schema `users` berhasil dibuat.
- Schema `subjects` berhasil dibuat.
- Schema `study_plans` berhasil dibuat.
- Schema `study_tasks` berhasil dibuat.
- Schema `study_sessions` berhasil dibuat.
- Schema `testimonials` berhasil dibuat.
- Schema `feedbacks` berhasil dibuat.
- Enum database berhasil dibuat.
- Index database berhasil dibuat.
- Relation database berhasil dibuat.
- Script `db:generate` tersedia.
- Script `db:migrate` tersedia.
- Script `db:push` tersedia.
- Script `db:studio` tersedia.
- Script `db:seed` tersedia.
- Command `pnpm db:generate` berhasil.
- Command `pnpm db:migrate` berhasil.
- Command `pnpm db:seed` berhasil.
- Command `pnpm db:studio` berhasil.
- Tidak ada folder database di dalam `src/`.
- Tidak ada import path `@/src/db`.
- Tidak ada error TypeScript.
- Tidak ada error lint.
- Tidak ada fitur auth atau CRUD UI yang dibuat di issue ini.

## Testing Checklist

Jalankan:

```bash
pnpm db:generate
```

Expected:

```txt
Migration file berhasil dibuat di folder drizzle.
```

Jalankan:

```bash
pnpm db:migrate
```

Expected:

```txt
Migration berhasil diterapkan ke PostgreSQL.
```

Jalankan:

```bash
pnpm db:seed
```

Expected:

```txt
Database seeded successfully.
```

Jalankan:

```bash
pnpm db:studio
```

Expected:

```txt
Drizzle Studio terbuka dan data bisa dilihat.
```

Jalankan:

```bash
pnpm lint
```

Expected:

```txt
Tidak ada lint error.
```

Jalankan:

```bash
pnpm format:check
```

Expected:

```txt
Semua file sesuai format Prettier.
```

## Notes

- Jangan membuat auth di issue ini.
- Jangan membuat form CRUD di issue ini.
- Jangan membuat dashboard data real di issue ini.
- Jangan membuat API route di issue ini.
- Jangan membuat Server Actions di issue ini.
- Jangan membuat folder database di dalam `src/`.
- Gunakan folder root `db/`.
- Gunakan `db:generate` dan `db:migrate` untuk workflow yang rapi.
- Gunakan `db:push` hanya untuk local development cepat.
- Jangan commit `.env`.
- Commit `.env.example`.
- Jika menggunakan Supabase atau Neon, pastikan `DATABASE_URL` sudah sesuai.
- Jika database butuh SSL, konfigurasi koneksi bisa disesuaikan pada `Pool`.

## Suggested Commit Message

```bash
feat: setup drizzle and postgresql schema
```
