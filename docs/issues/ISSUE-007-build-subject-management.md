# ISSUE-007 — Build Subject Management

## Status

Planned

## Priority

High

## Type

Feature / Dashboard CRUD

## Summary

Membangun fitur Subject Management untuk StudyFlow. Subject adalah kategori belajar milik user, misalnya Next.js, Laravel, Django, Skripsi, English, Database, atau UI/UX.

Issue ini adalah fitur CRUD pertama setelah dashboard layout selesai. Subject Management akan menggunakan Server Actions di folder root `actions/`, TanStack Query untuk query dan mutation di client, Zod untuk validasi, React Hook Form untuk form, dan Drizzle ORM untuk akses database.

## Background

StudyFlow memiliki flow utama:

```txt
User → Subject → Study Plan → Task → Study Session → Analytics
```

Sebelum user membuat study plan, user perlu membuat subject terlebih dahulu. Subject digunakan sebagai kategori utama untuk mengelompokkan rencana belajar, task, dan study session.

Contoh subject:

```txt
Next.js
Laravel
Django
Skripsi
English
Database
UI/UX
```

Pada issue sebelumnya, dashboard navigation dan responsive sidebar sudah dibuat. Issue ini mulai mengisi salah satu menu dashboard, yaitu:

```txt
/dashboard/subjects
```

## Goals

- Membuat fitur Subject Management.
- Menampilkan daftar subject milik user yang sedang login.
- Membuat subject baru.
- Mengedit subject.
- Menghapus subject.
- Mengarsipkan subject.
- Menampilkan empty state jika belum ada subject.
- Menampilkan loading state.
- Menampilkan error state.
- Validasi input menggunakan Zod.
- Form menggunakan React Hook Form.
- Data fetching menggunakan TanStack Query.
- Mutasi create/update/delete menggunakan TanStack Query.
- Semua operasi database menggunakan Server Actions di folder root `actions/`.
- Semua action wajib memvalidasi session user.
- User hanya boleh mengakses subject miliknya sendiri.
- Tampilan mengikuti clean white dashboard style StudyFlow.

## Non-Goals

- Tidak membuat Study Plan Management.
- Tidak membuat Task Management.
- Tidak membuat Study Session Tracker.
- Tidak membuat Analytics Dashboard.
- Tidak membuat subject sharing antar user.
- Tidak membuat bulk delete.
- Tidak membuat import/export subject.
- Tidak membuat AI subject generator.
- Tidak mengubah schema database.
- Tidak menambahkan shadcn/ui.
- Tidak membuat API route.
- Tidak membuat admin subject management.

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
/dashboard/subjects
```

## Database Table

Gunakan tabel yang sudah ada:

```txt
subjects
```

Field utama:

```txt
id
user_id
name
description
color
target_hours
is_archived
created_at
updated_at
```

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
actions/
└── subjects.ts

app/
└── dashboard/
    └── subjects/
        └── page.tsx

features/
└── subjects/
    ├── components/
    │   ├── subject-card.tsx
    │   ├── subject-create-form.tsx
    │   ├── subject-delete-dialog.tsx
    │   ├── subject-empty-state.tsx
    │   ├── subject-list.tsx
    │   └── subject-update-form.tsx
    ├── hooks/
    │   ├── use-create-subject-mutation.ts
    │   ├── use-delete-subject-mutation.ts
    │   ├── use-subjects-query.ts
    │   └── use-update-subject-mutation.ts
    └── schemas/
        └── subject-schema.ts

types/
└── subject.ts
```

## Implementation Steps

### 1. Create Subject Types

Buat file:

```txt
types/subject.ts
```

Isi:

```ts
export type SubjectItem = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  targetHours: number | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

---

### 2. Create Subject Validation Schema

Buat file:

```txt
features/subjects/schemas/subject-schema.ts
```

Isi:

```ts
import { z } from "zod";

