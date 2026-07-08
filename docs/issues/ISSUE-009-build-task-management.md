# ISSUE-009 — Build Task Management

## Status

Planned

## Priority

High

## Type

Feature / Dashboard CRUD

## Summary

Membangun fitur Task Management untuk StudyFlow. Task adalah daftar pekerjaan kecil yang berada di dalam sebuah Study Plan.

Contoh task:

```txt
Setup project Next.js
Belajar App Router
Setup Drizzle schema
Implementasi Authentication
Membuat Dashboard Layout
Deploy ke Vercel
```

Issue ini melanjutkan fitur Study Plan Management. User harus bisa membuat task berdasarkan study plan yang sudah dibuat sebelumnya.

## Background

Flow utama StudyFlow:

```txt
User → Subject → Study Plan → Task → Study Session → Analytics
```

Pada issue sebelumnya, user sudah bisa membuat Study Plan. Pada issue ini, user mulai bisa memecah Study Plan menjadi beberapa task kecil agar progress belajar lebih mudah dilacak.

Route utama:

```txt
/dashboard/tasks
```

Task juga akan menjadi dasar perhitungan progress pada issue berikutnya, misalnya:

```txt
6 task done / 10 total task = 60%
```

## Goals

- Membuat halaman Task Management.
- Menampilkan daftar task milik user login.
- Membuat task baru.
- Mengedit task.
- Menghapus task.
- Mengubah status task.
- Mengubah priority task.
- Menghubungkan task dengan study plan.
- Menampilkan study plan title pada task card.
- Menampilkan status badge.
- Menampilkan priority badge.
- Menampilkan due date.
- Menampilkan completed date jika task selesai.
- Menampilkan empty state jika belum ada task.
- Menampilkan loading state.
- Menampilkan error state.
- Validasi input menggunakan Zod.
- Form menggunakan React Hook Form.
- Data fetching menggunakan TanStack Query.
- Mutation create/update/delete/status menggunakan TanStack Query.
- Semua operasi database menggunakan Server Actions di folder root `actions/`.
- Semua action wajib memvalidasi session user.
- User hanya boleh mengakses task miliknya sendiri.

## Non-Goals

- Tidak membuat Study Session Tracker.
- Tidak membuat Analytics Dashboard.
- Tidak membuat drag and drop task ordering.
- Tidak membuat Kanban board.
- Tidak membuat calendar view.
- Tidak membuat reminder notification.
- Tidak membuat AI task breakdown.
- Tidak membuat API route.
- Tidak mengubah schema database.
- Tidak menambahkan shadcn/ui.
- Tidak membuat admin task management.

## Tech Stack

- Next.js App Router
- TypeScript
- Drizzle ORM
- PostgreSQL
- Server Actions
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- Custom UI Components
- Radix Dialog
- Lucide React

## Route

Fitur ini berada di:

```txt
/dashboard/tasks
```

## Database Table

Gunakan tabel yang sudah ada:

```txt
study_tasks
study_plans
subjects
```

Field utama `study_tasks`:

```txt
id
user_id
study_plan_id
title
description
status
priority
due_date
position
completed_at
created_at
updated_at
```

Enum yang digunakan:

```txt
task_status:
TODO
IN_PROGRESS
DONE

priority:
LOW
MEDIUM
HIGH
URGENT
```

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
actions/
└── tasks.ts

app/
└── dashboard/
    └── tasks/
        └── page.tsx

features/
└── tasks/
    ├── components/
    │   ├── task-card.tsx
    │   ├── task-create-form.tsx
    │   ├── task-delete-dialog.tsx
    │   ├── task-empty-state.tsx
    │   ├── task-list.tsx
    │   ├── task-status-button.tsx
    │   └── task-update-form.tsx
    ├── hooks/
    │   ├── use-create-task-mutation.ts
    │   ├── use-delete-task-mutation.ts
    │   ├── use-tasks-query.ts
    │   ├── use-update-task-mutation.ts
    │   └── use-update-task-status-mutation.ts
    └── schemas/
        └── task-schema.ts

