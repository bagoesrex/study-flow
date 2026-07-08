# ISSUE-011 — Build Analytics Dashboard

## Status

Planned

## Priority

High

## Type

Feature / Analytics Dashboard

## Summary

Membangun fitur Analytics Dashboard untuk StudyFlow. Analytics Dashboard digunakan untuk menampilkan ringkasan produktivitas belajar user berdasarkan data subject, study plan, task, dan study session.

Data analytics harus diambil dari database milik user yang sedang login, bukan dummy data.

Contoh analytics yang ditampilkan:

```txt
Total study hours
Weekly study hours
Task completion rate
Study plan progress
Most studied subject
Study hours by subject
Task status distribution
Recent study activity
```

Issue ini melanjutkan fitur Study Session Tracker. Setelah user bisa mencatat sesi belajar, aplikasi perlu menampilkan insight visual agar user bisa memahami progres belajarnya.

## Background

Flow utama StudyFlow:

```txt
User → Subject → Study Plan → Task → Study Session → Analytics
```

Pada issue sebelumnya, user sudah bisa membuat:

```txt
Subject
Study Plan
Task
Study Session
```

Pada issue ini, data tersebut akan digunakan untuk membuat dashboard analytics.

Route utama:

```txt
/dashboard/analytics
```

Analytics Dashboard adalah salah satu fitur penting untuk portfolio karena menunjukkan kemampuan:

```txt
Database query
Aggregation
Data visualization
Dashboard UI
Chart rendering
User-specific data
Fullstack data flow
```

## Goals

- Membuat halaman Analytics Dashboard.
- Mengambil data analytics dari database.
- Menampilkan total study hours.
- Menampilkan total study sessions.
- Menampilkan completed tasks.
- Menampilkan task completion rate.
- Menampilkan active study plans.
- Menampilkan weekly study hours.
- Menampilkan study hours by subject.
- Menampilkan task status distribution.
- Menampilkan most studied subject.
- Menampilkan recent study sessions.
- Membuat chart menggunakan Recharts.
- Data fetching menggunakan TanStack Query.
- Query analytics menggunakan Server Actions di folder root `actions/`.
- Semua action wajib memvalidasi session user.
- Semua query database wajib filter berdasarkan `userId`.
- Menampilkan empty state jika data analytics masih kosong.
- Menampilkan loading state.
- Menampilkan error state.
- UI mengikuti clean white dashboard style StudyFlow.

## Non-Goals

- Tidak membuat CRUD baru.
- Tidak membuat Study Plan progress detail page.
- Tidak membuat calendar view.
- Tidak membuat export PDF/CSV.
- Tidak membuat AI productivity insight.
- Tidak membuat real-time analytics.
- Tidak membuat admin analytics.
- Tidak membuat API route.
- Tidak mengubah schema database.
- Tidak menambahkan shadcn/ui.
- Tidak membuat payment/pricing analytics.

## Tech Stack

- Next.js App Router
- TypeScript
- Drizzle ORM
- PostgreSQL
- Server Actions
- TanStack Query
- Recharts
- Tailwind CSS
- Custom UI Components
- Lucide React

## Required Package

Install Recharts jika belum tersedia:

```bash
pnpm add recharts
```

## Route

Fitur ini berada di:

```txt
/dashboard/analytics
```

## Data Source

Gunakan tabel:

```txt
subjects
study_plans
study_tasks
study_sessions
```

Data harus berdasarkan user login:

```txt
subjects.user_id = session.user.id
study_plans.user_id = session.user.id
study_tasks.user_id = session.user.id
study_sessions.user_id = session.user.id
```

## Analytics Metrics

Minimal metrics yang harus dihitung:

```txt
totalStudyHours
totalStudySessions
totalCompletedTasks
totalTasks
taskCompletionRate
activeStudyPlans
mostStudiedSubject
weeklyStudyHours
studyHoursBySubject
taskStatusDistribution
recentStudySessions
```

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
actions/
└── analytics.ts

app/
└── dashboard/
    └── analytics/
        └── page.tsx

features/
└── analytics/
    ├── components/
    │   ├── analytics-empty-state.tsx
    │   ├── analytics-overview-cards.tsx
    │   ├── recent-study-sessions-card.tsx
    │   ├── study-hours-by-subject-chart.tsx
    │   ├── task-status-chart.tsx
    │   └── weekly-study-hours-chart.tsx
    ├── hooks/
    │   └── use-analytics-query.ts
    └── utils/
        └── analytics-format.ts