export const subjectSchema = z.object({
  name: z
    .string()
    .min(2, "Nama subject minimal 2 karakter")
    .max(120, "Nama subject maksimal 120 karakter"),
  description: z.string().max(500, "Deskripsi maksimal 500 karakter").optional().or(z.literal("")),
  color: z
    .string()
    .min(1, "Warna wajib dipilih")
    .max(20, "Format warna terlalu panjang")
    .default("#4F46E5"),
  targetHours: z.coerce
    .number()
    .int("Target jam harus berupa angka bulat")
    .min(1, "Target jam minimal 1")
    .max(1000, "Target jam maksimal 1000")
    .optional()
    .or(z.literal("")),
});

export const updateSubjectSchema = subjectSchema.extend({
  id: z.string().uuid("ID subject tidak valid"),
});

export const deleteSubjectSchema = z.object({
  id: z.string().uuid("ID subject tidak valid"),
});

export type SubjectInput = z.infer<typeof subjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
export type DeleteSubjectInput = z.infer<typeof deleteSubjectSchema>;
```

Catatan:

- `targetHours` dibuat optional.
- Jika input kosong, nanti action harus mengubahnya menjadi `null`.
- `id` wajib divalidasi saat update/delete.

---

### 3. Create Subject Actions

Buat file:

```txt
actions/subjects.ts
```

Isi:

```ts
"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { subjects } from "@/db/schema";
import {
  deleteSubjectSchema,
  subjectSchema,
  updateSubjectSchema,
  type DeleteSubjectInput,
  type SubjectInput,
  type UpdateSubjectInput,
} from "@/features/subjects/schemas/subject-schema";
import { auth } from "@/auth";
import type { ActionResponse } from "@/types/action-response";
import type { SubjectItem } from "@/types/subject";

function normalizeTargetHours(value: SubjectInput["targetHours"]) {
  if (value === "" || value === undefined) {
    return null;
  }

  return value;
}

function normalizeDescription(value: SubjectInput["description"]) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value.trim();
}

async function requireAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function getSubjectsAction(): Promise<ActionResponse<SubjectItem[]>> {
  try {
    const user = await requireAuthUser();

    const data = await db
      .select({
        id: subjects.id,
        name: subjects.name,
        description: subjects.description,
        color: subjects.color,
        targetHours: subjects.targetHours,
        isArchived: subjects.isArchived,
        createdAt: subjects.createdAt,
        updatedAt: subjects.updatedAt,
      })
      .from(subjects)
      .where(eq(subjects.userId, user.id))
      .orderBy(desc(subjects.createdAt));

    return {
      success: true,
      message: "Subject berhasil diambil.",
      data,
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data subject.",
      data: [],
    };
  }
}

export async function createSubjectAction(
  input: SubjectInput
): Promise<ActionResponse<{ id: string }>> {
  const parsed = subjectSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingSubject] = await db
      .select({ id: subjects.id })
      .from(subjects)
      .where(and(eq(subjects.userId, user.id), eq(subjects.name, parsed.data.name)))
      .limit(1);

    if (existingSubject) {
      return {
        success: false,
        message: "Subject dengan nama tersebut sudah ada.",
      };
    }

    const [newSubject] = await db
      .insert(subjects)
      .values({
        userId: user.id,
        name: parsed.data.name.trim(),
        description: normalizeDescription(parsed.data.description),
        color: parsed.data.color,
        targetHours: normalizeTargetHours(parsed.data.targetHours),
      })
      .returning({
        id: subjects.id,
      });

    revalidatePath("/dashboard/subjects");

    return {
      success: true,
      message: "Subject berhasil dibuat.",
      data: {
        id: newSubject.id,
      },
    };
  } catch {
    return {
      success: false,
      message: "Gagal membuat subject.",
    };
  }
}

export async function updateSubjectAction(input: UpdateSubjectInput): Promise<ActionResponse> {
  const parsed = updateSubjectSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingSubject] = await db
      .select({ id: subjects.id })
      .from(subjects)
      .where(and(eq(subjects.id, parsed.data.id), eq(subjects.userId, user.id)))
      .limit(1);

    if (!existingSubject) {
      return {
        success: false,
        message: "Subject tidak ditemukan.",
      };
    }

    await db
      .update(subjects)
      .set({
        name: parsed.data.name.trim(),
        description: normalizeDescription(parsed.data.description),
        color: parsed.data.color,
        targetHours: normalizeTargetHours(parsed.data.targetHours),
        updatedAt: new Date(),
      })
      .where(and(eq(subjects.id, parsed.data.id), eq(subjects.userId, user.id)));

    revalidatePath("/dashboard/subjects");

    return {
      success: true,
      message: "Subject berhasil diperbarui.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui subject.",
    };
  }
}