types/
└── task.ts
```

## Implementation Steps

### 1. Create Task Types

Buat file:

```txt
types/task.ts
```

Isi:

```ts
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskItem = {
  id: string;
  studyPlanId: string;
  studyPlanTitle: string;
  subjectName: string;
  subjectColor: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  position: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
```

---

### 2. Create Task Validation Schema

Buat file:

```txt
features/tasks/schemas/task-schema.ts
```

Isi:

```ts
import { z } from "zod";

export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const taskSchema = z.object({
  studyPlanId: z.string().uuid("Study plan tidak valid"),
  title: z
    .string()
    .min(3, "Judul task minimal 3 karakter")
    .max(180, "Judul task maksimal 180 karakter"),
  description: z.string().max(700, "Deskripsi maksimal 700 karakter").optional().or(z.literal("")),
  status: taskStatusSchema.default("TODO"),
  priority: taskPrioritySchema.default("MEDIUM"),
  dueDate: z.string().optional().or(z.literal("")),
  position: z.coerce
    .number()
    .int("Position harus angka bulat")
    .min(0, "Position minimal 0")
    .optional()
    .or(z.literal("")),
});

export const updateTaskSchema = taskSchema.extend({
  id: z.string().uuid("ID task tidak valid"),
});

export const updateTaskStatusSchema = z.object({
  id: z.string().uuid("ID task tidak valid"),
  status: taskStatusSchema,
});

export const deleteTaskSchema = z.object({
  id: z.string().uuid("ID task tidak valid"),
});

export type TaskInput = z.infer<typeof taskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
```

---

### 3. Create Task Actions

Buat file:

```txt
actions/tasks.ts
```

Isi:

```ts
"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, studyTasks, subjects } from "@/db/schema";
import {
  deleteTaskSchema,
  taskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  type DeleteTaskInput,
  type TaskInput,
  type UpdateTaskInput,
  type UpdateTaskStatusInput,
} from "@/features/tasks/schemas/task-schema";
import type { ActionResponse } from "@/types/action-response";
import type { TaskItem } from "@/types/task";

function normalizeText(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value.trim();
}

function normalizeDate(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value;
}

function normalizePosition(value: TaskInput["position"]) {
  if (value === "" || value === undefined) {
    return 0;
  }

  return value;
}

function getCompletedAt(status: UpdateTaskStatusInput["status"]) {
  if (status === "DONE") {
    return new Date();
  }

  return null;
}

async function requireAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

async function ensureStudyPlanBelongsToUser(studyPlanId: string, userId: string) {
  const [plan] = await db
    .select({
      id: studyPlans.id,
    })
    .from(studyPlans)
    .where(and(eq(studyPlans.id, studyPlanId), eq(studyPlans.userId, userId)))
    .limit(1);

  return plan;
}

export async function getTasksAction(): Promise<ActionResponse<TaskItem[]>> {
  try {
    const user = await requireAuthUser();

    const data = await db
      .select({
        id: studyTasks.id,
        studyPlanId: studyTasks.studyPlanId,
        studyPlanTitle: studyPlans.title,
        subjectName: subjects.name,
        subjectColor: subjects.color,
        title: studyTasks.title,
        description: studyTasks.description,
        status: studyTasks.status,
        priority: studyTasks.priority,
        dueDate: studyTasks.dueDate,
        position: studyTasks.position,
        completedAt: studyTasks.completedAt,
        createdAt: studyTasks.createdAt,
        updatedAt: studyTasks.updatedAt,
      })
      .from(studyTasks)
      .innerJoin(studyPlans, eq(studyTasks.studyPlanId, studyPlans.id))
      .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
      .where(eq(studyTasks.userId, user.id))
      .orderBy(desc(studyTasks.createdAt));

    return {
      success: true,
      message: "Task berhasil diambil.",
      data,
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data task.",
      data: [],
    };
  }
}

export async function createTaskAction(input: TaskInput): Promise<ActionResponse<{ id: string }>> {
  const parsed = taskSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const plan = await ensureStudyPlanBelongsToUser(parsed.data.studyPlanId, user.id);

    if (!plan) {
      return {
        success: false,
        message: "Study plan tidak ditemukan.",
      };
    }

    const [newTask] = await db
      .insert(studyTasks)
      .values({
        userId: user.id,
        studyPlanId: parsed.data.studyPlanId,
        title: parsed.data.title.trim(),
        description: normalizeText(parsed.data.description),
        status: parsed.data.status,
        priority: parsed.data.priority,
        dueDate: normalizeDate(parsed.data.dueDate),
        position: normalizePosition(parsed.data.position),
        completedAt: parsed.data.status === "DONE" ? new Date() : null,
      })
      .returning({
        id: studyTasks.id,
      });

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Task berhasil dibuat.",
      data: {
        id: newTask.id,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal membuat task.",
    };
  }
}

