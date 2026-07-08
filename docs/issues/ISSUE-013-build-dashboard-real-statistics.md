# ISSUE-013 — Build Dashboard Real Statistics

## Status

Planned

## Priority

High

## Type

Feature / Dashboard Data

## Summary

Membangun real statistics untuk halaman utama dashboard StudyFlow. Issue ini mengganti dummy data pada `/dashboard` menjadi data real dari database berdasarkan user yang sedang login.

Dashboard overview harus menampilkan ringkasan utama seperti total subject, active study plans, completed tasks, task completion rate, total study hours, recent tasks, recent sessions, dan active plan progress.

Route utama:

```txt

```

## Background

Saat ini StudyFlow sudah memiliki fitur utama:

```txt
Subject Management
Study Plan Management
Task Management
Study Session Tracker
Analytics Dashboard
User Settings
```

Namun halaman utama dashboard masih menggunakan data dummy atau placeholder. Pada issue ini, halaman `/dashboard` akan menjadi overview real yang mengambil data dari database.

Dashboard overview akan menjadi halaman pertama yang dilihat user setelah login, sehingga harus memberikan ringkasan yang jelas dan berguna.

## Goals

- Mengganti dummy dashboard data dengan data real dari database.
- Menampilkan total subjects.
- Menampilkan active study plans.
- Menampilkan total tasks.
- Menampilkan completed tasks.
- Menampilkan task completion rate.
- Menampilkan total study hours.
- Menampilkan total study sessions.
- Menampilkan recent tasks.
- Menampilkan recent study sessions.
- Menampilkan active study plans progress sederhana.
- Mengambil data berdasarkan user login.
- Semua query wajib filter berdasarkan `userId`.
- Data fetching menggunakan Server Action.
- Dashboard page boleh menggunakan Server Component.
- Menampilkan empty state jika user belum memiliki data.
- Menampilkan UI yang clean dan konsisten dengan dashboard.
- Tidak ada data user lain yang terekspos.

## Non-Goals

- Tidak membuat CRUD baru.
- Tidak membuat analytics chart kompleks.
- Tidak membuat calendar view.
- Tidak membuat study plan detail page.
- Tidak membuat AI insight.
- Tidak membuat export report.
- Tidak membuat API route.
- Tidak mengubah schema database.
- Tidak menambahkan shadcn/ui.
- Tidak mengubah authentication flow.
- Tidak membuat dashboard admin.

## Tech Stack

- Next.js App Router
- TypeScript
- Drizzle ORM
- PostgreSQL
- Auth.js
- Server Actions
- Server Components
- Tailwind CSS
- Custom UI Components
- Lucide React

## Route

Fitur ini berada di:

```txt

```

## Data Source

Gunakan tabel:

```txt
subjects
study_plans
study_tasks
study_sessions
```

Semua data wajib berdasarkan user login:

```txt
subjects.user_id = session.user.id
study_plans.user_id = session.user.id
study_tasks.user_id = session.user.id
study_sessions.user_id = session.user.id
```

## Dashboard Metrics

Minimal data yang ditampilkan:

```txt
totalSubjects
activeStudyPlans
totalTasks
completedTasks
taskCompletionRate
totalStudyHours
totalStudySessions
recentTasks
recentStudySessions
activePlanProgress
```

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
actions/
└── dashboard.ts

app/
└── dashboard/
    └── page.tsx

features/
└── dashboard/
    ├── components/
    │   ├── active-plan-progress-card.tsx
    │   ├── dashboard-empty-state.tsx
    │   ├── dashboard-overview-cards.tsx
    │   ├── recent-sessions-card.tsx
    │   └── recent-tasks-card.tsx
    └── utils/
        └── dashboard-format.ts

types/
└── dashboard.ts
```

## Implementation Steps

### 1. Create Dashboard Types

Buat file:

```txt
types/dashboard.ts
```

Isi:

```ts
export type DashboardOverview = {
  totalSubjects: number;
  activeStudyPlans: number;
  totalTasks: number;
  completedTasks: number;
  taskCompletionRate: number;
  totalStudyHours: number;
  totalStudySessions: number;
};

