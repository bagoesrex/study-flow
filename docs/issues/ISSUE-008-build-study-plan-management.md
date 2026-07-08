# ISSUE-008 — Build Study Plan Management

## Status

Planned

## Priority

High

## Type

Feature / Dashboard CRUD

## Summary

Membangun fitur Study Plan Management untuk StudyFlow. Study Plan adalah rencana belajar utama yang dibuat oleh user berdasarkan subject tertentu.

Contoh study plan:

```txt
Belajar Next.js Fullstack
Belajar Laravel Booking App
Mengerjakan Skripsi BAB II
Belajar TOEFL 30 Hari
```

Issue ini melanjutkan fitur Subject Management. Study Plan akan menggunakan data subject yang sudah dibuat user, sehingga user bisa memilih subject saat membuat rencana belajar.

## Background

Flow utama StudyFlow:

```txt
User → Subject → Study Plan → Task → Study Session → Analytics
```

Pada issue sebelumnya, user sudah bisa membuat subject. Pada issue ini, user mulai bisa membuat rencana belajar berdasarkan subject tersebut.

Study Plan akan menjadi parent untuk task dan study session di issue berikutnya.

Route utama:

```txt
/dashboard/plans
```

## Goals

- Membuat halaman Study Plan Management.
- Menampilkan daftar study plan milik user login.
- Membuat study plan baru.
- Mengedit study plan.
- Menghapus study plan.
- Mengubah status study plan.
- Menghubungkan study plan dengan subject.
- Menampilkan subject name pada study plan card.
- Menampilkan priority.
- Menampilkan status.
- Menampilkan start date dan end date.
- Menampilkan estimated hours.
- Menampilkan empty state jika belum ada study plan.
- Menampilkan loading state.
- Menampilkan error state.
- Validasi input menggunakan Zod.
- Form menggunakan React Hook Form.
- Data fetching menggunakan TanStack Query.
- Mutation create/update/delete menggunakan TanStack Query.
- Semua operasi database menggunakan Server Actions di folder root `actions/`.
- Semua action wajib memvalidasi session user.
- User hanya boleh mengakses study plan miliknya sendiri.

## Non-Goals

- Tidak membuat Task Management.
- Tidak membuat Study Session Tracker.
- Tidak membuat Analytics Dashboard.
- Tidak menghitung progress berdasarkan task secara real.
- Tidak membuat calendar view.
- Tidak membuat drag and drop.
- Tidak membuat AI study plan generator.
- Tidak membuat API route.
- Tidak mengubah schema database.
- Tidak menambahkan shadcn/ui.
- Tidak membuat admin management.

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
/dashboard/plans
```

## Database Table

Gunakan tabel yang sudah ada:

```txt
study_plans
subjects
```

Field utama `study_plans`:

```txt
id
user_id
subject_id
title
description
goal
start_date
end_date
status
priority
estimated_hours
created_at
updated_at
```

Enum yang digunakan:

```txt
study_plan_status:
NOT_STARTED
IN_PROGRESS
COMPLETED
PAUSED
CANCELLED

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
└── study-plans.ts

app/
└── dashboard/
    └── plans/
        └── page.tsx

features/
└── study-plans/
    ├── components/
    │   ├── study-plan-card.tsx
    │   ├── study-plan-create-form.tsx
    │   ├── study-plan-delete-dialog.tsx
    │   ├── study-plan-empty-state.tsx
    │   ├── study-plan-list.tsx
    │   └── study-plan-update-form.tsx
    ├── hooks/
    │   ├── use-create-study-plan-mutation.ts
    │   ├── use-delete-study-plan-mutation.ts
    │   ├── use-study-plans-query.ts
    │   └── use-update-study-plan-mutation.ts
    └── schemas/
        └── study-plan-schema.ts

types/
└── study-plan.ts
```

## Implementation Steps

### 1. Create Study Plan Types

Buat file:

```txt
types/study-plan.ts
```

Isi:

```ts
export type StudyPlanStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED" | "CANCELLED";

export type StudyPlanPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

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
  createdAt: Date;
  updatedAt: Date;
};
```

---

### 2. Create Study Plan Validation Schema

Buat file:

```txt
features/study-plans/schemas/study-plan-schema.ts
```

Isi:

```ts
import { z } from "zod";

export const studyPlanStatusSchema = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "PAUSED",
  "CANCELLED",
]);