types/
└── analytics.ts
```

## Implementation Steps

### 1. Install Recharts

Jalankan:

```bash
pnpm add recharts
```

Lalu jalankan:

```bash
pnpm lint
pnpm format
```

Expected:

```txt
Tidak ada error lint dan format.
```

---

### 2. Create Analytics Types

Buat file:

```txt
types/analytics.ts
```

Isi:

```ts
export type AnalyticsOverview = {
  totalStudyHours: number;
  totalStudySessions: number;
  totalCompletedTasks: number;
  totalTasks: number;
  taskCompletionRate: number;
  activeStudyPlans: number;
  mostStudiedSubject: string | null;
};

export type WeeklyStudyHourItem = {
  date: string;
  label: string;
  minutes: number;
  hours: number;
};

export type StudyHoursBySubjectItem = {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  minutes: number;
  hours: number;
};

export type TaskStatusItem = {
  status: "TODO" | "IN_PROGRESS" | "DONE";
  total: number;
};

export type RecentStudySessionItem = {
  id: string;
  subjectName: string;
  subjectColor: string;
  studyPlanTitle: string | null;
  taskTitle: string | null;
  durationMinutes: number;
  mood: "FOCUSED" | "NORMAL" | "TIRED" | "DISTRACTED";
  startedAt: Date;
};

export type AnalyticsData = {
  overview: AnalyticsOverview;
  weeklyStudyHours: WeeklyStudyHourItem[];
  studyHoursBySubject: StudyHoursBySubjectItem[];
  taskStatusDistribution: TaskStatusItem[];
  recentStudySessions: RecentStudySessionItem[];
};
```

---

### 3. Create Analytics Format Utilities

Buat file:

```txt
features/analytics/utils/analytics-format.ts
```

Isi:

```ts
export function formatHours(hours: number) {
  return `${hours.toFixed(1)}h`;
}

export function formatMinutesToHours(minutes: number) {
  return Number((minutes / 60).toFixed(1));
}

export function formatPercentage(value: number) {
  return `${value}%`;
}

export function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
```

---

### 4. Create Analytics Actions

Buat file:

```txt
actions/analytics.ts
```

Isi:

```ts
"use server";

import { and, desc, eq, gte, sql } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, studySessions, studyTasks, subjects } from "@/db/schema";
import type { ActionResponse } from "@/types/action-response";
import type {
  AnalyticsData,
  RecentStudySessionItem,
  StudyHoursBySubjectItem,
  TaskStatusItem,
  WeeklyStudyHourItem,
} from "@/types/analytics";

async function requireAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

function getLastSevenDays() {
  const days: Date[] = [];

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    date.setHours(0, 0, 0, 0);
    days.push(date);
  }

  return days;
}

function formatDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
  }).format(date);
}