export type DashboardRecentTask = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: string | null;
  studyPlanTitle: string;
  subjectName: string;
  subjectColor: string;
};

export type DashboardRecentSession = {
  id: string;
  subjectName: string;
  subjectColor: string;
  studyPlanTitle: string | null;
  taskTitle: string | null;
  durationMinutes: number;
  mood: "FOCUSED" | "NORMAL" | "TIRED" | "DISTRACTED";
  startedAt: Date;
};

export type DashboardActivePlanProgress = {
  id: string;
  title: string;
  subjectName: string;
  subjectColor: string;
  totalTasks: number;
  completedTasks: number;
  progress: number;
};

export type DashboardData = {
  overview: DashboardOverview;
  recentTasks: DashboardRecentTask[];
  recentSessions: DashboardRecentSession[];
  activePlanProgress: DashboardActivePlanProgress[];
};
```

---

### 2. Create Dashboard Format Utilities

Buat file:

```txt
features/dashboard/utils/dashboard-format.ts
```

Isi:

```ts
export function formatHours(hours: number) {
  return `${hours.toFixed(1)}h`;
}

export function formatMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function formatPercentage(value: number) {
  return `${value}%`;
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
```

---

### 3. Create Dashboard Action

Buat file:

```txt
actions/dashboard.ts
```

Isi:

```ts server";
import { and, desc, eq, sql } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, studySessions, studyTasks, subjects } from "@/db/schema";
import type { ActionResponse } from "@/types/action-response";
import type {
  DashboardActivePlanProgress,
  DashboardData,
  DashboardRecentSession,
  DashboardRecentTask,
} from "@/types/dashboard";

