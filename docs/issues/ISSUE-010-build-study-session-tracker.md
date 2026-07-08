# ISSUE-010 — Build Study Session Tracker

## Status

Planned

## Priority

High

## Type

Feature / Dashboard CRUD

## Summary

Membangun fitur Study Session Tracker untuk StudyFlow. Study Session adalah catatan aktivitas belajar user, misalnya user belajar Next.js selama 90 menit, mencatat mood, catatan, waktu mulai, dan waktu selesai.

Contoh study session:

```txt
Subject: Next.js
Study Plan: Belajar Next.js Fullstack
Task: Setup Drizzle Schema
Duration: 90 minutes
Mood: Focused
Note: Hari ini belajar schema, relation, dan migration.
```

Issue ini melanjutkan fitur Task Management. Setelah user memiliki subject, study plan, dan task, user bisa mencatat sesi belajar untuk memantau waktu belajar dan produktivitas.

## Background

Flow utama StudyFlow:

```txt
User → Subject → Study Plan → Task → Study Session → Analytics
```

Pada issue sebelumnya, user sudah bisa membuat task. Pada issue ini, user mulai bisa mencatat study session.

Study session akan menjadi dasar untuk analytics seperti:

```txt
Total study hours
Weekly study hours
Study hours by subject
Study hours by plan
Most studied subject
Daily learning activity
```

Route utama:

```txt
/dashboard/sessions
```

## Goals

- Membuat halaman Study Session Tracker.
- Menampilkan daftar study session milik user login.
- Membuat study session baru.
- Mengedit study session.
- Menghapus study session.
- Menghubungkan session dengan subject.
- Menghubungkan session dengan study plan secara optional.
- Menghubungkan session dengan task secara optional.
- Menampilkan duration dalam format menit/jam.
- Menampilkan mood badge.
- Menampilkan started at dan ended at.
- Menampilkan note.
- Menampilkan empty state jika belum ada session.
- Menampilkan loading state.
- Menampilkan error state.
- Validasi input menggunakan Zod.
- Form menggunakan React Hook Form.
- Data fetching menggunakan TanStack Query.
- Mutation create/update/delete menggunakan TanStack Query.
- Semua operasi database menggunakan Server Actions di folder root `actions/`.
- Semua action wajib memvalidasi session user.
- User hanya boleh mengakses study session miliknya sendiri.

## Non-Goals

- Tidak membuat Analytics Dashboard.
- Tidak membuat Pomodoro Timer.
- Tidak membuat live timer.
- Tidak membuat calendar view.
- Tidak membuat reminder notification.
- Tidak membuat AI note summary.
- Tidak membuat export report.
- Tidak membuat API route.
- Tidak mengubah schema database.
- Tidak menambahkan shadcn/ui.
- Tidak membuat admin session management.

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
/dashboard/sessions
```

## Database Table

Gunakan tabel yang sudah ada:

```txt
study_sessions
subjects
study_plans
study_tasks
```

Field utama `study_sessions`:

```txt
id
user_id
subject_id
study_plan_id
task_id
duration_minutes
note
mood
started_at
ended_at
created_at
updated_at
```

Enum yang digunakan:

```txt
mood:
FOCUSED
NORMAL
TIRED
DISTRACTED
```

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
actions/
└── study-sessions.ts

app/
└── dashboard/
    └── sessions/
        └── page.tsx

features/
└── study-sessions/
    ├── components/
    │   ├── study-session-card.tsx
    │   ├── study-session-create-form.tsx
    │   ├── study-session-delete-dialog.tsx
    │   ├── study-session-empty-state.tsx
    │   ├── study-session-list.tsx
    │   └── study-session-update-form.tsx
    ├── hooks/
    │   ├── use-create-study-session-mutation.ts
    │   ├── use-delete-study-session-mutation.ts
    │   ├── use-study-sessions-query.ts
    │   └── use-update-study-session-mutation.ts
    ├── schemas/
    │   └── study-session-schema.ts
    └── utils/
        └── session-format.ts

types/
└── study-session.ts
```