export async function getAnalyticsAction(): Promise<ActionResponse<AnalyticsData>> {
  try {
    const user = await requireAuthUser();

    const [sessionOverview] = await db
      .select({
        totalMinutes: sql<number>`coalesce(sum(${studySessions.durationMinutes}), 0)::int`,
        totalSessions: sql<number>`count(${studySessions.id})::int`,
      })
      .from(studySessions)
      .where(eq(studySessions.userId, user.id));

    const [taskOverview] = await db
      .select({
        totalTasks: sql<number>`count(${studyTasks.id})::int`,
        completedTasks: sql<number>`count(case when ${studyTasks.status} = 'DONE' then 1 end)::int`,
      })
      .from(studyTasks)
      .where(eq(studyTasks.userId, user.id));

    const [planOverview] = await db
      .select({
        activeStudyPlans: sql<number>`count(${studyPlans.id})::int`,
      })
      .from(studyPlans)
      .where(
        and(
          eq(studyPlans.userId, user.id),
          sql`${studyPlans.status} in ('NOT_STARTED', 'IN_PROGRESS', 'PAUSED')`
        )
      );

    const totalTasks = taskOverview.totalTasks;
    const totalCompletedTasks = taskOverview.completedTasks;
    const taskCompletionRate =
      totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

    const studyHoursBySubjectRaw = await db
      .select({
        subjectId: subjects.id,
        subjectName: subjects.name,
        subjectColor: subjects.color,
        minutes: sql<number>`coalesce(sum(${studySessions.durationMinutes}), 0)::int`,
      })
      .from(studySessions)
      .innerJoin(subjects, eq(studySessions.subjectId, subjects.id))
      .where(eq(studySessions.userId, user.id))
      .groupBy(subjects.id, subjects.name, subjects.color)
      .orderBy(sql`coalesce(sum(${studySessions.durationMinutes}), 0) desc`);

    const studyHoursBySubject: StudyHoursBySubjectItem[] = studyHoursBySubjectRaw.map((item) => ({
      subjectId: item.subjectId,
      subjectName: item.subjectName,
      subjectColor: item.subjectColor,
      minutes: item.minutes,
      hours: Number((item.minutes / 60).toFixed(1)),
    }));

    const mostStudiedSubject =
      studyHoursBySubject.length > 0 ? studyHoursBySubject[0].subjectName : null;

    const taskStatusDistribution = await db
      .select({
        status: studyTasks.status,
        total: sql<number>`count(${studyTasks.id})::int`,
      })
      .from(studyTasks)
      .where(eq(studyTasks.userId, user.id))
      .groupBy(studyTasks.status);

    const normalizedTaskStatusDistribution: TaskStatusItem[] = [
      {
        status: "TODO",
        total: taskStatusDistribution.find((item) => item.status === "TODO")?.total ?? 0,
      },
      {
        status: "IN_PROGRESS",
        total: taskStatusDistribution.find((item) => item.status === "IN_PROGRESS")?.total ?? 0,
      },
      {
        status: "DONE",
        total: taskStatusDistribution.find((item) => item.status === "DONE")?.total ?? 0,
      },
    ];

    const lastSevenDays = getLastSevenDays();
    const sevenDaysAgo = lastSevenDays[0];

    const weeklyRaw = await db
      .select({
        date: sql<string>`to_char(${studySessions.startedAt}, 'YYYY-MM-DD')`,
        minutes: sql<number>`coalesce(sum(${studySessions.durationMinutes}), 0)::int`,
      })
      .from(studySessions)
      .where(and(eq(studySessions.userId, user.id), gte(studySessions.startedAt, sevenDaysAgo)))
      .groupBy(sql`to_char(${studySessions.startedAt}, 'YYYY-MM-DD')`);

    const weeklyStudyHours: WeeklyStudyHourItem[] = lastSevenDays.map((day) => {
      const dateKey = formatDateKey(day);
      const data = weeklyRaw.find((item) => item.date === dateKey);
      const minutes = data?.minutes ?? 0;

      return {
        date: dateKey,
        label: formatDayLabel(day),
        minutes,
        hours: Number((minutes / 60).toFixed(1)),
      };
    });

    const recentStudySessionsRaw = await db
      .select({
        id: studySessions.id,
        subjectName: subjects.name,
        subjectColor: subjects.color,
        studyPlanTitle: studyPlans.title,
        taskTitle: studyTasks.title,
        durationMinutes: studySessions.durationMinutes,
        mood: studySessions.mood,
        startedAt: studySessions.startedAt,
      })
      .from(studySessions)
      .innerJoin(subjects, eq(studySessions.subjectId, subjects.id))
      .leftJoin(studyPlans, eq(studySessions.studyPlanId, studyPlans.id))
      .leftJoin(studyTasks, eq(studySessions.taskId, studyTasks.id))
      .where(eq(studySessions.userId, user.id))
      .orderBy(desc(studySessions.startedAt))
      .limit(5);

    const recentStudySessions: RecentStudySessionItem[] = recentStudySessionsRaw.map((item) => ({
      id: item.id,
      subjectName: item.subjectName,
      subjectColor: item.subjectColor,
      studyPlanTitle: item.studyPlanTitle,
      taskTitle: item.taskTitle,
      durationMinutes: item.durationMinutes,
      mood: item.mood,
      startedAt: item.startedAt,
    }));

    return {
      success: true,
      message: "Analytics berhasil diambil.",
      data: {
        overview: {
          totalStudyHours: Number((sessionOverview.totalMinutes / 60).toFixed(1)),
          totalStudySessions: sessionOverview.totalSessions,
          totalCompletedTasks,
          totalTasks,
          taskCompletionRate,
          activeStudyPlans: planOverview.activeStudyPlans,
          mostStudiedSubject,
        },
        weeklyStudyHours,
        studyHoursBySubject,
        taskStatusDistribution: normalizedTaskStatusDistribution,
        recentStudySessions,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data analytics.",
    };
  }
}
```

Catatan:

- Jika query terlalu kompleks atau terjadi error type Drizzle, pecah menjadi beberapa fungsi kecil.
- Pastikan semua query tetap filter `userId`.
- Jangan expose data user lain.
- Analytics harus tetap aman jika database kosong.

---

### 5. Create Analytics Query Hook

Buat file:

```txt
features/analytics/hooks/use-analytics-query.ts
```

Isi:

```ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { getAnalyticsAction } from "@/actions/analytics";

export const analyticsQueryKey = ["analytics"];

export function useAnalyticsQuery() {
  return useQuery({
    queryKey: analyticsQueryKey,
    queryFn: async () => {
      const result = await getAnalyticsAction();

      if (!result.success || !result.data) {
        throw new Error(result.message);
      }

      return result.data;
    },
  });
}
```

---

### 6. Create Analytics Empty State

Buat file:

```txt
features/analytics/components/analytics-empty-state.tsx
```

Isi:

```tsx
import { BarChart3 } from "lucide-react";

import { Card } from "@/components/ui/card";

export function AnalyticsEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <BarChart3 className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-slate-950">
        Belum ada data analytics
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Mulai buat subject, study plan, task, dan study session untuk melihat statistik progres
        belajar kamu.
      </p>
    </Card>
  );
}
```

---

### 7. Create Analytics Overview Cards

Buat file:

```txt
features/analytics/components/analytics-overview-cards.tsx
```

Requirements:

- Menerima prop `overview`.
- Menampilkan stat cards.
- Gunakan komponen `StatCard` jika sudah ada.
- Tampilkan 6 metrics:

```txt
Total Study Hours
Study Sessions
Completed Tasks
Task Completion Rate
Active Study Plans
Most Studied Subject
```

Format:

```txt
8.5h
12 sessions
10/15 tasks
67%
3 plans
Next.js
```

---

### 8. Create Weekly Study Hours Chart

Buat file:

```txt
features/analytics/components/weekly-study-hours-chart.tsx
```

Requirements:

- Client component.
- Menggunakan Recharts.
- Chart type: BarChart atau LineChart.
- Data dari `weeklyStudyHours`.
- X-axis: label hari.
- Y-axis: hours.
- Tooltip menampilkan hours dan minutes.
- Jika semua data 0, tampilkan fallback message.

Contoh chart data:

```txt
Mon 1.5h
Tue 0.5h
Wed 2h
Thu 0h
Fri 1h
Sat 3h
Sun 0h
```

Catatan desain:

- Jangan pakai warna terlalu ramai.
- Gunakan warna yang konsisten dengan StudyFlow.
- Jika ingin mengikuti rule custom design, gunakan satu warna utama saja.

---

### 9. Create Study Hours by Subject Chart

Buat file:

```txt
features/analytics/components/study-hours-by-subject-chart.tsx
```

Requirements:

- Client component.
- Menggunakan Recharts.
- Chart type: BarChart.
- Data dari `studyHoursBySubject`.
- X-axis: subjectName.
- Y-axis: hours.
- Tooltip menampilkan hours dan minutes.
- Jika data kosong, tampilkan fallback.

Contoh:

```txt
Next.js 8.5h
Django 4h
English 2h
```

---

### 10. Create Task Status Chart

Buat file:

```txt
features/analytics/components/task-status-chart.tsx
```

Requirements:

- Client component.
- Menggunakan Recharts.
- Chart type: PieChart atau BarChart.
- Data dari `taskStatusDistribution`.
- Menampilkan TODO, IN_PROGRESS, DONE.
- Jika total task 0, tampilkan fallback.

Label:

```txt
Todo
In Progress
Done
```

---

### 11. Create Recent Study Sessions Card

Buat file:

```txt
features/analytics/components/recent-study-sessions-card.tsx
```

Requirements:

- Menerima prop `sessions`.
- Menampilkan maksimal 5 session terbaru.
- Menampilkan:

  - subject name
  - duration
  - mood
  - started at
  - study plan title jika ada
  - task title jika ada

- Jika kosong, tampilkan fallback.

Gunakan utility dari:

```txt
features/analytics/utils/analytics-format.ts
```

---

### 12. Update Analytics Page

Edit file:

```txt
app/dashboard/analytics/page.tsx
```

Isi:

```tsx
"use client";

