# ISSUE-015 — Build Calendar Deadline View

## Status

Planned

## Priority

Medium

## Type

Feature / Calendar View

## Summary

Membangun fitur Calendar Deadline View untuk StudyFlow. Fitur ini digunakan untuk menampilkan deadline study plan dan task dalam tampilan kalender atau timeline sederhana.

Calendar Deadline View membantu user melihat jadwal belajar, deadline task, dan rencana belajar yang mendekati batas waktu.

Route utama:

```txt
/dashboard/calendar
```

## Background

StudyFlow sudah memiliki fitur utama:

```txt
Subject Management
Study Plan Management
Task Management
Study Session Tracker
Analytics Dashboard
Dashboard Real Statistics
Study Plan Progress Calculation
```

Saat ini user sudah bisa membuat study plan dan task dengan field tanggal seperti:

```txt
study_plans.start_date
study_plans.end_date
study_tasks.due_date
```

Namun belum ada tampilan khusus untuk melihat semua deadline tersebut dalam satu halaman.

Pada issue ini, data deadline akan dikumpulkan dan ditampilkan dalam tampilan calendar/timeline agar user lebih mudah melihat prioritas belajar.

## Goals

- Membuat halaman Calendar Deadline View.
- Menampilkan deadline task.
- Menampilkan start date dan end date study plan.
- Mengelompokkan deadline berdasarkan tanggal.
- Menampilkan task yang overdue.
- Menampilkan task yang due today.
- Menampilkan task yang upcoming.
- Menampilkan study plan yang sedang berjalan.
- Menampilkan empty state jika belum ada deadline.
- Menampilkan loading state jika diperlukan.
- Menampilkan error state jika data gagal dimuat.
- Mengambil data berdasarkan user login.
- Semua query wajib filter berdasarkan `userId`.
- Menambahkan menu Calendar ke sidebar dashboard.
- Tampilan responsive untuk mobile dan desktop.
- UI mengikuti clean white dashboard style StudyFlow.

## Non-Goals

- Tidak membuat drag and drop calendar.
- Tidak membuat edit deadline dari calendar.
- Tidak membuat reminder notification.
- Tidak membuat Google Calendar integration.
- Tidak membuat recurring task.
- Tidak membuat real-time calendar.
- Tidak membuat full calendar library kompleks.
- Tidak membuat API route.
- Tidak mengubah schema database.
- Tidak menambahkan shadcn/ui.
- Tidak membuat admin calendar.

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
/dashboard/calendar
```

## Data Source

Gunakan tabel:

```txt
study_plans
study_tasks
subjects
```

Field yang digunakan:

```txt
study_plans.id
study_plans.user_id
study_plans.subject_id
study_plans.title
study_plans.start_date
study_plans.end_date
study_plans.status

study_tasks.id
study_tasks.user_id
study_tasks.study_plan_id
study_tasks.title
study_tasks.status
study_tasks.priority
study_tasks.due_date

subjects.id
subjects.name
subjects.color
```

Semua data wajib berdasarkan user login:

```txt
study_plans.user_id = session.user.id
study_tasks.user_id = session.user.id
subjects.user_id = session.user.id
```

## Calendar Data Types

Data calendar dibagi menjadi:

```txt
Task Deadline
Study Plan Start
Study Plan End
```

Status deadline:

```txt
OVERDUE
TODAY
UPCOMING
COMPLETED
```

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
actions/
└── calendar.ts

app/
└── dashboard/
    └── calendar/
        └── page.tsx

features/
└── calendar/
    ├── components/
    │   ├── calendar-empty-state.tsx
    │   ├── calendar-event-card.tsx
    │   ├── calendar-event-list.tsx
    │   ├── calendar-summary-cards.tsx
    │   └── deadline-group-section.tsx
    └── utils/
        └── calendar-format.ts

types/
└── calendar.ts
```

File yang kemungkinan ikut diubah:

```txt
constants/navigation.ts
```

## Implementation Steps

### 1. Create Calendar Types

Buat file:

```txt
types/calendar.ts
```

Isi:

```ts
export type CalendarEventType = "TASK_DEADLINE" | "STUDY_PLAN_START" | "STUDY_PLAN_END";

export type CalendarEventStatus = "OVERDUE" | "TODAY" | "UPCOMING" | "COMPLETED";

export type CalendarEventItem = {
  id: string;
  sourceId: string;
  type: CalendarEventType;
  status: CalendarEventStatus;
  title: string;
  description: string | null;
  date: string;
  subjectName: string;
  subjectColor: string;
  studyPlanTitle: string | null;
  taskStatus: "TODO" | "IN_PROGRESS" | "DONE" | null;
  taskPriority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | null;
};

export type CalendarSummary = {
  totalEvents: number;
  overdueTasks: number;
  dueTodayTasks: number;
  upcomingTasks: number;
  completedTasks: number;
};

export type CalendarData = {
  summary: CalendarSummary;
  events: CalendarEventItem[];
};
```

---

### 2. Create Calendar Format Utilities

Buat file:

```txt
features/calendar/utils/calendar-format.ts
```

Isi:

```ts
import type { CalendarEventStatus, CalendarEventType } from "@/types/calendar";

export function formatCalendarDate(date: string | Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function formatCalendarDay(date: string | Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
  }).format(new Date(date));
}

export function getDateKey(date: string | Date) {
  return new Date(date).toISOString().split("T")[0];
}

export function getCalendarEventTypeLabel(type: CalendarEventType) {
  if (type === "TASK_DEADLINE") {
    return "Task Deadline";
  }

  if (type === "STUDY_PLAN_START") {
    return "Study Plan Start";
  }

  return "Study Plan End";
}

export function getCalendarEventStatusLabel(status: CalendarEventStatus) {
  if (status === "OVERDUE") {
    return "Overdue";
  }

  if (status === "TODAY") {
    return "Today";
  }

  if (status === "COMPLETED") {
    return "Completed";
  }

  return "Upcoming";
}

export function getCalendarEventStatusVariant(status: CalendarEventStatus) {
  if (status === "OVERDUE") {
    return "danger";
  }

  if (status === "TODAY") {
    return "warning";
  }

  if (status === "COMPLETED") {
    return "success";
  }

  return "info";
}
```

---

### 3. Create Calendar Action

Buat file:

```txt
actions/calendar.ts
```

Isi:

```ts
"use server";

import { asc, eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, studyTasks, subjects } from "@/db/schema";
import type { ActionResponse } from "@/types/action-response";
import type { CalendarData, CalendarEventItem, CalendarEventStatus } from "@/types/calendar";

async function requireAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

function getTodayDateKey() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today.toISOString().split("T")[0];
}

function getEventStatus({
  date,
  isCompleted,
}: {
  date: string;
  isCompleted?: boolean;
}): CalendarEventStatus {
  if (isCompleted) {
    return "COMPLETED";
  }

  const todayKey = getTodayDateKey();
  const dateKey = new Date(date).toISOString().split("T")[0];

  if (dateKey < todayKey) {
    return "OVERDUE";
  }

  if (dateKey === todayKey) {
    return "TODAY";
  }

  return "UPCOMING";
}

export async function getCalendarDataAction(): Promise<ActionResponse<CalendarData>> {
  try {
    const user = await requireAuthUser();

    const taskDeadlines = await db
      .select({
        id: studyTasks.id,
        title: studyTasks.title,
        description: studyTasks.description,
        dueDate: studyTasks.dueDate,
        status: studyTasks.status,
        priority: studyTasks.priority,
        studyPlanTitle: studyPlans.title,
        subjectName: subjects.name,
        subjectColor: subjects.color,
      })
      .from(studyTasks)
      .innerJoin(studyPlans, eq(studyTasks.studyPlanId, studyPlans.id))
      .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
      .where(eq(studyTasks.userId, user.id))
      .orderBy(asc(studyTasks.dueDate));

    const studyPlanDates = await db
      .select({
        id: studyPlans.id,
        title: studyPlans.title,
        description: studyPlans.description,
        startDate: studyPlans.startDate,
        endDate: studyPlans.endDate,
        status: studyPlans.status,
        subjectName: subjects.name,
        subjectColor: subjects.color,
      })
      .from(studyPlans)
      .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
      .where(eq(studyPlans.userId, user.id))
      .orderBy(asc(studyPlans.startDate));

    const taskEvents: CalendarEventItem[] = taskDeadlines
      .filter((task) => Boolean(task.dueDate))
      .map((task) => ({
        id: `task-${task.id}`,
        sourceId: task.id,
        type: "TASK_DEADLINE",
        status: getEventStatus({
          date: task.dueDate!,
          isCompleted: task.status === "DONE",
        }),
        title: task.title,
        description: task.description,
        date: task.dueDate!,
        subjectName: task.subjectName,
        subjectColor: task.subjectColor,
        studyPlanTitle: task.studyPlanTitle,
        taskStatus: task.status,
        taskPriority: task.priority,
      }));

    const planStartEvents: CalendarEventItem[] = studyPlanDates
      .filter((plan) => Boolean(plan.startDate))
      .map((plan) => ({
        id: `plan-start-${plan.id}`,
        sourceId: plan.id,
        type: "STUDY_PLAN_START",
        status: getEventStatus({
          date: plan.startDate!,
          isCompleted: plan.status === "COMPLETED",
        }),
        title: plan.title,
        description: plan.description,
        date: plan.startDate!,
        subjectName: plan.subjectName,
        subjectColor: plan.subjectColor,
        studyPlanTitle: plan.title,
        taskStatus: null,
        taskPriority: null,
      }));

    const planEndEvents: CalendarEventItem[] = studyPlanDates
      .filter((plan) => Boolean(plan.endDate))
      .map((plan) => ({
        id: `plan-end-${plan.id}`,
        sourceId: plan.id,
        type: "STUDY_PLAN_END",
        status: getEventStatus({
          date: plan.endDate!,
          isCompleted: plan.status === "COMPLETED",
        }),
        title: plan.title,
        description: plan.description,
        date: plan.endDate!,
        subjectName: plan.subjectName,
        subjectColor: plan.subjectColor,
        studyPlanTitle: plan.title,
        taskStatus: null,
        taskPriority: null,
      }));

    const events = [...taskEvents, ...planStartEvents, ...planEndEvents].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const overdueTasks = taskEvents.filter((event) => event.status === "OVERDUE").length;

    const dueTodayTasks = taskEvents.filter((event) => event.status === "TODAY").length;

    const upcomingTasks = taskEvents.filter((event) => event.status === "UPCOMING").length;

    const completedTasks = taskEvents.filter((event) => event.status === "COMPLETED").length;

    return {
      success: true,
      message: "Calendar data berhasil diambil.",
      data: {
        summary: {
          totalEvents: events.length,
          overdueTasks,
          dueTodayTasks,
          upcomingTasks,
          completedTasks,
        },
        events,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data calendar.",
    };
  }
}
```

Catatan:

- Jika `dueDate`, `startDate`, atau `endDate` kosong, jangan tampilkan sebagai event.
- Jangan tampilkan data user lain.
- Jika query terlalu panjang, pecah menjadi helper function.

---

### 4. Add Calendar Navigation Item

Edit file:

```txt
constants/navigation.ts
```

Tambahkan menu Calendar:

```ts
import { CalendarDays } from "lucide-react";
```

Tambahkan ke `dashboardNavItems`:

```ts
{
  label: "Calendar",
  href: "/dashboard/calendar",
  icon: CalendarDays,
},
```

Urutan menu yang direkomendasikan:

```txt
Overview
Subjects
Study Plans
Tasks
Sessions
Calendar
Analytics
Settings
```

Expected:

```txt
Menu Calendar tampil di sidebar desktop dan mobile.
Active state berjalan saat membuka /dashboard/calendar.
```

---

### 5. Create Calendar Empty State

Buat file:

```txt
features/calendar/components/calendar-empty-state.tsx
```

Isi:

```tsx
import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CalendarEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <CalendarDays className="h-6 w-6" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950">Belum ada deadline</h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Buat study plan dengan tanggal mulai/selesai atau tambahkan due date pada task untuk melihat
        jadwal di calendar.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard/plans">Create Study Plan</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/dashboard/tasks">Create Task</Link>
        </Button>
      </div>
    </Card>
  );
}
```

---

### 6. Create Calendar Summary Cards

Buat file:

```txt
features/calendar/components/calendar-summary-cards.tsx
```

Isi:

```tsx
import { AlertCircle, CalendarCheck, CalendarDays, CheckCircle2 } from "lucide-react";

import { StatCard } from "@/components/common/stat-card";
import type { CalendarSummary } from "@/types/calendar";

type CalendarSummaryCardsProps = {
  summary: CalendarSummary;
};

export function CalendarSummaryCards({ summary }: CalendarSummaryCardsProps) {
  const stats = [
    {
      label: "Total Events",
      value: summary.totalEvents.toString(),
      description: "Plans and task deadlines",
      icon: CalendarDays,
    },
    {
      label: "Overdue Tasks",
      value: summary.overdueTasks.toString(),
      description: "Need your attention",
      icon: AlertCircle,
    },
    {
      label: "Due Today",
      value: summary.dueTodayTasks.toString(),
      description: "Tasks due today",
      icon: CalendarCheck,
    },
    {
      label: "Completed",
      value: summary.completedTasks.toString(),
      description: "Completed deadlines",
      icon: CheckCircle2,
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

- Jika `StatCard` belum mendukung icon, icon boleh tidak dipakai dulu.

---

### 7. Create Calendar Event Card

Buat file:

```txt
features/calendar/components/calendar-event-card.tsx
```

Isi:

```tsx
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  formatCalendarDate,
  getCalendarEventStatusLabel,
  getCalendarEventStatusVariant,
  getCalendarEventTypeLabel,
} from "@/features/calendar/utils/calendar-format";
import type { CalendarEventItem } from "@/types/calendar";

type CalendarEventCardProps = {
  event: CalendarEventItem;
};

function getEventHref(event: CalendarEventItem) {
  if (event.type === "TASK_DEADLINE") {
    return "/dashboard/tasks";
  }

  return "/dashboard/plans";
}

export function CalendarEventCard({ event }: CalendarEventCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: event.subjectColor }}
            />

            <p className="text-xs font-medium text-slate-500">{event.subjectName}</p>

            <Badge variant={getCalendarEventStatusVariant(event.status)}>
              {getCalendarEventStatusLabel(event.status)}
            </Badge>
          </div>

          <h3 className="truncate text-base font-semibold tracking-tight text-slate-950">
            {event.title}
          </h3>

          {event.studyPlanTitle ? (
            <p className="mt-1 truncate text-sm text-slate-500">{event.studyPlanTitle}</p>
          ) : null}
        </div>

        <p className="shrink-0 text-sm font-medium text-slate-500">
          {formatCalendarDate(event.date)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="info">{getCalendarEventTypeLabel(event.type)}</Badge>

        {event.taskStatus ? (
          <Badge variant={event.taskStatus === "DONE" ? "success" : "default"}>
            {event.taskStatus}
          </Badge>
        ) : null}

        {event.taskPriority ? (
          <Badge
            variant={
              event.taskPriority === "URGENT"
                ? "danger"
                : event.taskPriority === "HIGH"
                  ? "warning"
                  : event.taskPriority === "MEDIUM"
                    ? "info"
                    : "default"
            }
          >
            {event.taskPriority}
          </Badge>
        ) : null}
      </div>

      {event.description ? (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">{event.description}</p>
      ) : null}

      <div className="mt-4">
        <Link
          href={getEventHref(event)}
          className="text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          View source
        </Link>
      </div>
    </Card>
  );
}
```

---

### 8. Create Deadline Group Section

Buat file:

```txt
features/calendar/components/deadline-group-section.tsx
```

Isi:

```tsx
import { CalendarEventCard } from "@/features/calendar/components/calendar-event-card";
import { formatCalendarDay, formatCalendarDate } from "@/features/calendar/utils/calendar-format";
import type { CalendarEventItem } from "@/types/calendar";