## Implementation Steps

### 1. Create Study Session Types

Buat file:

```txt
types/study-session.ts
```

Isi:

```ts
export type StudySessionMood = "FOCUSED" | "NORMAL" | "TIRED" | "DISTRACTED";

export type StudySessionItem = {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  studyPlanId: string | null;
  studyPlanTitle: string | null;
  taskId: string | null;
  taskTitle: string | null;
  durationMinutes: number;
  note: string | null;
  mood: StudySessionMood;
  startedAt: Date;
  endedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
```

---

### 2. Create Study Session Validation Schema

Buat file:

```txt
features/study-sessions/schemas/study-session-schema.ts
```

Isi:

```ts
import { z } from "zod";

export const studySessionMoodSchema = z.enum(["FOCUSED", "NORMAL", "TIRED", "DISTRACTED"]);

export const studySessionSchema = z.object({
  subjectId: z.string().uuid("Subject tidak valid"),
  studyPlanId: z.string().uuid("Study plan tidak valid").optional().or(z.literal("")),
  taskId: z.string().uuid("Task tidak valid").optional().or(z.literal("")),
  durationMinutes: z.coerce
    .number()
    .int("Durasi harus berupa angka bulat")
    .min(1, "Durasi minimal 1 menit")
    .max(1440, "Durasi maksimal 1440 menit"),
  note: z.string().max(1000, "Catatan maksimal 1000 karakter").optional().or(z.literal("")),
  mood: studySessionMoodSchema.default("NORMAL"),
  startedAt: z.string().min(1, "Waktu mulai wajib diisi"),
  endedAt: z.string().optional().or(z.literal("")),
});

export const updateStudySessionSchema = studySessionSchema.extend({
  id: z.string().uuid("ID study session tidak valid"),
});

export const deleteStudySessionSchema = z.object({
  id: z.string().uuid("ID study session tidak valid"),
});

export type StudySessionInput = z.infer<typeof studySessionSchema>;
export type UpdateStudySessionInput = z.infer<typeof updateStudySessionSchema>;
export type DeleteStudySessionInput = z.infer<typeof deleteStudySessionSchema>;
```

Catatan:

- `studyPlanId` optional karena user bisa mencatat belajar berdasarkan subject saja.
- `taskId` optional karena tidak semua sesi belajar harus terkait dengan task.
- `endedAt` optional karena durasi sudah disimpan di `durationMinutes`.

---

### 3. Create Study Session Format Utilities

Buat file:

```txt
features/study-sessions/utils/session-format.ts
```

Isi:

```ts
export function formatDuration(minutes: number) {
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

export function formatSessionDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
```

---

### 4. Create Study Session Actions

Buat file:

```txt
actions/study-sessions.ts
```

Isi:

```ts
"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, studySessions, studyTasks, subjects } from "@/db/schema";
import {
  deleteStudySessionSchema,
  studySessionSchema,
  updateStudySessionSchema,
  type DeleteStudySessionInput,
  type StudySessionInput,
  type UpdateStudySessionInput,
} from "@/features/study-sessions/schemas/study-session-schema";
import type { ActionResponse } from "@/types/action-response";
import type { StudySessionItem } from "@/types/study-session";

function normalizeText(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value.trim();
}

function normalizeOptionalId(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value;
}

function normalizeOptionalDate(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return new Date(value);
}

async function requireAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

async function ensureSubjectBelongsToUser(subjectId: string, userId: string) {
  const [subject] = await db
    .select({
      id: subjects.id,
    })
    .from(subjects)
    .where(and(eq(subjects.id, subjectId), eq(subjects.userId, userId)))
    .limit(1);

  return subject;
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

async function ensureTaskBelongsToUser(taskId: string, userId: string) {
  const [task] = await db
    .select({
      id: studyTasks.id,
    })
    .from(studyTasks)
    .where(and(eq(studyTasks.id, taskId), eq(studyTasks.userId, userId)))
    .limit(1);

  return task;
}

async function validateOptionalRelations(input: StudySessionInput, userId: string) {
  const subject = await ensureSubjectBelongsToUser(input.subjectId, userId);

  if (!subject) {
    return "Subject tidak ditemukan.";
  }

  if (input.studyPlanId) {
    const plan = await ensureStudyPlanBelongsToUser(input.studyPlanId, userId);

    if (!plan) {
      return "Study plan tidak ditemukan.";
    }
  }

  if (input.taskId) {
    const task = await ensureTaskBelongsToUser(input.taskId, userId);

    if (!task) {
      return "Task tidak ditemukan.";
    }
  }

  return null;
}

export async function getStudySessionsAction(): Promise<ActionResponse<StudySessionItem[]>> {
  try {
    const user = await requireAuthUser();

    const data = await db
      .select({
        id: studySessions.id,
        subjectId: studySessions.subjectId,
        subjectName: subjects.name,
        subjectColor: subjects.color,
        studyPlanId: studySessions.studyPlanId,
        studyPlanTitle: studyPlans.title,
        taskId: studySessions.taskId,
        taskTitle: studyTasks.title,
        durationMinutes: studySessions.durationMinutes,
        note: studySessions.note,
        mood: studySessions.mood,
        startedAt: studySessions.startedAt,
        endedAt: studySessions.endedAt,
        createdAt: studySessions.createdAt,
        updatedAt: studySessions.updatedAt,
      })
      .from(studySessions)
      .innerJoin(subjects, eq(studySessions.subjectId, subjects.id))
      .leftJoin(studyPlans, eq(studySessions.studyPlanId, studyPlans.id))
      .leftJoin(studyTasks, eq(studySessions.taskId, studyTasks.id))
      .where(eq(studySessions.userId, user.id))
      .orderBy(desc(studySessions.startedAt));

    return {
      success: true,
      message: "Study session berhasil diambil.",
      data,
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data study session.",
      data: [],
    };
  }
}

export async function createStudySessionAction(
  input: StudySessionInput
): Promise<ActionResponse<{ id: string }>> {
  const parsed = studySessionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const relationError = await validateOptionalRelations(parsed.data, user.id);

    if (relationError) {
      return {
        success: false,
        message: relationError,
      };
    }

    const [newSession] = await db
      .insert(studySessions)
      .values({
        userId: user.id,
        subjectId: parsed.data.subjectId,
        studyPlanId: normalizeOptionalId(parsed.data.studyPlanId),
        taskId: normalizeOptionalId(parsed.data.taskId),
        durationMinutes: parsed.data.durationMinutes,
        note: normalizeText(parsed.data.note),
        mood: parsed.data.mood,
        startedAt: new Date(parsed.data.startedAt),
        endedAt: normalizeOptionalDate(parsed.data.endedAt),
      })
      .returning({
        id: studySessions.id,
      });

    revalidatePath("/dashboard/sessions");
    revalidatePath("/dashboard/analytics");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Study session berhasil dibuat.",
      data: {
        id: newSession.id,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal membuat study session.",
    };
  }
}

export async function updateStudySessionAction(
  input: UpdateStudySessionInput
): Promise<ActionResponse> {
  const parsed = updateStudySessionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingSession] = await db
      .select({
        id: studySessions.id,
      })
      .from(studySessions)
      .where(and(eq(studySessions.id, parsed.data.id), eq(studySessions.userId, user.id)))
      .limit(1);

    if (!existingSession) {
      return {
        success: false,
        message: "Study session tidak ditemukan.",
      };
    }

    const relationError = await validateOptionalRelations(parsed.data, user.id);

    if (relationError) {
      return {
        success: false,
        message: relationError,
      };
    }

    await db
      .update(studySessions)
      .set({
        subjectId: parsed.data.subjectId,
        studyPlanId: normalizeOptionalId(parsed.data.studyPlanId),
        taskId: normalizeOptionalId(parsed.data.taskId),
        durationMinutes: parsed.data.durationMinutes,
        note: normalizeText(parsed.data.note),
        mood: parsed.data.mood,
        startedAt: new Date(parsed.data.startedAt),
        endedAt: normalizeOptionalDate(parsed.data.endedAt),
        updatedAt: new Date(),
      })
      .where(and(eq(studySessions.id, parsed.data.id), eq(studySessions.userId, user.id)));

    revalidatePath("/dashboard/sessions");
    revalidatePath("/dashboard/analytics");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Study session berhasil diperbarui.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui study session.",
    };
  }
}

export async function deleteStudySessionAction(
  input: DeleteStudySessionInput
): Promise<ActionResponse> {
  const parsed = deleteStudySessionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingSession] = await db
      .select({
        id: studySessions.id,
      })
      .from(studySessions)
      .where(and(eq(studySessions.id, parsed.data.id), eq(studySessions.userId, user.id)))
      .limit(1);

    if (!existingSession) {
      return {
        success: false,
        message: "Study session tidak ditemukan.",
      };
    }

    await db
      .delete(studySessions)
      .where(and(eq(studySessions.id, parsed.data.id), eq(studySessions.userId, user.id)));

    revalidatePath("/dashboard/sessions");
    revalidatePath("/dashboard/analytics");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Study session berhasil dihapus.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal menghapus study session.",
    };
  }
}
```