export const studyPlanPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const studyPlanSchema = z.object({
  subjectId: z.string().uuid("Subject tidak valid"),
  title: z
    .string()
    .min(3, "Judul study plan minimal 3 karakter")
    .max(180, "Judul study plan maksimal 180 karakter"),
  description: z.string().max(700, "Deskripsi maksimal 700 karakter").optional().or(z.literal("")),
  goal: z.string().max(700, "Goal maksimal 700 karakter").optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  status: studyPlanStatusSchema.default("NOT_STARTED"),
  priority: studyPlanPrioritySchema.default("MEDIUM"),
  estimatedHours: z.coerce
    .number()
    .int("Estimasi jam harus angka bulat")
    .min(1, "Estimasi jam minimal 1")
    .max(1000, "Estimasi jam maksimal 1000")
    .optional()
    .or(z.literal("")),
});

export const updateStudyPlanSchema = studyPlanSchema.extend({
  id: z.string().uuid("ID study plan tidak valid"),
});

export const deleteStudyPlanSchema = z.object({
  id: z.string().uuid("ID study plan tidak valid"),
});

export type StudyPlanInput = z.infer<typeof studyPlanSchema>;
export type UpdateStudyPlanInput = z.infer<typeof updateStudyPlanSchema>;
export type DeleteStudyPlanInput = z.infer<typeof deleteStudyPlanSchema>;
```

---

### 3. Create Study Plan Actions

Buat file:

```txt
actions/study-plans.ts
```

Isi:

```ts
"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import { studyPlans, subjects } from "@/db/schema";
import {
  deleteStudyPlanSchema,
  studyPlanSchema,
  updateStudyPlanSchema,
  type DeleteStudyPlanInput,
  type StudyPlanInput,
  type UpdateStudyPlanInput,
} from "@/features/study-plans/schemas/study-plan-schema";
import type { ActionResponse } from "@/types/action-response";
import type { StudyPlanItem } from "@/types/study-plan";

function normalizeText(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value.trim();
}

function normalizeNumber(value: StudyPlanInput["estimatedHours"]) {
  if (value === "" || value === undefined) {
    return null;
  }

  return value;
}

function normalizeDate(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value;
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

export async function getStudyPlansAction(): Promise<ActionResponse<StudyPlanItem[]>> {
  try {
    const user = await requireAuthUser();

    const data = await db
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
        createdAt: studyPlans.createdAt,
        updatedAt: studyPlans.updatedAt,
      })
      .from(studyPlans)
      .innerJoin(subjects, eq(studyPlans.subjectId, subjects.id))
      .where(eq(studyPlans.userId, user.id))
      .orderBy(desc(studyPlans.createdAt));

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

export async function createStudyPlanAction(
  input: StudyPlanInput
): Promise<ActionResponse<{ id: string }>> {
  const parsed = studyPlanSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const subject = await ensureSubjectBelongsToUser(parsed.data.subjectId, user.id);

    if (!subject) {
      return {
        success: false,
        message: "Subject tidak ditemukan.",
      };
    }

    const [newStudyPlan] = await db
      .insert(studyPlans)
      .values({
        userId: user.id,
        subjectId: parsed.data.subjectId,
        title: parsed.data.title.trim(),
        description: normalizeText(parsed.data.description),
        goal: normalizeText(parsed.data.goal),
        startDate: normalizeDate(parsed.data.startDate),
        endDate: normalizeDate(parsed.data.endDate),
        status: parsed.data.status,
        priority: parsed.data.priority,
        estimatedHours: normalizeNumber(parsed.data.estimatedHours),
      })
      .returning({
        id: studyPlans.id,
      });

    revalidatePath("/dashboard/plans");

    return {
      success: true,
      message: "Study plan berhasil dibuat.",
      data: {
        id: newStudyPlan.id,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal membuat study plan.",
    };
  }
}

export async function updateStudyPlanAction(input: UpdateStudyPlanInput): Promise<ActionResponse> {
  const parsed = updateStudyPlanSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingStudyPlan] = await db
      .select({
        id: studyPlans.id,
      })
      .from(studyPlans)
      .where(and(eq(studyPlans.id, parsed.data.id), eq(studyPlans.userId, user.id)))
      .limit(1);

    if (!existingStudyPlan) {
      return {
        success: false,
        message: "Study plan tidak ditemukan.",
      };
    }

    const subject = await ensureSubjectBelongsToUser(parsed.data.subjectId, user.id);

    if (!subject) {
      return {
        success: false,
        message: "Subject tidak ditemukan.",
      };
    }

    await db
      .update(studyPlans)
      .set({
        subjectId: parsed.data.subjectId,
        title: parsed.data.title.trim(),
        description: normalizeText(parsed.data.description),
        goal: normalizeText(parsed.data.goal),
        startDate: normalizeDate(parsed.data.startDate),
        endDate: normalizeDate(parsed.data.endDate),
        status: parsed.data.status,
        priority: parsed.data.priority,
        estimatedHours: normalizeNumber(parsed.data.estimatedHours),
        updatedAt: new Date(),
      })
      .where(and(eq(studyPlans.id, parsed.data.id), eq(studyPlans.userId, user.id)));

    revalidatePath("/dashboard/plans");

    return {
      success: true,
      message: "Study plan berhasil diperbarui.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui study plan.",
    };
  }
}