type DeadlineGroupSectionProps = {
  date: string;
  events: CalendarEventItem[];
};

export function DeadlineGroupSection({ date, events }: DeadlineGroupSectionProps) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
          {formatCalendarDay(date)}
        </h2>
        <p className="text-sm text-slate-500">{formatCalendarDate(date)}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <CalendarEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
```

---

### 9. Create Calendar Event List

Buat file:

```txt
features/calendar/components/calendar-event-list.tsx
```

Isi:

```tsx
import { DeadlineGroupSection } from "@/features/calendar/components/deadline-group-section";
import { getDateKey } from "@/features/calendar/utils/calendar-format";
import type { CalendarEventItem } from "@/types/calendar";

type CalendarEventListProps = {
  events: CalendarEventItem[];
};

function groupEventsByDate(events: CalendarEventItem[]) {
  return events.reduce<Record<string, CalendarEventItem[]>>((groups, event) => {
    const key = getDateKey(event.date);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(event);

    return groups;
  }, {});
}

export function CalendarEventList({ events }: CalendarEventListProps) {
  const groupedEvents = groupEventsByDate(events);
  const dates = Object.keys(groupedEvents).sort();

  return (
    <div className="space-y-8">
      {dates.map((date) => (
        <DeadlineGroupSection key={date} date={date} events={groupedEvents[date]} />
      ))}
    </div>
  );
}
```

---

### 10. Create Calendar Page

Buat folder:

```txt
app/dashboard/calendar/
```

Buat file:

```txt
app/dashboard/calendar/page.tsx
```

Isi:

```tsx
import { getCalendarDataAction } from "@/actions/calendar";
import { CalendarEmptyState } from "@/features/calendar/components/calendar-empty-state";
import { CalendarEventList } from "@/features/calendar/components/calendar-event-list";
import { CalendarSummaryCards } from "@/features/calendar/components/calendar-summary-cards";
import { Card } from "@/components/ui/card";

