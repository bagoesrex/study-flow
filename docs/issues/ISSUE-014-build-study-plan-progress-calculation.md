# ISSUE-014 — Build Study Plan Progress Calculation

## Status

Planned

## Priority

High

## Type

Feature / Progress Tracking

## Summary

Membangun perhitungan progress untuk Study Plan berdasarkan task yang sudah dibuat user.

Progress Study Plan dihitung dari jumlah task yang sudah selesai dibanding total task dalam study plan tersebut.

Contoh:

```txt
Total tasks: 10
Completed tasks: 6
Progress: 60%
```

Issue ini bertujuan membuat progress Study Plan tampil secara konsisten di halaman dashboard, halaman study plan, dan analytics.

## Background

Pada issue sebelumnya, StudyFlow sudah memiliki:

```txt
Subject Management
Study Plan Management
Task Management
Study Session Tracker
Analytics Dashboard
Dashboard Real Statistics
```

Saat ini progress Study Plan masih bisa berupa placeholder atau dihitung secara terpisah di beberapa tempat. Pada issue ini, progress calculation dibuat lebih rapi dan reusable agar tidak terjadi duplikasi logic.

Progress ini akan digunakan pada:

```txt
/dashboard
/dashboard/plans
/dashboard/analytics
```

## Goals

- Membuat helper untuk menghitung progress study plan.
- Membuat query untuk mengambil study plan dengan progress.
- Menampilkan progress di halaman `/dashboard/plans`.
- Menampilkan progress di dashboard overview.
- Menampilkan jumlah completed task dan total task.
- Menampilkan progress bar.
- Menampilkan status progress secara visual.
- Menghindari duplikasi logic progress di banyak file.
- Memastikan progress berdasarkan data user login.
- Memastikan user tidak bisa melihat progress milik user lain.
- Memastikan progress update setelah task dibuat, diubah, atau dihapus.

## Non-Goals

- Tidak membuat CRUD baru.
- Tidak membuat kanban board.
- Tidak membuat drag and drop task.
- Tidak membuat study plan detail page.
- Tidak membuat analytics baru.
- Tidak membuat calendar view.
- Tidak membuat AI insight.
- Tidak membuat API route.
- Tidak mengubah schema database.
- Tidak menambahkan shadcn/ui.

## Formula

Progress dihitung dengan formula:

```txt
completedTasks / totalTasks * 100
```

Rules:

```txt
Jika totalTasks = 0, progress = 0
Jika semua task DONE, progress = 100
Progress dibulatkan ke integer terdekat
```

Contoh:

```txt
0/0 task = 0%
0/5 task = 0%
3/5 task = 60%
5/5 task = 100%
```

## Data Source

Gunakan tabel:

```txt
study_plans
study_tasks
subjects
```

Field utama:

```txt
study_plans.id
study_plans.user_id
study_plans.subject_id
study_plans.title
study_plans.status
study_tasks.study_plan_id
study_tasks.status
subjects.name
subjects.color
```

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
features/
└── study-plans/
    ├── queries/
    │   └── get-study-plan-progress.ts
    └── utils/
        └── study-plan-progress.ts

types/
└── study-plan-progress.ts
```

Jika ingin query tetap di `actions/study-plans.ts`, boleh, tetapi helper progress tetap dipisahkan di `features/study-plans/utils`.

## Implementation Steps

### 1. Create Progress Type

Buat file:

```txt
types/study-plan-progress.ts
```

Isi:

```ts
export type StudyPlanProgress = {
  totalTasks: number;
  completedTasks: number;
  progress: number;
};

export type StudyPlanWithProgress = {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  title: string;
  description: string | null;
  goal: string | null;
  startDate: string | null;
  endDate: string | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  estimatedHours: number | null;
  totalTasks: number;
  completedTasks: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
};
```

---

### 2. Create Progress Utility

Buat file:

```txt
features/study-plans/utils/study-plan-progress.ts
```

Isi:

```ts
export function calculateStudyPlanProgress({
  totalTasks,
  completedTasks,
}: {
  totalTasks: number;
  completedTasks: number;
}) {
  if (totalTasks <= 0) {
    return 0;
  }

  return Math.round((completedTasks / totalTasks) * 100);
}

export function getProgressLabel(progress: number) {
  if (progress === 0) {
    return "Not started";
  }

  if (progress < 50) {
    return "In progress";
  }

  if (progress < 100) {
    return "Almost there";
  }

  return "Completed";
}

export function getProgressDescription({
  completedTasks,
  totalTasks,
}: {
  completedTasks: number;
  totalTasks: number;
}) {
  return `${completedTasks}/${totalTasks} tasks completed`;
}
```

---

### 3. Create Study Plan Progress Query

Buat file:

```txt
features/study-plans/queries/get-study-plan-progress.ts
```

Isi:

```ts
import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { studyPlans, studyTasks, subjects } from "@/db/schema";
import { calculateStudyPlanProgress } from "@/features/study-plans/utils/study-plan-progress";
import type { StudyPlanWithProgress } from "@/types/study-plan-progress";