export async function deleteStudyPlanAction(input: DeleteStudyPlanInput): Promise<ActionResponse> {
  const parsed = deleteStudyPlanSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingStudyPlan] = await db
      .select({
        id: studyPlans.id,
      })
      .from(studyPlans)
      .where(and(eq(studyPlans.id, parsed.data.id), eq(studyPlans.userId, user.id)))
      .limit(1);

    if (!existingStudyPlan) {
      return {
        success: false,
        message: "Study plan tidak ditemukan.",
      };
    }

    await db
      .delete(studyPlans)
      .where(and(eq(studyPlans.id, parsed.data.id), eq(studyPlans.userId, user.id)));

    revalidatePath("/dashboard/plans");

    return {
      success: true,
      message: "Study plan berhasil dihapus.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal menghapus study plan. Pastikan data terkait tidak bermasalah.",
    };
  }
}
```

---

### 4. Create Study Plans Query Hook

Buat file:

```txt
features/study-plans/hooks/use-study-plans-query.ts
```

Isi:

```ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudyPlansAction } from "@/actions/study-plans";

export const studyPlansQueryKey = ["study-plans"];

export function useStudyPlansQuery() {
  return useQuery({
    queryKey: studyPlansQueryKey,
    queryFn: async () => {
      const result = await getStudyPlansAction();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data ?? [];
    },
  });
}
```

---

### 5. Create Create Study Plan Mutation Hook

Buat file:

```txt
features/study-plans/hooks/use-create-study-plan-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createStudyPlanAction } from "@/actions/study-plans";
import type { StudyPlanInput } from "@/features/study-plans/schemas/study-plan-schema";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";

export function useCreateStudyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StudyPlanInput) => createStudyPlanAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: studyPlansQueryKey,
        });
      }
    },
  });
}
```

---

### 6. Create Update Study Plan Mutation Hook

Buat file:

```txt
features/study-plans/hooks/use-update-study-plan-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateStudyPlanAction } from "@/actions/study-plans";
import type { UpdateStudyPlanInput } from "@/features/study-plans/schemas/study-plan-schema";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";

export function useUpdateStudyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStudyPlanInput) => updateStudyPlanAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: studyPlansQueryKey,
        });
      }
    },
  });
}
```

---

### 7. Create Delete Study Plan Mutation Hook

Buat file:

```txt
features/study-plans/hooks/use-delete-study-plan-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteStudyPlanAction } from "@/actions/study-plans";
import type { DeleteStudyPlanInput } from "@/features/study-plans/schemas/study-plan-schema";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";

export function useDeleteStudyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteStudyPlanInput) => deleteStudyPlanAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: studyPlansQueryKey,
        });
      }
    },
  });
}
```

---

### 8. Create Study Plan Empty State

Buat file:

```txt
features/study-plans/components/study-plan-empty-state.tsx
```

Isi:

```tsx
import { CalendarDays } from "lucide-react";

import { Card } from "@/components/ui/card";