---

### 5. Create Study Sessions Query Hook

Buat file:

```txt
features/study-sessions/hooks/use-study-sessions-query.ts
```

Isi:

```ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudySessionsAction } from "@/actions/study-sessions";

export const studySessionsQueryKey = ["study-sessions"];

export function useStudySessionsQuery() {
  return useQuery({
    queryKey: studySessionsQueryKey,
    queryFn: async () => {
      const result = await getStudySessionsAction();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data ?? [];
    },
  });
}
```

---

### 6. Create Create Study Session Mutation Hook

Buat file:

```txt
features/study-sessions/hooks/use-create-study-session-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createStudySessionAction } from "@/actions/study-sessions";
import type { StudySessionInput } from "@/features/study-sessions/schemas/study-session-schema";
import { studySessionsQueryKey } from "@/features/study-sessions/hooks/use-study-sessions-query";

export function useCreateStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StudySessionInput) => createStudySessionAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: studySessionsQueryKey,
        });
      }
    },
  });
}
```

---

### 7. Create Update Study Session Mutation Hook

Buat file:

```txt
features/study-sessions/hooks/use-update-study-session-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateStudySessionAction } from "@/actions/study-sessions";
import type { UpdateStudySessionInput } from "@/features/study-sessions/schemas/study-session-schema";
import { studySessionsQueryKey } from "@/features/study-sessions/hooks/use-study-sessions-query";

export function useUpdateStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStudySessionInput) => updateStudySessionAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: studySessionsQueryKey,
        });
      }
    },
  });
}
```

---

### 8. Create Delete Study Session Mutation Hook

Buat file:

```txt
features/study-sessions/hooks/use-delete-study-session-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteStudySessionAction } from "@/actions/study-sessions";
import type { DeleteStudySessionInput } from "@/features/study-sessions/schemas/study-session-schema";
import { studySessionsQueryKey } from "@/features/study-sessions/hooks/use-study-sessions-query";

export function useDeleteStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteStudySessionInput) => deleteStudySessionAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: studySessionsQueryKey,
        });
      }
    },
  });
}
```

---

### 9. Create Study Session Empty State

Buat file:

```txt
features/study-sessions/components/study-session-empty-state.tsx
```

Isi:

```tsx
import { Timer } from "lucide-react";

import { Card } from "@/components/ui/card";

export function StudySessionEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <Timer className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-slate-950">
        Belum ada study session
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Catat sesi belajar pertama untuk mulai melihat total jam belajar dan produktivitas kamu.
      </p>
    </Card>
  );
}
```

---

### 10. Create Study Session Create Form

Buat file:

```txt
features/study-sessions/components/study-session-create-form.tsx
```

Requirements:

- Client component.
- Menggunakan React Hook Form.
- Menggunakan `studySessionSchema`.
- Menggunakan `useCreateStudySessionMutation`.
- Menggunakan `useSubjectsQuery` untuk pilihan subject.
- Menggunakan `useStudyPlansQuery` untuk pilihan study plan.
- Menggunakan `useTasksQuery` untuk pilihan task.
- Jika belum ada subject, tampilkan pesan agar user membuat subject dulu.
- Submit berhasil membuat study session dan reset form.

Field:

```txt
subjectId
studyPlanId
taskId
durationMinutes
note
mood
startedAt
endedAt
```

Catatan:

- Untuk select sederhana, boleh gunakan native `<select>` terlebih dahulu.
- `studyPlanId` dan `taskId` optional.
- `startedAt` bisa pakai input `datetime-local`.
- `endedAt` bisa pakai input `datetime-local`.
- Default `startedAt` bisa menggunakan waktu saat ini.
- Jika belum ada subject, tombol create session disabled.

---

### 11. Create Study Session Card

Buat file:

```txt
features/study-sessions/components/study-session-card.tsx
```

Requirements:

- Menampilkan subject name dan warna subject.
- Menampilkan study plan title jika ada.
- Menampilkan task title jika ada.
- Menampilkan duration.
- Menampilkan mood badge.
- Menampilkan started at.
- Menampilkan ended at jika ada.
- Menampilkan note jika ada.
- Menampilkan edit button.
- Menampilkan delete button.

Visual card:

```txt
[Subject Color] Next.js
Duration: 1h 30m
Mood: Focused

Study Plan: Belajar Next.js Fullstack
Task: Setup Drizzle Schema
Started: 1 Jul 2026, 09.00
Ended: 1 Jul 2026, 10.30
```

Badge variant mapping:

```txt
FOCUSED = success
NORMAL = info
TIRED = warning
DISTRACTED = danger
```

---

### 12. Create Study Session Update Form

Buat file:

```txt
features/study-sessions/components/study-session-update-form.tsx
```

Requirements:

- Bisa ditampilkan dalam Radix Dialog.
- Menggunakan React Hook Form.
- Default values berasal dari study session.
- Menggunakan `updateStudySessionSchema`.
- Menggunakan `useUpdateStudySessionMutation`.
- Menggunakan `useSubjectsQuery`, `useStudyPlansQuery`, dan `useTasksQuery`.
- Setelah berhasil update, tutup dialog.

Field:

```txt
subjectId
studyPlanId
taskId
durationMinutes
note
mood
startedAt
endedAt
```

---

### 13. Create Study Session Delete Dialog

Buat file:

```txt
features/study-sessions/components/study-session-delete-dialog.tsx
```

Requirements:

- Menggunakan Radix Dialog.
- Menampilkan ringkasan study session.
- Menampilkan warning bahwa delete tidak bisa dibatalkan.
- Menggunakan `useDeleteStudySessionMutation`.
- Setelah berhasil delete, tutup dialog.

Warning copy:

```txt
Menghapus study session akan menghapus catatan sesi belajar ini secara permanen. Tindakan ini tidak bisa dibatalkan.
```

---

### 14. Create Study Session List Component

Buat file:

```txt
features/study-sessions/components/study-session-list.tsx
```

Isi:

```tsx
"use client";

import { StudySessionCard } from "@/features/study-sessions/components/study-session-card";
import { StudySessionEmptyState } from "@/features/study-sessions/components/study-session-empty-state";
import { useStudySessionsQuery } from "@/features/study-sessions/hooks/use-study-sessions-query";
import { Card } from "@/components/ui/card";

export function StudySessionList() {
  const query = useStudySessionsQuery();

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
        <h3 className="text-lg font-semibold text-slate-950">Gagal memuat study session</h3>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
  }

  const sessions = query.data ?? [];

  if (sessions.length === 0) {
    return <StudySessionEmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sessions.map((session) => (
        <StudySessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}
```

---

### 15. Update Sessions Page

Edit file:

```txt
app/dashboard/sessions/page.tsx
```

Isi:

```tsx
import { StudySessionCreateForm } from "@/features/study-sessions/components/study-session-create-form";
import { StudySessionList } from "@/features/study-sessions/components/study-session-list";

export default function SessionsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <StudySessionCreateForm />

      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Study Sessions</h1>
          <p className="mt-2 text-sm text-slate-500">
            Catat durasi belajar, mood, catatan, dan aktivitas belajar harian kamu.
          </p>
        </div>

        <StudySessionList />
      </div>
    </div>
  );
}
```

---

### 16. Handle No Subject State

Karena study session wajib punya subject, form create harus menangani kondisi subject kosong.

Jika `useSubjectsQuery()` menghasilkan array kosong:

```txt
Belum ada subject. Buat subject terlebih dahulu sebelum mencatat study session.
```

Tampilkan link ke:

```txt
/dashboard/subjects
```

Expected behavior:

```txt
Jika belum ada subject, tombol create study session disabled.
Jika ada subject, form aktif.
```

---

### 17. Optional Relation Filtering

Untuk MVP, dropdown study plan dan task boleh menampilkan semua data milik user.

Namun idealnya:

```txt
Saat subject dipilih, study plan difilter berdasarkan subject.
Saat study plan dipilih, task difilter berdasarkan study plan.
```

Acceptance minimal:

```txt
User hanya bisa memilih subject, study plan, dan task miliknya sendiri.
```

---

### 18. Run Checks

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
└── study-sessions.ts

app/
└── dashboard/
    └── sessions/
        └── page.tsx

features/
└── study-sessions/
    ├── components/
    │   ├── study-session-card.tsx
    │   ├── study-session-create-form.tsx
    │   ├── study-session-delete-dialog.tsx
    │   ├── study-session-empty-state.tsx
    │   ├── study-session-list.tsx
    │   └── study-session-update-form.tsx
    ├── hooks/
    │   ├── use-create-study-session-mutation.ts
    │   ├── use-delete-study-session-mutation.ts
    │   ├── use-study-sessions-query.ts
    │   └── use-update-study-session-mutation.ts
    ├── schemas/
    │   └── study-session-schema.ts
    └── utils/
        └── session-format.ts

types/
└── study-session.ts
```

## Acceptance Criteria

- Halaman `/dashboard/sessions` tersedia.
- Halaman hanya bisa diakses user yang sudah login.
- Study session list menampilkan data milik user login.
- User tidak bisa melihat study session milik user lain.
- User bisa membuat study session baru.
- User bisa memilih subject saat membuat study session.
- User bisa memilih study plan secara optional.
- User bisa memilih task secara optional.
- User bisa mengedit study session.
- User bisa menghapus study session.
- Duration tampil dalam format mudah dibaca.
- Mood tampil sebagai badge.
- Started at tampil.
- Ended at tampil jika tersedia.
- Note tampil jika tersedia.
- Form create menggunakan React Hook Form.
- Form update menggunakan React Hook Form.
- Validasi input menggunakan Zod.
- Data fetching menggunakan TanStack Query.
- Mutation create menggunakan TanStack Query.
- Mutation update menggunakan TanStack Query.
- Mutation delete menggunakan TanStack Query.
- Query study session di-invalidate setelah create/update/delete berhasil.
- Server Actions berada di folder root `actions/`.
- Semua Server Actions memvalidasi session user.
- Semua query database memfilter berdasarkan `userId`.
- Subject yang dipilih wajib milik user login.
- Study plan yang dipilih wajib milik user login.
- Task yang dipilih wajib milik user login.
- Empty state tampil jika study session kosong.
- Loading state tampil saat data sedang dimuat.
- Error state tampil jika gagal mengambil data.
- Jika belum ada subject, form create menampilkan instruksi membuat subject dulu.
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
http://localhost:3000/dashboard/sessions
```

