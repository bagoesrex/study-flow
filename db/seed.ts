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