export function StudyPlanEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <CalendarDays className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-slate-950">Belum ada study plan</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Buat study plan pertama untuk mengatur target belajar, deadline, dan progres kamu.
      </p>
    </Card>
  );
}
```

---

### 9. Create Study Plan Create Form

Buat file:

```txt
features/study-plans/components/study-plan-create-form.tsx
```

Requirements:

- Client component.
- Menggunakan React Hook Form.
- Menggunakan `studyPlanSchema`.
- Menggunakan `useCreateStudyPlanMutation`.
- Menggunakan `useSubjectsQuery` untuk pilihan subject.
- Jika belum ada subject, tampilkan pesan agar user membuat subject dulu.
- Submit berhasil membuat study plan dan reset form.

Field:

```txt
subjectId
title
description
goal
startDate
endDate
status
priority
estimatedHours
```

Catatan:

- Untuk select sederhana, boleh gunakan native `<select>` terlebih dahulu.
- Radix Select bisa dibuat di issue polish UI nanti.
- Subject yang sudah archived sebaiknya tetap bisa tampil, tetapi idealnya hanya subject active yang dipakai untuk create.

---

### 10. Create Study Plan Card

Buat file:

```txt
features/study-plans/components/study-plan-card.tsx
```

Requirements:

- Menampilkan title.
- Menampilkan subject name dan warna subject.
- Menampilkan description.
- Menampilkan goal ringkas.
- Menampilkan status badge.
- Menampilkan priority badge.
- Menampilkan start date dan end date.
- Menampilkan estimated hours.
- Menampilkan edit button.
- Menampilkan delete button.

Visual card:

```txt
[Subject Color] Next.js
Belajar Next.js Fullstack

Status: In Progress
Priority: High
Timeline: 1 Jul 2026 - 14 Jul 2026
Estimated: 40h
```

Badge variant mapping:

```txt
NOT_STARTED = default
IN_PROGRESS = info
COMPLETED = success
PAUSED = warning
CANCELLED = danger

LOW = default
MEDIUM = info
HIGH = warning
URGENT = danger
```

---

### 11. Create Study Plan Update Form

Buat file:

```txt
features/study-plans/components/study-plan-update-form.tsx
```

Requirements:

- Bisa ditampilkan dalam Radix Dialog.
- Menggunakan React Hook Form.
- Default values berasal dari study plan.
- Menggunakan `updateStudyPlanSchema`.
- Menggunakan `useUpdateStudyPlanMutation`.
- Menggunakan `useSubjectsQuery` untuk pilihan subject.
- Setelah berhasil update, tutup dialog.

---

### 12. Create Study Plan Delete Dialog

Buat file:

```txt
features/study-plans/components/study-plan-delete-dialog.tsx
```

Requirements:

- Menggunakan Radix Dialog.
- Menampilkan nama study plan.
- Menampilkan warning bahwa delete bisa menghapus task dan session terkait.
- Menggunakan `useDeleteStudyPlanMutation`.
- Setelah berhasil delete, tutup dialog.

Warning copy:

```txt
Menghapus study plan dapat menghapus task dan data terkait. Tindakan ini tidak bisa dibatalkan.
```

---

### 13. Create Study Plan List Component

Buat file:

```txt
features/study-plans/components/study-plan-list.tsx
```

Isi:

```tsx
"use client";

import { StudyPlanCard } from "@/features/study-plans/components/study-plan-card";
import { StudyPlanEmptyState } from "@/features/study-plans/components/study-plan-empty-state";
import { useStudyPlansQuery } from "@/features/study-plans/hooks/use-study-plans-query";
import { Card } from "@/components/ui/card";