Expected:

```txt
Halaman Study Session Tracker tampil.
```

---

### 2. Test Protected Access

Logout, lalu buka:

```txt
http://localhost:3000/dashboard/sessions
```

Expected:

```txt
User diarahkan ke /login.
```

---

### 3. Test No Subject State

Gunakan user baru tanpa subject.

Expected:

```txt
Form create study session disabled atau menampilkan pesan untuk membuat subject dulu.
Link ke /dashboard/subjects tersedia.
```

---

### 4. Test Create Study Session

Pastikan user sudah punya subject.

Input:

```txt
Subject: Next.js
Study Plan: Belajar Next.js Fullstack
Task: Setup Drizzle Schema
Duration: 90
Mood: FOCUSED
Started At: 2026-07-01 09:00
Ended At: 2026-07-01 10:30
Note: Belajar schema dan migration.
```

Expected:

```txt
Study session berhasil dibuat.
Study session muncul di list.
Subject name tampil di card.
Study plan title tampil jika dipilih.
Task title tampil jika dipilih.
Database memiliki row study session baru dengan user_id sesuai user login.
```

---

### 5. Test Create Session Without Study Plan and Task

Input hanya:

```txt
Subject: English
Duration: 45
Mood: NORMAL
Started At: 2026-07-01 20:00
```

Expected:

```txt
Study session tetap berhasil dibuat.
Study plan dan task tampil kosong atau optional.
```

---

### 6. Test Update Study Session

Edit duration, mood, note, atau relation.

Expected:

```txt
Data berhasil berubah.
List ter-update.
updated_at berubah.
```

---

### 7. Test Delete Study Session

Klik delete dan confirm.

Expected:

```txt
Study session berhasil dihapus.
Study session hilang dari list.
Query study session di-invalidate.
```

---

### 8. Test User Isolation

Login sebagai user A dan buat study session.

Login sebagai user B.

Expected:

```txt
User B tidak bisa melihat study session milik user A.
User B tidak bisa update/delete study session milik user A.
User B tidak bisa memakai subject, study plan, atau task milik user A.
```

---

### 9. Test Mood Badge

Buat atau edit session dengan mood berbeda:

```txt
FOCUSED
NORMAL
TIRED
DISTRACTED
```

Expected:

```txt
Badge mood tampil sesuai mood.
```

---

### 10. Test Duration Format

Input duration:

```txt
30
60
90
125
```

Expected:

```txt
30m
1h
1h 30m
2h 5m
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

- Jangan membuat analytics dashboard di issue ini.
- Jangan membuat live timer dulu.
- Jangan membuat Pomodoro dulu.
- Jangan membuat AI summary dulu.
- Jangan membuat API route.
- Semua logic database harus berada di Server Actions.
- Semua action yang mengubah data harus validasi input dengan Zod.
- Semua action wajib cek session user.
- TanStack Query digunakan untuk query dan mutation di sisi client.
- Jika UI terlalu kompleks, gunakan native select dulu untuk subject, study plan, task, dan mood.
- Radix Dialog bisa digunakan untuk edit dan delete modal.
- Pastikan tidak ada data user lain yang bisa diakses.
- Data study session akan dipakai untuk analytics di issue berikutnya.

## Suggested Commit Message

```bash
feat: build study session tracker
```