export async function toggleArchiveSubjectAction(
  input: DeleteSubjectInput
): Promise<ActionResponse> {
  const parsed = deleteSubjectSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [subject] = await db
      .select({
        id: subjects.id,
        isArchived: subjects.isArchived,
      })
      .from(subjects)
      .where(and(eq(subjects.id, parsed.data.id), eq(subjects.userId, user.id)))
      .limit(1);

    if (!subject) {
      return {
        success: false,
        message: "Subject tidak ditemukan.",
      };
    }

    await db
      .update(subjects)
      .set({
        isArchived: !subject.isArchived,
        updatedAt: new Date(),
      })
      .where(and(eq(subjects.id, parsed.data.id), eq(subjects.userId, user.id)));

    revalidatePath("/dashboard/subjects");

    return {
      success: true,
      message: subject.isArchived
        ? "Subject berhasil diaktifkan kembali."
        : "Subject berhasil diarsipkan.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengubah status arsip subject.",
    };
  }
}

export async function deleteSubjectAction(input: DeleteSubjectInput): Promise<ActionResponse> {
  const parsed = deleteSubjectSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuthUser();

    const [existingSubject] = await db
      .select({ id: subjects.id })
      .from(subjects)
      .where(and(eq(subjects.id, parsed.data.id), eq(subjects.userId, user.id)))
      .limit(1);

    if (!existingSubject) {
      return {
        success: false,
        message: "Subject tidak ditemukan.",
      };
    }

    await db
      .delete(subjects)
      .where(and(eq(subjects.id, parsed.data.id), eq(subjects.userId, user.id)));

    revalidatePath("/dashboard/subjects");

    return {
      success: true,
      message: "Subject berhasil dihapus.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal menghapus subject. Pastikan subject tidak sedang digunakan.",
    };
  }
}
```

Catatan penting:

- Semua action wajib cek session.
- Semua query/update/delete wajib filter `userId`.
- Jangan expose data user lain.
- Delete subject akan ikut menghapus study plan jika relasi database menggunakan cascade.
- Untuk keamanan data, fitur utama di UI sebaiknya menggunakan archive, bukan delete permanen.

---

### 4. Create Subjects Query Hook

Buat file:

```txt
features/subjects/hooks/use-subjects-query.ts
```

Isi:

```ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { getSubjectsAction } from "@/actions/subjects";

export const subjectsQueryKey = ["subjects"];

export function useSubjectsQuery() {
  return useQuery({
    queryKey: subjectsQueryKey,
    queryFn: async () => {
      const result = await getSubjectsAction();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data ?? [];
    },
  });
}
```

---

### 5. Create Create Subject Mutation Hook

Buat file:

```txt
features/subjects/hooks/use-create-subject-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSubjectAction } from "@/actions/subjects";
import type { SubjectInput } from "@/features/subjects/schemas/subject-schema";
import { subjectsQueryKey } from "@/features/subjects/hooks/use-subjects-query";

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SubjectInput) => createSubjectAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: subjectsQueryKey,
        });
      }
    },
  });
}
```

---

### 6. Create Update Subject Mutation Hook

Buat file:

```txt
features/subjects/hooks/use-update-subject-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateSubjectAction, toggleArchiveSubjectAction } from "@/actions/subjects";
import type {
  DeleteSubjectInput,
  UpdateSubjectInput,
} from "@/features/subjects/schemas/subject-schema";
import { subjectsQueryKey } from "@/features/subjects/hooks/use-subjects-query";

export function useUpdateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateSubjectInput) => updateSubjectAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: subjectsQueryKey,
        });
      }
    },
  });
}