async function requireAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function getDashboardDataAction(): Promise<ActionResponse<DashboardData>> {
  try {
    const user = await requireAuthUser();

    const [subjectsOverview] = await db
      .select({
        totalSubjects: sql<number>`count(${subjects.id})::int`,
      })
      .from(subjects)
      .where(eq(subjects.userId, user.id));

    const [plansOverview] = await db
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

    const [tasksOverview] = await db
      .select({
        totalTasks: sql<number>`count(${studyTasks.id})::int`,
        completedTasks: sql<number>`count(case when ${studyTasks.status} = 'DONE' then 1 end)::int`,
      })
      .from(studyTasks)
      .where(eq(studyTasks.userId, user.id));

    const [sessionsOverview] = await db
      .select({
        totalStudySessions: sql<number>`count(${studySessions.id})::int`,
        totalStudyMinutes: sql<number>`coalesce(sum(${studySessions.durationMinutes}), 0)::int`,
      })
      .from(studySessions)
      .where(eq(studySessions.userId, user.id));

    const taskCompletionRate =
      tasksOverview.totalTasks > 0
        ? Math.round((tasksOverview.completedTasks / tasksOverview.totalTasks) * 100)
        : 0;

    const recentTasksRaw = await db
      .select({
        id: studyTasks.id,
        title: studyTasks.title,
        status: studyTasks.status,
        priority: studyTasks.priority,
        dueDate: studyTasks.dueDate,
        studyPlanTitle: studyPlans.title,
        subjectName: subjects.name,
        subjectColor: subjects.color,
      })
      .from(studyTasks)
      .innerJoin(studyPlans, eq(studyTasks.studyPlanId, studyPlans.id))
      .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
      .where(eq(studyTasks.userId, user.id))
      .orderBy(desc(studyTasks.createdAt))
      .limit(5);

    const recentTasks: DashboardRecentTask[] = recentTasksRaw.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      studyPlanTitle: task.studyPlanTitle,
      subjectName: task.subjectName,
      subjectColor: task.subjectColor,
    }));

    const recentSessionsRaw = await db
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

    const recentSessions: DashboardRecentSession[] = recentSessionsRaw.map((session) => ({
      id: session.id,
      subjectName: session.subjectName,
      subjectColor: session.subjectColor,
      studyPlanTitle: session.studyPlanTitle,
      taskTitle: session.taskTitle,
      durationMinutes: session.durationMinutes,
      mood: session.mood,
      startedAt: session.startedAt,
    }));

    const activePlansRaw = await db
      .select({
        id: studyPlans.id,
        title: studyPlans.title,
        subjectName: subjects.name,
        subjectColor: subjects.color,
        totalTasks: sql<number>`count(${studyTasks.id})::int`,
        completedTasks: sql<number>`count(case when ${studyTasks.status} = 'DONE' then 1 end)::int`,
      })
      .from(studyPlans)
      .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
      .leftJoin(studyTasks, eq(studyTasks.studyPlanId, studyPlans.id))
      .where(
        and(
          eq(studyPlans.userId, user.id),
          sql`${studyPlans.status} in ('NOT_STARTED', 'IN_PROGRESS', 'PAUSED')`
        )
      )
      .groupBy(studyPlans.id, studyPlans.title, subjects.name, subjects.color)
      .orderBy(desc(studyPlans.createdAt))
      .limit(5);

    const activePlanProgress: DashboardActivePlanProgress[] = activePlansRaw.map((plan) => ({
      id: plan.id,
      title: plan.title,
      subjectName: plan.subjectName,
      subjectColor: plan.subjectColor,
      totalTasks: plan.totalTasks,
      completedTasks: plan.completedTasks,
      progress: plan.totalTasks > 0 ? Math.round((plan.completedTasks / plan.totalTasks) * 100) : 0,
    }));

    return {
      success: true,
      message: "Dashboard data berhasil diambil.",
      data: {
        overview: {
          totalSubjects: subjectsOverview.totalSubjects,
          activeStudyPlans: plansOverview.activeStudyPlans,
          totalTasks: tasksOverview.totalTasks,
          completedTasks: tasksOverview.completedTasks,
          taskCompletionRate,
          totalStudyHours: Number((sessionsOverview.totalStudyMinutes / 60).toFixed(1)),
          totalStudySessions: sessionsOverview.totalStudySessions,
        },
        recentTasks,
        recentSessions,
        activePlanProgress,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data dashboard.",
    };
  }
}
```

Catatan:

- Query boleh dipecah menjadi beberapa function kecil jika file terlalu panjang.
- Pastikan semua query filter `userId`.
- Jangan tampilkan data user lain.
- Dashboard overview harus tetap aman jika database kosong.

---

### 4. Create Dashboard Empty State

Buat file:

```txt
features/dashboard/components/dashboard-empty-state.tsx
```

Isi:

```tsx
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DashboardEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <LayoutDashboard className="h-6 w-6" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950">
        Dashboard masih kosong
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Mulai dengan membuat subject pertama, lalu buat study plan, task, dan catat study session
        kamu.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard/subjects">Create Subject</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/dashboard/plans">Create Study Plan</Link>
        </Button>
      </div>
    </Card>
  );
}
```

---

### 5. Create Dashboard Overview Cards

Buat file:

```txt
features/dashboard/components/dashboard-overview-cards.tsx
```

Isi:

```tsx
import { BookOpen, CalendarDays, CheckSquare, Timer } from "lucide-react";

import { StatCard } from "@/components/common/stat-card";
import type { DashboardOverview } from "@/types/dashboard";
import { formatHours, formatPercentage } from "@/features/dashboard/utils/dashboard-format";

type DashboardOverviewCardsProps = {
  overview: DashboardOverview;
};