export async function updateTaskAction(input: UpdateTaskInput): Promise<ActionResponse> {
  const parsed = updateTaskSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingTask] = await db
      .select({
        id: studyTasks.id,
      })
      .from(studyTasks)
      .where(and(eq(studyTasks.id, parsed.data.id), eq(studyTasks.userId, user.id)))
      .limit(1);

    if (!existingTask) {
      return {
        success: false,
        message: "Task tidak ditemukan.",
      };
    }

    const plan = await ensureStudyPlanBelongsToUser(parsed.data.studyPlanId, user.id);

    if (!plan) {
      return {
        success: false,
        message: "Study plan tidak ditemukan.",
      };
    }

    await db
      .update(studyTasks)
      .set({
        studyPlanId: parsed.data.studyPlanId,
        title: parsed.data.title.trim(),
        description: normalizeText(parsed.data.description),
        status: parsed.data.status,
        priority: parsed.data.priority,
        dueDate: normalizeDate(parsed.data.dueDate),
        position: normalizePosition(parsed.data.position),
        completedAt: parsed.data.status === "DONE" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(and(eq(studyTasks.id, parsed.data.id), eq(studyTasks.userId, user.id)));

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Task berhasil diperbarui.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui task.",
    };
  }
}

export async function updateTaskStatusAction(
  input: UpdateTaskStatusInput
): Promise<ActionResponse> {
  const parsed = updateTaskStatusSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingTask] = await db
      .select({
        id: studyTasks.id,
      })
      .from(studyTasks)
      .where(and(eq(studyTasks.id, parsed.data.id), eq(studyTasks.userId, user.id)))
      .limit(1);

    if (!existingTask) {
      return {
        success: false,
        message: "Task tidak ditemukan.",
      };
    }

    await db
      .update(studyTasks)
      .set({
        status: parsed.data.status,
        completedAt: getCompletedAt(parsed.data.status),
        updatedAt: new Date(),
      })
      .where(and(eq(studyTasks.id, parsed.data.id), eq(studyTasks.userId, user.id)));

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Status task berhasil diperbarui.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui status task.",
    };
  }
}

export async function deleteTaskAction(input: DeleteTaskInput): Promise<ActionResponse> {
  const parsed = deleteTaskSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingTask] = await db
      .select({
        id: studyTasks.id,
      })
      .from(studyTasks)
      .where(and(eq(studyTasks.id, parsed.data.id), eq(studyTasks.userId, user.id)))
      .limit(1);

    if (!existingTask) {
      return {
        success: false,
        message: "Task tidak ditemukan.",
      };
    }

    await db
      .delete(studyTasks)
      .where(and(eq(studyTasks.id, parsed.data.id), eq(studyTasks.userId, user.id)));

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard/plans");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Task berhasil dihapus.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal menghapus task.",
    };
  }
}
```

---

### 4. Create Tasks Query Hook

Buat file:

```txt
features/tasks/hooks/use-tasks-query.ts
```

Isi:

```ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { getTasksAction } from "@/actions/tasks";

export const tasksQueryKey = ["tasks"];