export function useToggleArchiveSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteSubjectInput) => toggleArchiveSubjectAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: subjectsQueryKey,
        });
      }
    },
  });
}
```

---

### 7. Create Delete Subject Mutation Hook

Buat file:

```txt
features/subjects/hooks/use-delete-subject-mutation.ts
```

Isi:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteSubjectAction } from "@/actions/subjects";
import type { DeleteSubjectInput } from "@/features/subjects/schemas/subject-schema";
import { subjectsQueryKey } from "@/features/subjects/hooks/use-subjects-query";

export function useDeleteSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteSubjectInput) => deleteSubjectAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: subjectsQueryKey,
        });
      }
    },
  });
}
```

---

### 8. Create Subject Empty State

Buat file:

```txt
features/subjects/components/subject-empty-state.tsx
```

Isi:

```tsx
import { BookOpen } from "lucide-react";

import { Card } from "@/components/ui/card";

export function SubjectEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <BookOpen className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-slate-950">Belum ada subject</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Buat subject pertama untuk mengelompokkan rencana belajar, task, dan study session kamu.
      </p>
    </Card>
  );
}
```

---

### 9. Create Subject Create Form

Buat file:

```txt
features/subjects/components/subject-create-form.tsx
```

Isi:

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { subjectSchema, type SubjectInput } from "@/features/subjects/schemas/subject-schema";
import { useCreateSubjectMutation } from "@/features/subjects/hooks/use-create-subject-mutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function SubjectCreateForm() {
  const mutation = useCreateSubjectMutation();

  const form = useForm<SubjectInput>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#4F46E5",
      targetHours: "",
    },
  });

  async function onSubmit(values: SubjectInput) {
    const result = await mutation.mutateAsync(values);

    if (!result.success) {
      form.setError("root", {
        message: result.message,
      });
      return;
    }

    form.reset({
      name: "",
      description: "",
      color: "#4F46E5",
      targetHours: "",
    });
  }

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">Create Subject</h2>
        <p className="mt-1 text-sm text-slate-500">Tambahkan kategori belajar baru.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Subject name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="mt-2 text-sm text-rose-600">{form.formState.errors.name.message}</p>
          ) : null}
        </div>

        <div>
          <Input placeholder="Description optional" {...form.register("description")} />
          {form.formState.errors.description ? (
            <p className="mt-2 text-sm text-rose-600">
              {form.formState.errors.description.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input type="color" {...form.register("color")} />
            {form.formState.errors.color ? (
              <p className="mt-2 text-sm text-rose-600">{form.formState.errors.color.message}</p>
            ) : null}
          </div>

          <div>
            <Input type="number" placeholder="Target hours" {...form.register("targetHours")} />
            {form.formState.errors.targetHours ? (
              <p className="mt-2 text-sm text-rose-600">
                {form.formState.errors.targetHours.message}
              </p>
            ) : null}
          </div>
        </div>

        {form.formState.errors.root ? (
          <p className="text-sm text-rose-600">{form.formState.errors.root.message}</p>
        ) : null}

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Creating..." : "Create Subject"}
        </Button>
      </form>
    </Card>
  );
}
```

---

### 10. Create Subject Card

Buat file:

```txt
features/subjects/components/subject-card.tsx
```

Isi:

```tsx
"use client";

import { Archive, ArchiveRestore, Trash2 } from "lucide-react";

import { useToggleArchiveSubjectMutation } from "@/features/subjects/hooks/use-update-subject-mutation";
import type { SubjectItem } from "@/types/subject";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SubjectCardProps = {
  subject: SubjectItem;
};

export function SubjectCard({ subject }: SubjectCardProps) {
  const archiveMutation = useToggleArchiveSubjectMutation();

  async function handleArchiveToggle() {
    await archiveMutation.mutateAsync({
      id: subject.id,
    });
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: subject.color }} />

            <h3 className="truncate text-lg font-semibold tracking-tight text-slate-950">
              {subject.name}
            </h3>
          </div>

          <p className="text-sm leading-6 text-slate-500">
            {subject.description ?? "No description"}
          </p>
        </div>

        {subject.isArchived ? (
          <Badge variant="warning">Archived</Badge>
        ) : (
          <Badge variant="success">Active</Badge>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Target:{" "}
          <span className="font-medium text-slate-950">
            {subject.targetHours ? `${subject.targetHours}h` : "Not set"}
          </span>
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleArchiveToggle}
            disabled={archiveMutation.isPending}
          >
            {subject.isArchived ? (
              <ArchiveRestore className="h-4 w-4" />
            ) : (
              <Archive className="h-4 w-4" />
            )}
          </Button>

          <Button type="button" variant="outline" size="sm" disabled>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

Catatan:

- Tombol delete masih disabled jika delete dialog belum dibuat.
- Edit form juga bisa dibuat setelah list dasar berjalan.
- Jika ingin full CRUD di issue ini, lanjutkan step delete dialog dan update form.

---

### 11. Create Delete Subject Dialog

Buat file:

```txt
features/subjects/components/subject-delete-dialog.tsx
```

Requirements:

- Gunakan Radix Dialog.
- Tampilkan warning bahwa delete permanen bisa menghapus relasi terkait.
- Trigger dari button delete.
- Panggil `useDeleteSubjectMutation`.
- Setelah berhasil, tutup dialog.

Minimal behavior:

```txt
Open dialog
Show subject name
Click Cancel closes dialog
Click Delete calls deleteSubjectAction
Invalidate subjects query
```

Catatan:

- Jika ingin lebih aman, prioritaskan archive daripada delete.
- Delete permanen tetap disediakan untuk portfolio CRUD completeness.

---

### 12. Create Update Subject Form

Buat file:

```txt
features/subjects/components/subject-update-form.tsx
```

Requirements:

- Gunakan React Hook Form.
- Default values berasal dari subject.
- Validasi menggunakan `updateSubjectSchema`.
- Panggil `useUpdateSubjectMutation`.
- Bisa ditampilkan dalam dialog edit.
- Setelah update berhasil, tutup dialog.

Field:

```txt
name
description
color
targetHours
```

---

### 13. Create Subject List Component

Buat file:

```txt
features/subjects/components/subject-list.tsx
```

Isi:

```tsx
"use client";

import { SubjectCard } from "@/features/subjects/components/subject-card";
import { SubjectEmptyState } from "@/features/subjects/components/subject-empty-state";
import { useSubjectsQuery } from "@/features/subjects/hooks/use-subjects-query";
import { Card } from "@/components/ui/card";

export function SubjectList() {
  const query = useSubjectsQuery();

  if (query.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-44 animate-pulse bg-slate-100" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-950">Gagal memuat subject</h3>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
  }

  const subjects = query.data ?? [];

  if (subjects.length === 0) {
    return <SubjectEmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {subjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
}
```

---

### 14. Update Subjects Page

Edit file:

```txt
app/dashboard/subjects/page.tsx
```

Isi:

```tsx
import { SubjectCreateForm } from "@/features/subjects/components/subject-create-form";
import { SubjectList } from "@/features/subjects/components/subject-list";

export default function SubjectsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <SubjectCreateForm />

      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Subjects</h1>
          <p className="mt-2 text-sm text-slate-500">
            Kelola kategori belajar yang akan digunakan untuk study plan, task, dan session.
          </p>
        </div>

        <SubjectList />
      </div>
    </div>
  );
}
```

---

### 15. Improve Subject Card Full CRUD

Update `SubjectCard` agar memiliki:

```txt
Edit button
Archive/unarchive button
Delete button
```

Expected behavior:

```txt
Edit opens update dialog
Archive toggles isArchived
Delete opens confirmation dialog
```

Jika belum selesai di issue ini, minimal archive dan create/list harus selesai. Namun acceptance criteria utama tetap mengharuskan full CRUD.

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
└── subjects.ts

app/
└── dashboard/
    └── subjects/
        └── page.tsx

features/
└── subjects/
    ├── components/
    │   ├── subject-card.tsx
    │   ├── subject-create-form.tsx
    │   ├── subject-delete-dialog.tsx
    │   ├── subject-empty-state.tsx
    │   ├── subject-list.tsx
    │   └── subject-update-form.tsx
    ├── hooks/
    │   ├── use-create-subject-mutation.ts
    │   ├── use-delete-subject-mutation.ts
    │   ├── use-subjects-query.ts
    │   └── use-update-subject-mutation.ts
    └── schemas/
        └── subject-schema.ts

types/
└── subject.ts
```

## Acceptance Criteria

- Halaman `/dashboard/subjects` tersedia.
- Halaman hanya bisa diakses user yang sudah login.
- Subject list menampilkan data subject milik user login.
- User tidak bisa melihat subject milik user lain.
- User bisa membuat subject baru.
- User bisa mengedit subject.
- User bisa mengarsipkan subject.
- User bisa mengaktifkan kembali subject yang diarsipkan.
- User bisa menghapus subject.
- Form create subject menggunakan React Hook Form.
- Form update subject menggunakan React Hook Form.
- Validasi input menggunakan Zod.
- Data fetching menggunakan TanStack Query.
- Mutation create menggunakan TanStack Query.
- Mutation update menggunakan TanStack Query.
- Mutation archive menggunakan TanStack Query.
- Mutation delete menggunakan TanStack Query.
- Query subject di-invalidate setelah create/update/archive/delete berhasil.
- Server Actions berada di folder root `actions/`.
- Semua Server Actions memvalidasi session user.
- Semua query database memfilter berdasarkan `userId`.
- Empty state tampil jika subject kosong.
- Loading state tampil saat data sedang dimuat.
- Error state tampil jika gagal mengambil data.
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
http://localhost:3000/dashboard/subjects
```

Expected:

```txt
Halaman Subject Management tampil.
```

---

### 2. Test Protected Access

Logout, lalu buka:

```txt
http://localhost:3000/dashboard/subjects
```

Expected:

```txt
User diarahkan ke /login.
```

---

### 3. Test Empty State

Gunakan user baru tanpa subject.

Expected:

```txt
Empty state tampil.
Tidak ada error.
```

---

### 4. Test Create Subject

Input:

```txt
Name: Next.js
Description: Belajar Next.js fullstack
Color: #4F46E5
Target Hours: 40
```

Expected:

```txt
Subject berhasil dibuat.
Subject muncul di list.
Form reset.
Database memiliki row subject baru dengan user_id sesuai user login.
```

---

### 5. Test Duplicate Subject

Input subject dengan nama yang sama untuk user yang sama.

Expected:

```txt
Muncul error subject sudah ada.
Tidak membuat row duplicate.
```

---

### 6. Test Update Subject

Edit subject.

Expected:

```txt
Data subject berhasil berubah.
List ter-update setelah mutation berhasil.
updated_at berubah.
```

---

### 7. Test Archive Subject

Klik archive.

Expected:

```txt
Subject berubah status menjadi archived.
Badge berubah menjadi Archived.
```

Klik unarchive.

Expected:

```txt
Subject kembali aktif.
Badge berubah menjadi Active.
```

---

### 8. Test Delete Subject

Klik delete dan confirm.

Expected:

```txt
Subject berhasil dihapus.
Subject hilang dari list.
Query subject di-invalidate.
```

---

### 9. Test User Isolation

Login sebagai user A dan buat subject.

Login sebagai user B.

Expected:

```txt
User B tidak bisa melihat subject milik user A.
User B tidak bisa update/delete subject milik user A.
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

- Prioritaskan archive daripada delete untuk data yang sudah berelasi.
- Delete tetap disediakan untuk kelengkapan CRUD portfolio.
- Jangan membuat study plan di issue ini.
- Jangan membuat task di issue ini.
- Jangan membuat analytics di issue ini.
- Jangan membuat API route.
- Semua logic database harus berada di Server Actions.
- Semua action yang mengubah data harus validasi input dengan Zod.
- Semua action wajib cek session user.
- TanStack Query digunakan untuk query dan mutation di sisi client.
- Jika UI terasa terlalu padat, update/delete bisa memakai Radix Dialog.

## Suggested Commit Message

```bash
feat: build subject management
```