export function DashboardOverviewCards({ overview }: DashboardOverviewCardsProps) {
  const stats = [
    {
      label: "Subjects",
      value: overview.totalSubjects.toString(),
      description: "Learning categories",
      icon: BookOpen,
    },
    {
      label: "Active Plans",
      value: overview.activeStudyPlans.toString(),
      description: "Currently tracked",
      icon: CalendarDays,
    },
    {
      label: "Completed Tasks",
      value: `${overview.completedTasks}/${overview.totalTasks}`,
      description: `${formatPercentage(overview.taskCompletionRate)} completion rate`,
      icon: CheckSquare,
    },
    {
      label: "Study Hours",
      value: formatHours(overview.totalStudyHours),
      description: `${overview.totalStudySessions} sessions tracked`,
      icon: Timer,
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          description={stat.description}
        />
      ))}
    </div>
  );
}
```

Catatan:

- Jika `StatCard` belum mendukung icon, boleh abaikan icon.
- Jika ingin menampilkan icon, update `StatCard` di issue polish terpisah.

---

### 6. Create Recent Tasks Card

Buat file:

```txt
features/dashboard/components/recent-tasks-card.tsx
```

Isi:

```tsx
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardRecentTask } from "@/types/dashboard";
import { formatDate } from "@/features/dashboard/utils/dashboard-format";

type RecentTasksCardProps = {
  tasks: DashboardRecentTask[];
};

function getStatusVariant(status: DashboardRecentTask["status"]) {
  if (status === "DONE") return "success";
  if (status === "IN_PROGRESS") return "info";
  return "default";
}

function getPriorityVariant(priority: DashboardRecentTask["priority"]) {
  if (priority === "URGENT") return "danger";
  if (priority === "HIGH") return "warning";
  if (priority === "MEDIUM") return "info";
  return "default";
}