import { AnalyticsEmptyState } from "@/features/analytics/components/analytics-empty-state";
import { AnalyticsOverviewCards } from "@/features/analytics/components/analytics-overview-cards";
import { RecentStudySessionsCard } from "@/features/analytics/components/recent-study-sessions-card";
import { StudyHoursBySubjectChart } from "@/features/analytics/components/study-hours-by-subject-chart";
import { TaskStatusChart } from "@/features/analytics/components/task-status-chart";
import { WeeklyStudyHoursChart } from "@/features/analytics/components/weekly-study-hours-chart";
import { useAnalyticsQuery } from "@/features/analytics/hooks/use-analytics-query";
import { Card } from "@/components/ui/card";

export default function AnalyticsPage() {
  const query = useAnalyticsQuery();

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Analytics</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review your study progress and productivity.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-32 animate-pulse bg-slate-100" />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="h-80 animate-pulse bg-slate-100" />
          <Card className="h-80 animate-pulse bg-slate-100" />
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <Card className="p-6">
        <h1 className="text-lg font-semibold text-slate-950">Gagal memuat analytics</h1>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
  }

  const data = query.data;

  const hasNoData =
    data.overview.totalStudyHours === 0 &&
    data.overview.totalTasks === 0 &&
    data.overview.totalStudySessions === 0;

  if (hasNoData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Analytics</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review your study progress and productivity.
          </p>
        </div>

        <AnalyticsEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Analytics</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review your study progress, task completion, and learning activity.
        </p>
      </div>

      <AnalyticsOverviewCards overview={data.overview} />

      <div className="grid gap-6 xl:grid-cols-2">
        <WeeklyStudyHoursChart data={data.weeklyStudyHours} />
        <StudyHoursBySubjectChart data={data.studyHoursBySubject} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <TaskStatusChart data={data.taskStatusDistribution} />
        <RecentStudySessionsCard sessions={data.recentStudySessions} />
      </div>
    </div>
  );
}
```

Catatan:

- Page analytics dibuat client component karena memakai TanStack Query dan Recharts.
- Jika ingin lebih server-first, data bisa diambil dari Server Component dan chart dibuat client component. Namun untuk konsistensi dengan TanStack Query, issue ini memakai client query.

---

### 13. Invalidate Analytics Query from Other Mutations

Pastikan mutation berikut ikut invalidate analytics query:

```txt
create task
update task
update task status
delete task
create study session
update study session
delete study session
```

Import:

```ts
import { analyticsQueryKey } from "@/features/analytics/hooks/use-analytics-query";
```

Lalu tambahkan:

```ts
queryClient.invalidateQueries({
  queryKey: analyticsQueryKey,
});
```

Contoh:

```ts
await Promise.all([
  queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
  queryClient.invalidateQueries({ queryKey: studyPlansQueryKey }),
  queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
]);
```

---

### 14. Run Checks

Jalankan:

```bash
pnpm lint
pnpm format:check
pnpm build
```

Expected:

```txt
Tidak ada lint error.
Tidak ada format error.
Build berhasil.
```

## Expected Folder Structure

Setelah issue selesai:

```txt
actions/
└── analytics.ts