export function useTasksQuery() {
  return useQuery({
    queryKey: tasksQueryKey,
    queryFn: async () => {
      const result = await getTasksAction();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data ?? [];
    },
  });
}
```

---

### 5. Create Create Task Mutation Hook

Buat file:

```txt
features/tasks/hooks/use-create-task-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTaskAction } from "@/actions/tasks";
import type { TaskInput } from "@/features/tasks/schemas/task-schema";
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks-query";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TaskInput) => createTaskAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
          queryClient.invalidateQueries({ queryKey: studyPlansQueryKey }),
        ]);
      }
    },
  });
}
```

---

### 6. Create Update Task Mutation Hook

Buat file:

```txt
features/tasks/hooks/use-update-task-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTaskAction } from "@/actions/tasks";
import type { UpdateTaskInput } from "@/features/tasks/schemas/task-schema";
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks-query";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTaskInput) => updateTaskAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
          queryClient.invalidateQueries({ queryKey: studyPlansQueryKey }),
        ]);
      }
    },
  });
}
```

---

### 7. Create Update Task Status Mutation Hook

Buat file:

```txt
features/tasks/hooks/use-update-task-status-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTaskStatusAction } from "@/actions/tasks";
import type { UpdateTaskStatusInput } from "@/features/tasks/schemas/task-schema";
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks-query";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";

export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTaskStatusInput) => updateTaskStatusAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
          queryClient.invalidateQueries({ queryKey: studyPlansQueryKey }),
        ]);
      }
    },
  });
}
```

---

### 8. Create Delete Task Mutation Hook

Buat file:

```txt
features/tasks/hooks/use-delete-task-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTaskAction } from "@/actions/tasks";
import type { DeleteTaskInput } from "@/features/tasks/schemas/task-schema";
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks-query";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteTaskInput) => deleteTaskAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
          queryClient.invalidateQueries({ queryKey: studyPlansQueryKey }),
        ]);
      }
    },
  });
}
```

---

### 9. Create Task Empty State

Buat file:

```txt
features/tasks/components/task-empty-state.tsx
```

Isi:

```tsx
import { CheckSquare } from "lucide-react";

import { Card } from "@/components/ui/card";

export function TaskEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <CheckSquare className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-slate-950">Belum ada task</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Buat task pertama untuk memecah study plan menjadi langkah belajar yang lebih kecil dan
        mudah diselesaikan.
      </p>
    </Card>
  );
}
```

---

### 10. Create Task Create Form

Buat file:

```txt
features/tasks/components/task-create-form.tsx
```

Requirements:

- Client component.
- Menggunakan React Hook Form.
- Menggunakan `taskSchema`.
- Menggunakan `useCreateTaskMutation`.
- Menggunakan `useStudyPlansQuery` untuk pilihan study plan.
- Jika belum ada study plan, tampilkan pesan agar user membuat study plan dulu.
- Submit berhasil membuat task dan reset form.

Field:

```txt
studyPlanId
title
description
status
priority
dueDate
position
```

Catatan:

- Untuk select sederhana, boleh gunakan native `<select>` terlebih dahulu.
- Jika belum ada study plan, tombol create task disabled.

---

### 11. Create Task Status Button

Buat file:

```txt
features/tasks/components/task-status-button.tsx
```

Requirements:

- Menerima `taskId` dan `currentStatus`.
- Menampilkan tombol cepat:

  - Mark as Todo
  - Mark as In Progress
  - Mark as Done

- Menggunakan `useUpdateTaskStatusMutation`.
- Jika status menjadi `DONE`, `completedAt` otomatis terisi dari action.

Behavior sederhana:

```txt
TODO → In Progress
IN_PROGRESS → Done
DONE → Todo
```

---

### 12. Create Task Card

Buat file:

```txt
features/tasks/components/task-card.tsx
```

Requirements:

- Menampilkan task title.
- Menampilkan study plan title.
- Menampilkan subject name dan warna subject.
- Menampilkan description.
- Menampilkan status badge.
- Menampilkan priority badge.
- Menampilkan due date.
- Menampilkan completed date jika task done.
- Menampilkan edit button.
- Menampilkan delete button.
- Menampilkan quick status button.

Visual card:

```txt
[Subject Color] Next.js
Setup Drizzle and PostgreSQL Schema

Study Plan: Belajar Next.js Fullstack
Status: In Progress
Priority: High
Due: 2 Jul 2026
```

Badge variant mapping:

```txt
TODO = default
IN_PROGRESS = info
DONE = success