export function RecentTasksCard({ tasks }: RecentTasksCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Recent Tasks</CardTitle>
        <Link
          href="/dashboard/tasks"
          className="text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500">
            Belum ada task. Buat task pertama untuk mulai melacak progres.
          </p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: task.subjectColor }}
                      />
                      <p className="text-xs font-medium text-slate-500">{task.subjectName}</p>
                    </div>

                    <h3 className="truncate text-sm font-semibold text-slate-950">{task.title}</h3>

                    <p className="mt-1 truncate text-xs text-slate-500">{task.studyPlanTitle}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
                  <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                  {task.dueDate ? (
                    <span className="text-xs text-slate-500">Due {formatDate(task.dueDate)}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

### 7. Create Recent Sessions Card

Buat file:

```txt
features/dashboard/components/recent-sessions-card.tsx
```

Isi:

```tsx
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardRecentSession } from "@/types/dashboard";
import { formatDateTime, formatMinutes } from "@/features/dashboard/utils/dashboard-format";

type RecentSessionsCardProps = {
  sessions: DashboardRecentSession[];
};

function getMoodVariant(mood: DashboardRecentSession["mood"]) {
  if (mood === "FOCUSED") return "success";
  if (mood === "NORMAL") return "info";
  if (mood === "TIRED") return "warning";
  return "danger";
}

export function RecentSessionsCard({ sessions }: RecentSessionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Recent Sessions</CardTitle>
        <Link
          href="/dashboard/sessions"
          className="text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-500">
            Belum ada study session. Catat sesi belajar pertama kamu.
          </p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: session.subjectColor }}
                      />
                      <p className="text-xs font-medium text-slate-500">{session.subjectName}</p>
                    </div>

                    <h3 className="truncate text-sm font-semibold text-slate-950">
                      {session.studyPlanTitle ?? "General Study Session"}
                    </h3>

                    {session.taskTitle ? (
                      <p className="mt-1 truncate text-xs text-slate-500">
                        Task: {session.taskTitle}
                      </p>
                    ) : null}
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-slate-950">
                    {formatMinutes(session.durationMinutes)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getMoodVariant(session.mood)}>{session.mood}</Badge>
                  <span className="text-xs text-slate-500">
                    {formatDateTime(session.startedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

### 8. Create Active Plan Progress Card

Buat file:

```txt
features/dashboard/components/active-plan-progress-card.tsx
```

Isi:

```tsx
import Link from "next/link";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardActivePlanProgress } from "@/types/dashboard";

type ActivePlanProgressCardProps = {
  plans: DashboardActivePlanProgress[];
};

export function ActivePlanProgressCard({ plans }: ActivePlanProgressCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Active Plan Progress</CardTitle>
        <Link
          href="/dashboard/plans"
          className="text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent>
        {plans.length === 0 ? (
          <p className="text-sm text-slate-500">
            Belum ada active study plan. Buat study plan untuk mulai melacak progres.
          </p>
        ) : (
          <div className="space-y-5">
            {plans.map((plan) => (
              <div key={plan.id}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: plan.subjectColor }}
                      />
                      <p className="text-xs font-medium text-slate-500">{plan.subjectName}</p>
                    </div>

                    <p className="truncate text-sm font-medium text-slate-950">{plan.title}</p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-slate-950">{plan.progress}%</p>
                </div>

                <Progress value={plan.progress} />

                <p className="mt-2 text-xs text-slate-500">
                  {plan.completedTasks}/{plan.totalTasks} tasks completed
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

### 9. Update Dashboard Page

Edit file:

```txt
app/dashboard/page.tsx
```

Isi:

```tsx
import { getDashboardDataAction } from "@/actions/dashboard";
import { ActivePlanProgressCard } from "@/features/dashboard/components/active-plan-progress-card";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardOverviewCards } from "@/features/dashboard/components/dashboard-overview-cards";
import { RecentSessionsCard } from "@/features/dashboard/components/recent-sessions-card";
import { RecentTasksCard } from "@/features/dashboard/components/recent-tasks-card";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const result = await getDashboardDataAction();

  if (!result.success || !result.data) {
    return (
      <Card className="p-6">
        <h1 className="text-lg font-semibold text-slate-950">Gagal memuat dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
  }

  const data = result.data;

  const hasNoData =
    data.overview.totalSubjects === 0 &&
    data.overview.totalTasks === 0 &&
    data.overview.totalStudySessions === 0;

  if (hasNoData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            Welcome to StudyFlow. Start organizing your learning progress.
          </p>
        </div>

        <DashboardEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Overview of your study progress, tasks, and recent learning activity.
        </p>
      </div>

      <DashboardOverviewCards overview={data.overview} />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <ActivePlanProgressCard plans={data.activePlanProgress} />
        <RecentSessionsCard sessions={data.recentSessions} />
      </div>

      <RecentTasksCard tasks={data.recentTasks} />
    </div>
  );
}
```

Catatan:

- Dashboard page tetap Server Component.
- Tidak perlu TanStack Query untuk dashboard overview ini.
- Data akan refresh saat route direvalidate oleh mutation actions lain.

---

### 10. Revalidate Dashboard Path from Existing Mutations

Pastikan action berikut sudah memanggil:

```ts
revalidatePath("/dashboard");
```

Pada file:

```txt
actions/subjects.ts
actions/study-plans.ts
actions/tasks.ts
actions/study-sessions.ts
```

Minimal revalidate:

```txt
create subject
update subject
delete subject
create study plan
update study plan
delete study plan
create task
update task
update task status
delete task
create study session
update study session
delete study session
```

Expected:

```txt
Setelah data berubah, dashboard overview ikut update saat halaman dibuka ulang.
```

---

### 11. Remove Old Dummy Dashboard Data

Hapus dummy array dari `app/dashboard/page.tsx`, misalnya:

```txt
dashboardStats
dummy chart data
dummy active plans
```

Pastikan tidak ada data hardcode untuk dashboard overview.

Data hardcode kecil untuk label UI masih boleh, tapi value statistik harus berasal dari database.

---

### 12. Run Checks

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
└── dashboard.ts

app/
└── dashboard/
    └── page.tsx

features/
└── dashboard/
    ├── components/
    │   ├── active-plan-progress-card.tsx
    │   ├── dashboard-empty-state.tsx
    │   ├── dashboard-overview-cards.tsx
    │   ├── recent-sessions-card.tsx
    │   └── recent-tasks-card.tsx
    └── utils/
        └── dashboard-format.ts

types/
└── dashboard.ts
```

## Acceptance Criteria

- Halaman `/dashboard` menggunakan data real dari database.
- Dummy dashboard stats dihapus.
- Total subjects tampil dari database.
- Active study plans tampil dari database.
- Total tasks tampil dari database.
- Completed tasks tampil dari database.
- Task completion rate tampil dari database.
- Total study hours tampil dari database.
- Total study sessions tampil dari database.
- Recent tasks tampil dari database.
- Recent study sessions tampil dari database.
- Active plan progress tampil dari database.
- Semua data berdasarkan user login.
- User tidak bisa melihat data dashboard user lain.
- Dashboard action berada di folder root `actions/`.
- Dashboard action memvalidasi session user.
- Semua query dashboard memfilter berdasarkan `userId`.
- Dashboard page tetap protected.
- Empty state tampil jika user belum punya data.
- Error state tampil jika data gagal dimuat.
- UI mengikuti clean white dashboard style.
- Route `/dashboard` tetap responsive.
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
http://localhost:3000/dashboard
```

Expected:

```txt
Dashboard tampil dengan data real.
```

---

### 2. Test Protected Access

Logout, lalu buka:

```txt
http://localhost:3000/dashboard
```

Expected:

```txt
User diarahkan ke /login.
```

---

### 3. Test Empty Dashboard

Gunakan user baru tanpa data.

Expected:

```txt
Dashboard empty state tampil.
CTA ke /dashboard/subjects dan /dashboard/plans tampil.
Tidak ada error.
```

---

### 4. Test Dashboard with Data

Buat data:

```txt
2 subjects
2 study plans
5 tasks
3 completed tasks
2 study sessions
```

Expected:

```txt
Total subjects = 2
Active study plans sesuai status active
Completed tasks = 3/5
Task completion rate = 60%
Total study hours sesuai total duration
Total study sessions = 2
```

---

### 5. Test Recent Tasks

Buat lebih dari 5 task.

Expected:

```txt
Recent tasks hanya menampilkan 5 task terbaru.
Urutan berdasarkan createdAt terbaru.
Task menampilkan subject, study plan, status, priority, dan due date.
```

---

### 6. Test Recent Sessions

Buat lebih dari 5 study session.

Expected:

```txt
Recent sessions hanya menampilkan 5 session terbaru.
Urutan berdasarkan startedAt terbaru.
Session menampilkan subject, duration, mood, startedAt, study plan, dan task jika ada.
```

---

### 7. Test Active Plan Progress

Buat study plan dengan 4 task:

```txt
2 DONE
1 IN_PROGRESS
1 TODO
```

Expected:

```txt
Progress = 50%
Completed tasks = 2/4
Progress bar tampil.
```

---

### 8. Test User Isolation

Login sebagai user A dan buat data dashboard.

Login sebagai user B.

Expected:

```txt
User B tidak melihat data user A.
User B hanya melihat data miliknya sendiri.
```

---

### 9. Test Dashboard Revalidation

Tambah task baru, update status task, atau tambah study session.

Buka ulang dashboard.

Expected:

```txt
Statistik dashboard ikut berubah.
Recent task/session ikut update.
```

---

### 10. Run Checks

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
- Jangan membuat chart analytics kompleks di issue ini.
- Jangan membuat calendar view di issue ini.
- Jangan membuat API route.
- Dashboard page boleh tetap Server Component.
- Data dashboard harus berasal dari database.
- Jangan tampilkan data user lain.
- Jika query Drizzle terlalu panjang, pecah menjadi beberapa helper function.
- Pastikan semua mutation yang mempengaruhi dashboard melakukan `revalidatePath("/dashboard")`.
- Dashboard Real Statistics ini berbeda dari Analytics Dashboard. Dashboard hanya ringkasan cepat, sedangkan Analytics untuk detail visual.

## Suggested Commit Message

```bash
feat: build dashboard real statistics
```