export async function getStudyPlansWithProgress(userId: string) {
  const plans = await db
    .select({
      id: studyPlans.id,
      subjectId: studyPlans.subjectId,
      subjectName: subjects.name,
      subjectColor: subjects.color,
      title: studyPlans.title,
      description: studyPlans.description,
      goal: studyPlans.goal,
      startDate: studyPlans.startDate,
      endDate: studyPlans.endDate,
      status: studyPlans.status,
      priority: studyPlans.priority,
      estimatedHours: studyPlans.estimatedHours,
      totalTasks: sql<number>`count(${studyTasks.id})::int`,
      completedTasks: sql<number>`count(case when ${studyTasks.status} = 'DONE' then 1 end)::int`,
      createdAt: studyPlans.createdAt,
      updatedAt: studyPlans.updatedAt,
    })
    .from(studyPlans)
    .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
    .leftJoin(studyTasks, eq(studyTasks.studyPlanId, studyPlans.id))
    .where(and(eq(studyPlans.userId, userId), eq(subjects.userId, userId)))
    .groupBy(
      studyPlans.id,
      studyPlans.subjectId,
      subjects.name,
      subjects.color,
      studyPlans.title,
      studyPlans.description,
      studyPlans.goal,
      studyPlans.startDate,
      studyPlans.endDate,
      studyPlans.status,
      studyPlans.priority,
      studyPlans.estimatedHours,
      studyPlans.createdAt,
      studyPlans.updatedAt
    )
    .orderBy(desc(studyPlans.createdAt));

  return plans.map<StudyPlanWithProgress>((plan) => ({
    ...plan,
    progress: calculateStudyPlanProgress({
      totalTasks: plan.totalTasks,
      completedTasks: plan.completedTasks,
    }),
  }));
}
```

Catatan:

- Query wajib menerima `userId`.
- Jangan ambil progress tanpa filter user.
- Query ini bisa dipakai ulang di actions lain.

---

### 4. Update Study Plan Action

Edit file:

```txt
actions/study-plans.ts
```

Update `getStudyPlansAction` agar menggunakan query baru:

```ts
import { getStudyPlansWithProgress } from "@/features/study-plans/queries/get-study-plan-progress";
```

Lalu ubah function:

```ts
export async function getStudyPlansAction() {
  try {
    const user = await requireAuthUser();

    const data = await getStudyPlansWithProgress(user.id);

    return {
      success: true,
      message: "Study plan berhasil diambil.",
      data,
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data study plan.",
      data: [],
    };
  }
}
```

Pastikan return type disesuaikan menjadi:

```ts
ActionResponse<StudyPlanWithProgress[]>;
```

---

### 5. Update Study Plan Types Usage

Jika sebelumnya memakai:

```txt
types/study-plan.ts
```

Update agar type item study plan memiliki field progress:

```ts
export type StudyPlanItem = {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  title: string;
  description: string | null;
  goal: string | null;
  startDate: string | null;
  endDate: string | null;
  status: StudyPlanStatus;
  priority: StudyPlanPriority;
  estimatedHours: number | null;
  totalTasks: number;
  completedTasks: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
};
```

Jika sudah memakai `StudyPlanWithProgress`, pastikan tidak ada type duplikat yang membuat bingung.

---

### 6. Update Study Plan Card

Edit file:

```txt
features/study-plans/components/study-plan-card.tsx
```

Tambahkan progress section:

```tsx
import { Progress } from "@/components/ui/progress";
import {
  getProgressDescription,
  getProgressLabel,
} from "@/features/study-plans/utils/study-plan-progress";
```

Tambahkan di dalam card:

```tsx
<div className="mt-5">
  <div className="mb-2 flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-medium text-slate-950">{getProgressLabel(plan.progress)}</p>
      <p className="text-xs text-slate-500">
        {getProgressDescription({
          completedTasks: plan.completedTasks,
          totalTasks: plan.totalTasks,
        })}
      </p>
    </div>

    <p className="text-sm font-semibold text-slate-950">{plan.progress}%</p>
  </div>

  <Progress value={plan.progress} />