export default async function CalendarPage() {
  const result = await getCalendarDataAction();

  if (!result.success || !result.data) {
    return (
      <Card className="p-6">
        <h1 className="text-lg font-semibold text-slate-950">Gagal memuat calendar</h1>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
  }

  const data = result.data;

  if (data.events.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Calendar</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review your study plan timeline and task deadlines.
          </p>
        </div>

        <CalendarEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Calendar</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review your study plan timeline, upcoming deadlines, and overdue tasks.
        </p>
      </div>

      <CalendarSummaryCards summary={data.summary} />

      <CalendarEventList events={data.events} />
    </div>
  );
}
```

---

### 11. Revalidate Calendar Path from Existing Mutations

Pastikan action berikut memanggil:

```ts
revalidatePath("/dashboard/calendar");
```

Pada file:

```txt
actions/study-plans.ts
actions/tasks.ts
```

Minimal pada function:

```txt
createStudyPlanAction
updateStudyPlanAction
deleteStudyPlanAction
createTaskAction
updateTaskAction
updateTaskStatusAction
deleteTaskAction
```

Alasan:

```txt
Calendar berubah ketika study plan atau task deadline berubah.
```

---

### 12. Test Overdue, Today, Upcoming, Completed

Buat data testing:

```txt
Task due yesterday and status TODO
Task due today and status TODO
Task due tomorrow and status TODO
Task due yesterday and status DONE
```

Expected:

```txt
Task due yesterday TODO = OVERDUE
Task due today TODO = TODAY
Task due tomorrow TODO = UPCOMING
Task due yesterday DONE = COMPLETED
```

---

### 13. Run Checks

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
└── calendar.ts

app/
└── dashboard/
    └── calendar/
        └── page.tsx

features/
└── calendar/
    ├── components/
    │   ├── calendar-empty-state.tsx
    │   ├── calendar-event-card.tsx
    │   ├── calendar-event-list.tsx
    │   ├── calendar-summary-cards.tsx
    │   └── deadline-group-section.tsx
    └── utils/
        └── calendar-format.ts

types/
└── calendar.ts
```

File yang kemungkinan diubah:

```txt
constants/navigation.ts
actions/study-plans.ts
actions/tasks.ts
```

## Acceptance Criteria

- Route `/dashboard/calendar` tersedia.
- Calendar page hanya bisa diakses user login.
- Menu Calendar tampil di dashboard sidebar.
- Active nav state Calendar berjalan.
- Calendar menampilkan task deadline.
- Calendar menampilkan study plan start date.
- Calendar menampilkan study plan end date.
- Event dikelompokkan berdasarkan tanggal.
- Event diurutkan berdasarkan tanggal terdekat.
- Summary cards tampil.
- Overdue tasks tampil.
- Due today tasks tampil.
- Upcoming tasks tampil.
- Completed tasks tampil.
- Empty state tampil jika belum ada deadline.
- Error state tampil jika data gagal dimuat.
- Semua data berdasarkan user login.
- User tidak bisa melihat calendar data user lain.
- Calendar action berada di folder root `actions/`.
- Calendar action memvalidasi session user.
- Semua query calendar memfilter berdasarkan `userId`.
- Calendar path direvalidate setelah study plan berubah.
- Calendar path direvalidate setelah task berubah.
- UI mengikuti clean white dashboard style.
- Layout responsive untuk mobile dan desktop.
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
http://localhost:3000/dashboard/calendar
```

Expected:

```txt
Calendar Deadline View tampil.
```

---

### 2. Test Protected Access

Logout, lalu buka:

```txt
http://localhost:3000/dashboard/calendar
```

Expected:

```txt
User diarahkan ke /login.
```

---

### 3. Test Empty Calendar

Gunakan user baru tanpa study plan dan task deadline.

Expected:

```txt
Empty state tampil.
CTA ke /dashboard/plans dan /dashboard/tasks tampil.
```

---

### 4. Test Study Plan Dates

Buat study plan dengan:

```txt
Start Date: 2026-07-01
End Date: 2026-07-14
```

Expected:

```txt
Calendar menampilkan Study Plan Start pada 2026-07-01.
Calendar menampilkan Study Plan End pada 2026-07-14.
```

---

### 5. Test Task Due Date

Buat task dengan:

```txt
Due Date: 2026-07-03
```

Expected:

```txt
Calendar menampilkan Task Deadline pada 2026-07-03.
Task card menampilkan subject, study plan, status, dan priority.
```

---

### 6. Test Overdue Status

Buat task dengan due date sebelum hari ini dan status bukan DONE.

Expected:

```txt
Event tampil sebagai Overdue.
Badge Overdue tampil.
```

---

### 7. Test Today Status

Buat task dengan due date hari ini dan status bukan DONE.

Expected:

```txt
Event tampil sebagai Today.
Badge Today tampil.
```

---

### 8. Test Completed Status

Buat task dengan status DONE.

Expected:

```txt
Event tampil sebagai Completed meskipun due date sudah lewat.
```

---

### 9. Test Event Grouping

Buat beberapa event di tanggal yang sama.

Expected:

```txt
Event tampil dalam group tanggal yang sama.
```

---

### 10. Test User Isolation

Login sebagai user A dan buat task deadline.

Login sebagai user B.

Expected:

```txt
User B tidak melihat calendar event user A.
User B hanya melihat event miliknya sendiri.
```

---

### 11. Test Revalidation

Update due date task.

Buka ulang calendar.

Expected:

```txt
Tanggal event berubah sesuai due date terbaru.
```

Update end date study plan.

Expected:

```txt
Tanggal Study Plan End berubah sesuai end date terbaru.
```

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

## Notes

- Jangan membuat drag and drop calendar di issue ini.
- Jangan membuat full calendar grid kompleks dulu.
- Deadline view berbasis grouped timeline sudah cukup untuk MVP.
- Jangan membuat reminder notification di issue ini.
- Jangan membuat Google Calendar integration.
- Jangan membuat API route.
- Semua query wajib filter user login.
- Calendar data adalah derived data dari study plan dan task.
- Jika nanti ingin tampilan calendar grid, buat issue terpisah.
- Jika ingin reminder, buat issue terpisah.

## Suggested Commit Message

```bash
feat: build calendar deadline view
```