LOW = default
MEDIUM = info
HIGH = warning
URGENT = danger
```

---

### 13. Create Task Update Form

Buat file:

```txt
features/tasks/components/task-update-form.tsx
```

Requirements:

- Bisa ditampilkan dalam Radix Dialog.
- Menggunakan React Hook Form.
- Default values berasal dari task.
- Menggunakan `updateTaskSchema`.
- Menggunakan `useUpdateTaskMutation`.
- Menggunakan `useStudyPlansQuery` untuk pilihan study plan.
- Setelah berhasil update, tutup dialog.

Field:

```txt
studyPlanId
title
description
status
priority
dueDate
position
```

---

### 14. Create Task Delete Dialog

Buat file:

```txt
features/tasks/components/task-delete-dialog.tsx
```

Requirements:

- Menggunakan Radix Dialog.
- Menampilkan nama task.
- Menampilkan warning bahwa delete tidak bisa dibatalkan.
- Menggunakan `useDeleteTaskMutation`.
- Setelah berhasil delete, tutup dialog.

Warning copy:

```txt
Menghapus task akan menghapus data task ini secara permanen. Tindakan ini tidak bisa dibatalkan.
```

---

### 15. Create Task List Component

Buat file:

```txt
features/tasks/components/task-list.tsx
```

Isi:

```tsx
"use client";

import { TaskCard } from "@/features/tasks/components/task-card";
import { TaskEmptyState } from "@/features/tasks/components/task-empty-state";
import { useTasksQuery } from "@/features/tasks/hooks/use-tasks-query";
import { Card } from "@/components/ui/card";