</div>
```

Expected:

```txt
Setiap study plan card menampilkan progress bar.
Progress sesuai jumlah task DONE.
```

---

### 7. Update Active Plan Progress Dashboard

Edit file:

```txt
actions/dashboard.ts
```

Pastikan active plan progress menggunakan helper yang sama:

```ts
import { calculateStudyPlanProgress } from "@/features/study-plans/utils/study-plan-progress";
```

Ubah mapping progress:

```ts
progress: calculateStudyPlanProgress({
  totalTasks: plan.totalTasks,
  completedTasks: plan.completedTasks,
}),
```

Tujuan:

```txt
Formula progress dashboard sama dengan formula di halaman study plan.
```

---

### 8. Update Analytics if Needed

Jika analytics memiliki progress study plan atau akan menampilkan progress study plan, gunakan helper yang sama:

```ts
calculateStudyPlanProgress();
```

Jika belum ada section progress study plan di analytics, cukup pastikan issue ini tidak mengubah analytics.

---

### 9. Update Task Mutations Revalidation

Pastikan file berikut:

```txt
actions/tasks.ts
```

Sudah memanggil:

```ts
revalidatePath("/dashboard");
revalidatePath("/dashboard/plans");
revalidatePath("/dashboard/analytics");
```

Pada function:

```txt
createTaskAction
updateTaskAction
updateTaskStatusAction
deleteTaskAction
```

Alasan:

```txt
Progress study plan berubah ketika task dibuat, diubah, dihapus, atau statusnya berubah.
```

---

### 10. Update Study Plan List Loading State

Pastikan loading state di:

```txt
features/study-plans/components/study-plan-list.tsx
```

Tetap sesuai karena card sekarang punya progress bar.

Expected skeleton:

```txt
Card loading cukup tinggi untuk menampung progress section.
```

---

### 11. Test No Task Condition

Study plan tanpa task harus tampil:

```txt
Progress: 0%
Description: 0/0 tasks completed
Label: Not started
```

Tidak boleh error pembagian 0.

---

### 12. Test Completed Plan Condition

Study plan dengan semua task DONE harus tampil:

```txt
Progress: 100%
Label: Completed
Progress bar penuh
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
features/
└── study-plans/
    ├── queries/
    │   └── get-study-plan-progress.ts
    └── utils/
        └── study-plan-progress.ts

types/
└── study-plan-progress.ts
```

File yang kemungkinan diubah:

```txt
actions/study-plans.ts
actions/dashboard.ts
actions/tasks.ts
features/study-plans/components/study-plan-card.tsx
features/study-plans/components/study-plan-list.tsx
types/study-plan.ts
```

## Acceptance Criteria

- Study plan progress dihitung dari task.
- Formula progress konsisten di semua tempat.
- Helper `calculateStudyPlanProgress` tersedia.
- Study plan tanpa task menampilkan progress 0%.
- Study plan dengan sebagian task selesai menampilkan progress sesuai data.
- Study plan dengan semua task selesai menampilkan progress 100%.
- Study plan card menampilkan progress bar.
- Study plan card menampilkan completed tasks dan total tasks.
- Dashboard active plan progress memakai helper yang sama.
- Progress update setelah task dibuat.
- Progress update setelah task diubah.
- Progress update setelah status task berubah.
- Progress update setelah task dihapus.
- Progress hanya berdasarkan data user login.
- User tidak bisa melihat progress study plan user lain.
- Tidak ada schema database yang diubah.
- Tidak ada API route baru.
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
/dashboard/plans
```

Expected:

```txt
Study plan list tampil dengan progress bar.
```

---

### 2. Test Study Plan Without Task

Buat study plan baru tanpa task.

Expected:

```txt
Progress = 0%
Completed tasks = 0/0
Label = Not started
Tidak ada error.
```

---

### 3. Test Study Plan With Tasks

Buat 5 task di satu study plan:

```txt
2 DONE
2 IN_PROGRESS
1 TODO
```

Expected:

```txt
Progress = 40%
Completed tasks = 2/5
```

---

### 4. Test Mark Task Done

Ubah satu task dari `TODO` menjadi `DONE`.

Expected:

```txt
Progress berubah dari 40% menjadi 60%.
Completed tasks berubah dari 2/5 menjadi 3/5.
```

---

### 5. Test Mark Task Not Done

Ubah satu task dari `DONE` menjadi `IN_PROGRESS`.

Expected:

```txt
Progress berkurang sesuai jumlah task DONE.
completedAt task menjadi null.
```

---

### 6. Test Delete Task

Hapus satu task.

Expected:

```txt
Total task berkurang.
Progress dihitung ulang.
Tidak ada stale data.
```

---

### 7. Test Dashboard Progress

Buka:

```txt
/dashboard
```

Expected:

```txt
Active plan progress di dashboard sama dengan progress di /dashboard/plans.
```

---

### 8. Test User Isolation

Login sebagai user A dan buat study plan + task.

Login sebagai user B.

Expected:

```txt
User B tidak melihat progress study plan user A.
```

---

### 9. Run Checks

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

- Jangan menyimpan progress ke database pada issue ini.
- Progress dihitung dari task agar selalu akurat.
- Jangan membuat table baru.
- Jangan membuat study plan detail page di issue ini.
- Jangan membuat chart baru.
- Jangan membuat API route.
- Jika performa query mulai berat, optimasi bisa dibuat di issue terpisah.
- Untuk MVP, menghitung progress via aggregation query sudah cukup.
- Progress yang tersimpan di UI harus dianggap derived data.

## Suggested Commit Message

```bash
feat: build study plan progress calculation
```