app/
└── dashboard/
    └── analytics/
        └── page.tsx

features/
└── analytics/
    ├── components/
    │   ├── analytics-empty-state.tsx
    │   ├── analytics-overview-cards.tsx
    │   ├── recent-study-sessions-card.tsx
    │   ├── study-hours-by-subject-chart.tsx
    │   ├── task-status-chart.tsx
    │   └── weekly-study-hours-chart.tsx
    ├── hooks/
    │   └── use-analytics-query.ts
    └── utils/
        └── analytics-format.ts

types/
└── analytics.ts
```

## Acceptance Criteria

- Halaman `/dashboard/analytics` tersedia.
- Halaman hanya bisa diakses user yang sudah login.
- Analytics hanya menampilkan data milik user login.
- User tidak bisa melihat analytics milik user lain.
- Data analytics diambil dari database.
- Data analytics tidak hardcode.
- Total study hours tampil.
- Total study sessions tampil.
- Completed tasks tampil.
- Task completion rate tampil.
- Active study plans tampil.
- Most studied subject tampil.
- Weekly study hours chart tampil.
- Study hours by subject chart tampil.
- Task status distribution chart tampil.
- Recent study sessions tampil.
- Recharts berhasil digunakan.
- TanStack Query digunakan untuk fetch analytics.
- Server Action berada di folder root `actions/`.
- Server Action memvalidasi session user.
- Semua query database memfilter berdasarkan `userId`.
- Empty state tampil jika belum ada data.
- Loading state tampil saat data sedang dimuat.
- Error state tampil jika gagal mengambil data.
- Analytics query ikut di-invalidate setelah task berubah.
- Analytics query ikut di-invalidate setelah study session berubah.
- UI mengikuti clean white dashboard style.
- Tidak ada API route baru.
- Tidak ada schema database yang diubah.
- Tidak ada shadcn/ui yang ditambahkan.
- Tidak ada folder di dalam `src/`.
- Tidak ada error TypeScript.
- Tidak ada error lint.
- `pnpm format:check` berhasil.
- `pnpm build` berhasil.

## Testing Checklist

### 1. Run Development Server

Jalankan:

```bash
pnpm dev
```

Buka:

```txt
http://localhost:3000/dashboard/analytics
```

Expected:

```txt
Halaman Analytics Dashboard tampil.
```

---

### 2. Test Protected Access

Logout, lalu buka:

```txt
http://localhost:3000/dashboard/analytics
```

Expected:

```txt
User diarahkan ke /login.
```

---

### 3. Test Empty Analytics

Gunakan user baru tanpa data subject, task, dan session.

Expected:

```txt
Empty state tampil.
Tidak ada error.
```

---

### 4. Test Analytics with Data

Buat data:

```txt
1 subject
1 study plan
3 tasks
2 completed tasks
2 study sessions
```

Expected:

```txt
Total study hours sesuai total duration study session.
Total sessions sesuai jumlah study session.
Task completion rate sesuai task done / total task.
Chart weekly study hours tampil.
Chart study hours by subject tampil.
Chart task status tampil.
Recent study sessions tampil.
```

---

### 5. Test Task Completion Rate

Buat 4 task:

```txt
2 DONE
1 IN_PROGRESS
1 TODO
```

Expected:

```txt
Task completion rate = 50%
Task status chart menampilkan TODO, IN_PROGRESS, DONE.
```

---

### 6. Test Weekly Study Hours

Buat study session pada beberapa tanggal berbeda.

Expected:

```txt
Weekly chart menampilkan data 7 hari terakhir.
Hari tanpa study session tetap tampil dengan nilai 0.
```

---

### 7. Test Study Hours by Subject

Buat session untuk beberapa subject:

```txt
Next.js 120 menit
Django 60 menit
English 30 menit
```

Expected:

```txt
Chart menampilkan Next.js 2h, Django 1h, English 0.5h.
Most studied subject = Next.js.
```

---

### 8. Test Recent Study Sessions

Buat lebih dari 5 session.

Expected:

```txt
Recent study sessions hanya menampilkan 5 data terbaru.
Urutan berdasarkan startedAt terbaru.
```

---

### 9. Test User Isolation

Login sebagai user A dan buat data analytics.

Login sebagai user B.

Expected:

```txt
User B tidak bisa melihat analytics user A.
User B hanya melihat data miliknya sendiri.
```

---

### 10. Test Query Invalidation

Tambah study session baru.

Expected:

```txt
Analytics berubah setelah query invalidate/refetch.
Total study hours bertambah.
Recent study sessions berubah.
```

Update status task menjadi DONE.

Expected:

```txt
Task completion rate berubah.
Task status chart berubah.
```

---

### 11. Run Checks

Jalankan:

```bash
pnpm lint
pnpm format:check
pnpm build
```

Expected:

```txt
Tidak ada lint error.
Tidak ada format error.
Build berhasil.
```

## Notes

- Jangan membuat CRUD baru di issue ini.
- Jangan membuat calendar view.
- Jangan membuat export report.
- Jangan membuat AI productivity insight.
- Jangan membuat API route.
- Semua logic analytics database harus berada di Server Actions.
- Semua query analytics wajib filter `userId`.
- Gunakan Recharts untuk visualisasi.
- Jika warna chart terlalu ramai, gunakan warna primary StudyFlow saja.
- Jika query Drizzle terlalu kompleks, pecah menjadi beberapa query kecil.
- Prioritaskan data akurat dan mudah dirawat daripada query terlalu singkat.
- Analytics ini akan dipakai sebagai fondasi untuk Dashboard Real Statistics issue berikutnya.

## Suggested Commit Message

```bash
feat: build analytics dashboard
```