export function TaskList() {
  const query = useTasksQuery();

  if (query.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-56 animate-pulse bg-slate-100" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-950">Gagal memuat task</h3>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
  }

  const tasks = query.data ?? [];

  if (tasks.length === 0) {
    return <TaskEmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

---

### 16. Update Tasks Page

Edit file:

```txt
app/dashboard/tasks/page.tsx
```

Isi:

```tsx
import { TaskCreateForm } from "@/features/tasks/components/task-create-form";
import { TaskList } from "@/features/tasks/components/task-list";

export default function TasksPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <TaskCreateForm />

      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Tasks</h1>
          <p className="mt-2 text-sm text-slate-500">
            Pecah study plan menjadi task kecil agar progres belajar lebih mudah dipantau.
          </p>
        </div>

        <TaskList />
      </div>
    </div>
  );
}
```

---

### 17. Handle No Study Plan State

Karena task wajib punya study plan, form create harus menangani kondisi study plan kosong.

Jika `useStudyPlansQuery()` menghasilkan array kosong:

```txt
Belum ada study plan. Buat study plan terlebih dahulu sebelum membuat task.
```

Tampilkan link ke:

```txt
/dashboard/plans
```

Expected behavior:

```txt
Jika belum ada study plan, tombol create task disabled.
Jika ada study plan, form aktif.
```

---

### 18. Update Study Plan Query Invalidations

Pastikan ketika task dibuat/update/delete, query berikut ikut di-invalidate:

```txt
tasks
study-plans
```

Alasan:

```txt
Study plan progress nanti akan dihitung dari task.
Dashboard dan plan card perlu data task terbaru.
```

---

### 19. Run Checks

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
└── tasks.ts

app/
└── dashboard/
    └── tasks/
        └── page.tsx

features/
└── tasks/
    ├── components/
    │   ├── task-card.tsx
    │   ├── task-create-form.tsx
    │   ├── task-delete-dialog.tsx
    │   ├── task-empty-state.tsx
    │   ├── task-list.tsx
    │   ├── task-status-button.tsx
    │   └── task-update-form.tsx
    ├── hooks/
    │   ├── use-create-task-mutation.ts
    │   ├── use-delete-task-mutation.ts
    │   ├── use-tasks-query.ts
    │   ├── use-update-task-mutation.ts
    │   └── use-update-task-status-mutation.ts
    └── schemas/
        └── task-schema.ts

types/
└── task.ts
```

## Acceptance Criteria

- Halaman `/dashboard/tasks` tersedia.
- Halaman hanya bisa diakses user yang sudah login.
- Task list menampilkan data milik user login.
- User tidak bisa melihat task milik user lain.
- User bisa membuat task baru.
- User bisa memilih study plan saat membuat task.
- User bisa mengedit task.
- User bisa menghapus task.
- User bisa mengubah status task.
- User bisa mengubah priority task.
- Jika status task menjadi `DONE`, `completedAt` otomatis terisi.
- Jika status task bukan `DONE`, `completedAt` menjadi `null`.
- Form create menggunakan React Hook Form.
- Form update menggunakan React Hook Form.
- Validasi input menggunakan Zod.
- Data fetching menggunakan TanStack Query.
- Mutation create menggunakan TanStack Query.
- Mutation update menggunakan TanStack Query.
- Mutation update status menggunakan TanStack Query.
- Mutation delete menggunakan TanStack Query.
- Query task di-invalidate setelah create/update/status/delete berhasil.
- Query study plan ikut di-invalidate setelah create/update/status/delete task berhasil.
- Server Actions berada di folder root `actions/`.
- Semua Server Actions memvalidasi session user.
- Semua query database memfilter berdasarkan `userId`.
- Study plan yang dipilih wajib milik user login.
- Empty state tampil jika task kosong.
- Loading state tampil saat data sedang dimuat.
- Error state tampil jika gagal mengambil data.
- Jika belum ada study plan, form create menampilkan instruksi membuat study plan dulu.
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
http://localhost:3000/dashboard/tasks
```

Expected:

```txt
Halaman Task Management tampil.
```

---

### 2. Test Protected Access

Logout, lalu buka:

```txt
http://localhost:3000/dashboard/tasks
```

Expected:

```txt
User diarahkan ke /login.
```

---

### 3. Test No Study Plan State

Gunakan user baru tanpa study plan.

Expected:

```txt
Form create task disabled atau menampilkan pesan untuk membuat study plan dulu.
Link ke /dashboard/plans tersedia.
```

---

### 4. Test Create Task

Pastikan user sudah punya study plan.

Input:

```txt
Study Plan: Belajar Next.js Fullstack
Title: Setup Drizzle Schema
Description: Membuat schema database StudyFlow
Status: TODO
Priority: HIGH
Due Date: 2026-07-03
Position: 1
```

Expected:

```txt
Task berhasil dibuat.
Task muncul di list.
Study plan title tampil di card.
Subject name tampil di card.
Form reset.
Database memiliki row task baru dengan user_id sesuai user login.
```

---

### 5. Test Update Task

Edit title, status, priority, atau due date.

Expected:

```txt
Data berhasil berubah.
List ter-update.
updated_at berubah.
```

---

### 6. Test Update Task Status

Ubah status:

```txt
TODO → IN_PROGRESS
IN_PROGRESS → DONE
DONE → TODO
```

Expected:

```txt
Status berubah.
Badge status berubah.
Jika DONE, completed_at terisi.
Jika TODO atau IN_PROGRESS, completed_at null.
```

---

### 7. Test Delete Task

Klik delete dan confirm.

Expected:

```txt
Task berhasil dihapus.
Task hilang dari list.
Query task di-invalidate.
```

---

### 8. Test User Isolation

Login sebagai user A dan buat task.

Login sebagai user B.

Expected:

```txt
User B tidak bisa melihat task milik user A.
User B tidak bisa update/delete task milik user A.
User B tidak bisa memakai study plan milik user A untuk membuat task.
```

---

### 9. Test Status Badge

Buat atau edit task dengan status berbeda:

```txt
TODO
IN_PROGRESS
DONE
```

Expected:

```txt
Badge status tampil sesuai status.
```

---

### 10. Test Priority Badge

Buat atau edit task dengan priority berbeda:

```txt
LOW
MEDIUM
HIGH
URGENT
```

Expected:

```txt
Badge priority tampil sesuai priority.
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

- Jangan membuat study session di issue ini.
- Jangan membuat analytics di issue ini.
- Jangan membuat Kanban board dulu.
- Jangan membuat drag and drop task ordering dulu.
- Jangan membuat API route.
- Semua logic database harus berada di Server Actions.
- Semua action yang mengubah data harus validasi input dengan Zod.
- Semua action wajib cek session user.
- TanStack Query digunakan untuk query dan mutation di sisi client.
- Jika UI terlalu kompleks, gunakan native select dulu untuk status, priority, dan study plan.
- Radix Dialog bisa digunakan untuk edit dan delete modal.
- Pastikan tidak ada data user lain yang bisa diakses.

## Suggested Commit Message

```bash
feat: build task management
```