export function StudyPlanList() {
  const query = useStudyPlansQuery();

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
        <h3 className="text-lg font-semibold text-slate-950">Gagal memuat study plan</h3>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
  }

  const plans = query.data ?? [];

  if (plans.length === 0) {
    return <StudyPlanEmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {plans.map((plan) => (
        <StudyPlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
```

---

### 14. Update Study Plans Page

Edit file:

```txt
app/dashboard/plans/page.tsx
```

Isi:

```tsx
import { StudyPlanCreateForm } from "@/features/study-plans/components/study-plan-create-form";
import { StudyPlanList } from "@/features/study-plans/components/study-plan-list";

export default function StudyPlansPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <StudyPlanCreateForm />

      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Study Plans</h1>
          <p className="mt-2 text-sm text-slate-500">
            Kelola rencana belajar berdasarkan subject, deadline, status, dan prioritas.
          </p>
        </div>

        <StudyPlanList />
      </div>
    </div>
  );
}
```

---

### 15. Handle No Subject State

Karena study plan wajib punya subject, form create harus menangani kondisi subject kosong.

Jika `useSubjectsQuery()` menghasilkan array kosong:

```txt
Belum ada subject. Buat subject terlebih dahulu sebelum membuat study plan.
```

Tampilkan link ke:

```txt
/dashboard/subjects
```

Expected behavior:

```txt
Jika belum ada subject, tombol create study plan disabled.
Jika ada subject, form aktif.
```

---

### 16. Run Checks

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
└── study-plans.ts

app/
└── dashboard/
    └── plans/
        └── page.tsx

features/
└── study-plans/
    ├── components/
    │   ├── study-plan-card.tsx
    │   ├── study-plan-create-form.tsx
    │   ├── study-plan-delete-dialog.tsx
    │   ├── study-plan-empty-state.tsx
    │   ├── study-plan-list.tsx
    │   └── study-plan-update-form.tsx
    ├── hooks/
    │   ├── use-create-study-plan-mutation.ts
    │   ├── use-delete-study-plan-mutation.ts
    │   ├── use-study-plans-query.ts
    │   └── use-update-study-plan-mutation.ts
    └── schemas/
        └── study-plan-schema.ts

types/
└── study-plan.ts
```

## Acceptance Criteria

- Halaman `/dashboard/plans` tersedia.
- Halaman hanya bisa diakses user yang sudah login.
- Study plan list menampilkan data milik user login.
- User tidak bisa melihat study plan milik user lain.
- User bisa membuat study plan baru.
- User bisa memilih subject saat membuat study plan.
- User bisa mengedit study plan.
- User bisa menghapus study plan.
- User bisa mengubah status study plan.
- User bisa mengubah priority study plan.
- Form create menggunakan React Hook Form.
- Form update menggunakan React Hook Form.
- Validasi input menggunakan Zod.
- Data fetching menggunakan TanStack Query.
- Mutation create menggunakan TanStack Query.
- Mutation update menggunakan TanStack Query.
- Mutation delete menggunakan TanStack Query.
- Query study plan di-invalidate setelah create/update/delete berhasil.
- Server Actions berada di folder root `actions/`.
- Semua Server Actions memvalidasi session user.
- Semua query database memfilter berdasarkan `userId`.
- Subject yang dipilih wajib milik user login.
- Empty state tampil jika study plan kosong.
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
http://localhost:3000/dashboard/plans
```

Expected:

```txt
Halaman Study Plan Management tampil.
```

---

### 2. Test Protected Access

Logout, lalu buka:

```txt
http://localhost:3000/dashboard/plans
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
Form create study plan disabled atau menampilkan pesan untuk membuat subject dulu.
Link ke /dashboard/subjects tersedia.
```

---

### 4. Test Create Study Plan

Pastikan user sudah punya subject.

Input:

```txt
Subject: Next.js
Title: Belajar Next.js Fullstack
Description: Belajar App Router, Drizzle, Auth, dan dashboard
Goal: Bisa membuat aplikasi fullstack portfolio-ready
Start Date: 2026-07-01
End Date: 2026-07-14
Status: IN_PROGRESS
Priority: HIGH
Estimated Hours: 40
```

Expected:

```txt
Study plan berhasil dibuat.
Study plan muncul di list.
Subject name tampil di card.
Form reset.
Database memiliki row study plan baru dengan user_id sesuai user login.
```

---

### 5. Test Update Study Plan

Edit title, status, priority, atau estimated hours.

Expected:

```txt
Data berhasil berubah.
List ter-update.
updated_at berubah.
```

---

### 6. Test Delete Study Plan

Klik delete dan confirm.

Expected:

```txt
Study plan berhasil dihapus.
Study plan hilang dari list.
Query study plan di-invalidate.
```

---

### 7. Test User Isolation

Login sebagai user A dan buat study plan.

Login sebagai user B.

Expected:

```txt
User B tidak bisa melihat study plan milik user A.
User B tidak bisa update/delete study plan milik user A.
User B tidak bisa memakai subject milik user A untuk membuat study plan.
```

---

### 8. Test Status Badge

Buat atau edit study plan dengan status berbeda:

```txt
NOT_STARTED
IN_PROGRESS
COMPLETED
PAUSED
CANCELLED
```

Expected:

```txt
Badge status tampil sesuai status.
```

---

### 9. Test Priority Badge

Buat atau edit study plan dengan priority berbeda:

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

- Jangan membuat task di issue ini.
- Jangan membuat progress real berdasarkan task di issue ini.
- Progress real akan dibuat setelah Task Management selesai.
- Jangan membuat analytics di issue ini.
- Jangan membuat API route.
- Semua logic database harus berada di Server Actions.
- Semua action yang mengubah data harus validasi input dengan Zod.
- Semua action wajib cek session user.
- TanStack Query digunakan untuk query dan mutation di sisi client.
- Jika UI terlalu kompleks, gunakan native select dulu untuk status, priority, dan subject.
- Radix Dialog bisa digunakan untuk edit dan delete modal.
- Pastikan tidak ada data user lain yang bisa diakses.

## Suggested Commit Message

```bash
feat: build study plan management
```
