# ISSUE-019 — Add Toast Notifications

## Status

Planned

## Priority

Medium

## Type

UI/UX Improvement / Global Feedback

## Summary

Menambahkan sistem toast notification global ke StudyFlow menggunakan Sonner.

Toast digunakan untuk memberikan feedback setelah aksi user seperti membuat, mengubah, menghapus, menyimpan, login, register, generate AI, atau ketika sebuah operasi gagal.

Issue ini mengganti sebagian besar general success/error feedback inline yang dibuat pada issue sebelumnya menjadi toast notification yang konsisten.

Field validation error tetap ditampilkan di dekat input. Toast tidak digunakan untuk menggantikan validasi form per-field.

## Background

StudyFlow sudah memiliki berbagai mutation:

```txt
Authentication
Subject CRUD
Study Plan CRUD
Task CRUD
Study Session CRUD
Profile Settings
AI Study Plan Generation
AI Study Plan Save
Task Status Update
Archive Subject
```

Saat ini feedback keberhasilan dan kegagalan masih menggunakan beberapa pola berbeda:

```txt
Inline success message
Inline error message
Form root error
Tidak ada feedback
Pesan berbeda pada setiap feature
```

Hal tersebut membuat pengalaman user kurang konsisten.

Pada issue ini, StudyFlow akan menggunakan satu global toaster dan pola feedback yang sama untuk semua mutation.

## Goals

- Menginstal Sonner.
- Menambahkan global toaster.
- Membuat toast helper yang reusable.
- Menampilkan toast success setelah mutation berhasil.
- Menampilkan toast error setelah mutation gagal.
- Menampilkan toast loading untuk proses yang relatif lama.
- Menampilkan toast khusus untuk AI generation.
- Menampilkan toast setelah create, update, dan delete.
- Menghindari duplicate toast.
- Menghindari duplicate inline feedback.
- Tetap menampilkan field validation error secara inline.
- Tidak menampilkan technical error kepada user.
- Menjaga toast tetap responsive.
- Menjaga toast dapat digunakan dengan keyboard dan screen reader.
- Menstandarkan pesan toast seluruh aplikasi.

## Non-Goals

- Tidak membuat notification center.
- Tidak menyimpan riwayat notification.
- Tidak membuat push notification.
- Tidak membuat email notification.
- Tidak membuat browser notification.
- Tidak membuat reminder deadline.
- Tidak membuat database notification.
- Tidak membuat custom animation kompleks.
- Tidak mengubah business logic mutation.
- Tidak mengubah schema database.
- Tidak membuat API route baru.
- Tidak menggunakan toast untuk field validation error.
- Tidak menambahkan shadcn/ui.

## Tech Stack

- Next.js App Router
- TypeScript
- TanStack Query
- Server Actions
- Sonner
- Tailwind CSS
- React Hook Form
- Zod

## Required Package

Install Sonner:

```bash
pnpm add sonner
```

Tidak perlu menggunakan shadcn CLI.

Jangan menjalankan:

```bash
pnpm dlx shadcn@latest add sonner
```

StudyFlow menggunakan Sonner secara langsung agar tetap konsisten dengan custom UI architecture.

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
components/
└── providers/
    └── toast-provider.tsx

hooks/
└── use-action-toast.ts

lib/
└── toast-messages.ts
```

File yang kemungkinan diperbarui:

```txt
app/providers.tsx

features/auth/hooks/*
features/subjects/hooks/*
features/study-plans/hooks/*
features/tasks/hooks/*
features/study-sessions/hooks/*
features/settings/hooks/*
features/ai-study-plan/hooks/*

features/auth/components/*
features/subjects/components/*
features/study-plans/components/*
features/tasks/components/*
features/study-sessions/components/*
features/settings/components/*
features/ai-study-plan/components/*
```

## Toast Rules

Gunakan jenis toast berikut:

```txt
toast.success()
toast.error()
toast.info()
toast.warning()
toast.loading()
```

Penggunaan:

```txt
Success:
Aksi berhasil dan data berubah.

Error:
Aksi gagal dan user perlu mengetahui kegagalan tersebut.

Info:
Informasi proses atau kondisi yang tidak termasuk error.

Warning:
Aksi berhasil sebagian atau membutuhkan perhatian user.

Loading:
Operasi yang memerlukan waktu lebih lama, terutama AI generation.
```

## Feedback Responsibility

Gunakan pembagian berikut:

```txt
Field validation error:
Tampil inline di bawah field.

General mutation error:
Tampil sebagai toast error.

General mutation success:
Tampil sebagai toast success.

Query error:
Tetap gunakan ErrorState dengan retry button.

Empty state:
Tetap gunakan EmptyState.

Long-running action:
Gunakan loading toast yang diubah menjadi success/error.
```

Jangan menampilkan toast untuk:

```txt
Setiap page load
Setiap query refetch
Setiap perubahan input
Setiap field validation error
Navigasi halaman biasa
Empty state
```

## Implementation Steps

### 1. Install Sonner

Jalankan:

```bash
pnpm add sonner
```

Kemudian:

```bash
pnpm lint
pnpm format
```

Expected:

```txt
Package sonner tersedia.
Tidak ada lint error.
Tidak ada format error.
```

---

### 2. Create Toast Provider

Buat file:

```txt
components/providers/toast-provider.tsx
```

Isi:

```tsx
"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      closeButton
      richColors
      visibleToasts={4}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-xl",
          title: "font-semibold",
          description: "text-slate-500",
          actionButton: "rounded-xl bg-slate-950 px-3 py-2 text-white",
          cancelButton: "rounded-xl bg-slate-100 px-3 py-2 text-slate-700",
        },
      }}
    />
  );
}
```

Rules:

```txt
Toaster hanya dipasang satu kali.
Jangan pasang Toaster pada setiap page.
Gunakan posisi top-right untuk desktop.
Sonner menangani layout mobile secara responsive.
```

Jika `richColors` tidak cocok dengan custom design, boleh dihapus dan gunakan class custom.

---

### 3. Register Toast Provider

Edit:

```txt
app/providers.tsx
```

Contoh struktur:

```tsx
"use client";

import type { ReactNode } from "react";

import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      {children}
      <ToastProvider />
    </QueryProvider>
  );
}
```

Pastikan `Providers` sudah digunakan pada:

```txt
app/layout.tsx
```

Expected:

```txt
Toast dapat ditampilkan dari semua Client Component.
Toaster tidak ter-render dua kali.
```

---

### 4. Create Toast Message Constants

Buat file:

```txt
lib/toast-messages.ts
```

Isi:

```ts
export const toastMessages = {
  auth: {
    loginSuccess: "Login berhasil.",
    loginError: "Email atau password tidak valid.",
    registerSuccess: "Akun berhasil dibuat.",
    registerError: "Registrasi gagal. Silakan periksa data kamu.",
    logoutSuccess: "Logout berhasil.",
  },

  subject: {
    createSuccess: "Subject berhasil dibuat.",
    createError: "Gagal membuat subject.",
    updateSuccess: "Subject berhasil diperbarui.",
    updateError: "Gagal memperbarui subject.",
    deleteSuccess: "Subject berhasil dihapus.",
    deleteError: "Gagal menghapus subject.",
    archiveSuccess: "Subject berhasil diarsipkan.",
    unarchiveSuccess: "Subject berhasil diaktifkan kembali.",
    archiveError: "Gagal mengubah status subject.",
  },

  studyPlan: {
    createSuccess: "Study plan berhasil dibuat.",
    createError: "Gagal membuat study plan.",
    updateSuccess: "Study plan berhasil diperbarui.",
    updateError: "Gagal memperbarui study plan.",
    deleteSuccess: "Study plan berhasil dihapus.",
    deleteError: "Gagal menghapus study plan.",
  },

  task: {
    createSuccess: "Task berhasil dibuat.",
    createError: "Gagal membuat task.",
    updateSuccess: "Task berhasil diperbarui.",
    updateError: "Gagal memperbarui task.",
    deleteSuccess: "Task berhasil dihapus.",
    deleteError: "Gagal menghapus task.",
    statusSuccess: "Status task berhasil diperbarui.",
    statusError: "Gagal memperbarui status task.",
  },

  studySession: {
    createSuccess: "Study session berhasil dicatat.",
    createError: "Gagal mencatat study session.",
    updateSuccess: "Study session berhasil diperbarui.",
    updateError: "Gagal memperbarui study session.",
    deleteSuccess: "Study session berhasil dihapus.",
    deleteError: "Gagal menghapus study session.",
  },

  settings: {
    updateSuccess: "Profile berhasil diperbarui.",
    updateError: "Gagal memperbarui profile.",
  },

  ai: {
    generateLoading: "AI sedang membuat study plan...",
    generateSuccess: "Study plan berhasil digenerate.",
    generateError: "Gagal generate study plan.",
    invalidOutput: "AI menghasilkan format yang tidak valid.",
    saveLoading: "Menyimpan generated study plan...",
    saveSuccess: "Generated study plan berhasil disimpan.",
    saveError: "Gagal menyimpan generated study plan.",
  },

  common: {
    unexpectedError: "Terjadi kesalahan. Silakan coba kembali.",
    unauthorized: "Session berakhir. Silakan login kembali.",
  },
} as const;
```

Tujuan:

```txt
Menghindari pesan tersebar di banyak file.
Menjaga wording tetap konsisten.
Mempermudah perubahan bahasa di masa depan.
```

---

### 5. Create Reusable Action Toast Hook

Buat file:

```txt
hooks/use-action-toast.ts
```

Isi:

```ts
"use client";

import { toast } from "sonner";

import type { ActionResponse } from "@/types/action-response";

type ShowActionToastOptions = {
  successMessage?: string;
  errorMessage?: string;
};

export function useActionToast() {
  function showResult<T>(result: ActionResponse<T>, options?: ShowActionToastOptions) {
    if (result.success) {
      toast.success(options?.successMessage ?? result.message);
      return true;
    }

    toast.error(options?.errorMessage ?? result.message);
    return false;
  }

  function showUnexpectedError(message?: string) {
    toast.error(message ?? "Terjadi kesalahan. Silakan coba kembali.");
  }

  return {
    showResult,
    showUnexpectedError,
  };
}
```

Catatan:

- Hook ini hanya dipakai di Client Component.
- Jangan import hook ini ke Server Action.
- Server Action hanya mengembalikan `ActionResponse`.
- Client bertanggung jawab menampilkan toast.

---

### 6. Standardize Mutation Pattern

Gunakan pola berikut pada mutation hook:

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createSubjectAction } from "@/actions/subjects";
import type { SubjectInput } from "@/features/subjects/schemas/subject-schema";
import { subjectsQueryKey } from "@/features/subjects/hooks/use-subjects-query";
import { toastMessages } from "@/lib/toast-messages";

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SubjectInput) => createSubjectAction(input),

    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.subject.createError);
        return;
      }

      toast.success(toastMessages.subject.createSuccess);

      await queryClient.invalidateQueries({
        queryKey: subjectsQueryKey,
      });
    },

    onError: () => {
      toast.error(toastMessages.common.unexpectedError);
    },
  });
}
```

Rules:

```txt
onSuccess tetap memeriksa result.success.
ActionResponse success false bukan network exception.
onError dipakai untuk exception yang tidak tertangani.
Query hanya di-invalidate jika mutation benar-benar berhasil.
```

---

### 7. Refactor Subject Mutations

Update:

```txt
features/subjects/hooks/use-create-subject-mutation.ts
features/subjects/hooks/use-update-subject-mutation.ts
features/subjects/hooks/use-delete-subject-mutation.ts
features/subjects/hooks/use-toggle-archive-subject-mutation.ts
```

Expected toast:

```txt
Create success:
Subject berhasil dibuat.

Update success:
Subject berhasil diperbarui.

Delete success:
Subject berhasil dihapus.

Archive success:
Subject berhasil diarsipkan.

Unarchive success:
Subject berhasil diaktifkan kembali.
```

Untuk archive/unarchive, message bergantung pada current state:

```ts
toast.success(
  input.isArchived ? toastMessages.subject.unarchiveSuccess : toastMessages.subject.archiveSuccess
);
```

Sesuaikan dengan bentuk input mutation yang sebenarnya.

---

### 8. Refactor Study Plan Mutations

Update:

```txt
features/study-plans/hooks/use-create-study-plan-mutation.ts
features/study-plans/hooks/use-update-study-plan-mutation.ts
features/study-plans/hooks/use-delete-study-plan-mutation.ts
```

Toast:

```txt
Study plan berhasil dibuat.
Study plan berhasil diperbarui.
Study plan berhasil dihapus.
```

Form reset hanya dilakukan jika:

```ts
result.success === true;
```

Dialog edit/delete hanya ditutup jika mutation berhasil.

---

### 9. Refactor Task Mutations

Update:

```txt
features/tasks/hooks/use-create-task-mutation.ts
features/tasks/hooks/use-update-task-mutation.ts
features/tasks/hooks/use-delete-task-mutation.ts
features/tasks/hooks/use-update-task-status-mutation.ts
```

Toast:

```txt
Task berhasil dibuat.
Task berhasil diperbarui.
Task berhasil dihapus.
Status task berhasil diperbarui.
```

Untuk quick status update:

```txt
Jangan menampilkan lebih dari satu toast.
Jangan menampilkan toast loading karena proses relatif cepat.
```

Jika user menekan tombol status berkali-kali, button tetap disabled ketika mutation pending.

---

### 10. Refactor Study Session Mutations

Update:

```txt
features/study-sessions/hooks/use-create-study-session-mutation.ts
features/study-sessions/hooks/use-update-study-session-mutation.ts
features/study-sessions/hooks/use-delete-study-session-mutation.ts
```

Toast:

```txt
Study session berhasil dicatat.
Study session berhasil diperbarui.
Study session berhasil dihapus.
```

Gunakan wording `dicatat` untuk create agar sesuai konteks session tracker.

---

### 11. Refactor Settings Mutation

Update:

```txt
features/settings/hooks/use-update-profile-mutation.ts
```

Toast success:

```txt
Profile berhasil diperbarui.
```

Toast error:

```txt
Gunakan result.message jika error berasal dari duplicate email.
```

Contoh:

```ts
onSuccess: async (result) => {
  if (!result.success) {
    toast.error(result.message);
    return;
  }

  toast.success(toastMessages.settings.updateSuccess);

  await queryClient.invalidateQueries({
    queryKey: currentUserQueryKey,
  });
};
```

Hapus inline general success message:

```txt
Profile berhasil diperbarui.
```

Field validation error tetap inline.

---

### 12. Refactor AI Generate Mutation

Update:

```txt
features/ai-study-plan/hooks/use-generate-study-plan-mutation.ts
```

Karena generate AI dapat membutuhkan waktu lebih lama, gunakan loading toast dengan ID.

Isi yang direkomendasikan:

```ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { generateStudyPlanAction } from "@/actions/ai-study-plan";
import type { GenerateStudyPlanInput } from "@/features/ai-study-plan/schemas/ai-study-plan-schema";
import { toastMessages } from "@/lib/toast-messages";

const AI_GENERATE_TOAST_ID = "ai-study-plan-generate";

export function useGenerateStudyPlanMutation() {
  return useMutation({
    mutationFn: (input: GenerateStudyPlanInput) => generateStudyPlanAction(input),

    onMutate: () => {
      toast.loading(toastMessages.ai.generateLoading, {
        id: AI_GENERATE_TOAST_ID,
      });
    },

    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.ai.generateError, {
          id: AI_GENERATE_TOAST_ID,
        });
        return;
      }

      toast.success(toastMessages.ai.generateSuccess, {
        id: AI_GENERATE_TOAST_ID,
      });
    },

    onError: () => {
      toast.error(toastMessages.ai.generateError, {
        id: AI_GENERATE_TOAST_ID,
      });
    },
  });
}
```

Tujuan penggunaan ID:

```txt
Loading toast diubah menjadi success/error.
Tidak membuat tiga toast terpisah.
Tidak terjadi duplicate loading toast.
```

---

### 13. Refactor Save Generated Plan Mutation

Update:

```txt
features/ai-study-plan/hooks/use-save-generated-study-plan-mutation.ts
```

Gunakan loading toast:

```ts
const AI_SAVE_TOAST_ID = "ai-study-plan-save";
```

Pattern:

```ts
onMutate: () => {
  toast.loading(toastMessages.ai.saveLoading, {
    id: AI_SAVE_TOAST_ID,
  });
},

onSuccess: async (result) => {
  if (!result.success) {
    toast.error(result.message || toastMessages.ai.saveError, {
      id: AI_SAVE_TOAST_ID,
    });
    return;
  }

  toast.success(toastMessages.ai.saveSuccess, {
    id: AI_SAVE_TOAST_ID,
  });

  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: studyPlansQueryKey,
    }),
    queryClient.invalidateQueries({
      queryKey: tasksQueryKey,
    }),
  ]);
},

onError: () => {
  toast.error(toastMessages.ai.saveError, {
    id: AI_SAVE_TOAST_ID,
  });
},
```

---

### 14. Refactor Authentication Feedback

Affected files:

```txt
features/auth/hooks/use-login-mutation.ts
features/auth/hooks/use-register-mutation.ts
features/auth/components/login-form.tsx
features/auth/components/register-form.tsx
```

Login error:

```txt
Email atau password tidak valid.
```

Register success:

```txt
Akun berhasil dibuat.
```

Register error:

```txt
Gunakan result.message jika email sudah digunakan.
```

Catatan login:

- Jika login action langsung melakukan redirect, success toast tidak wajib.
- Prioritaskan error toast pada login gagal.
- Jangan menampilkan raw `AuthError`.
- Jangan menampilkan toast dan inline root error dengan pesan yang sama.

Recommended pattern:

```ts
if (!result.success) {
  toast.error(result.message || toastMessages.auth.loginError);
  return;
}
```

Untuk register berhasil:

```ts
toast.success(toastMessages.auth.registerSuccess);
```

---

### 15. Refactor Logout Feedback

Jika logout dilakukan dengan native form Server Action, toast success mungkin tidak sempat tampil sebelum navigasi.

Opsi MVP:

```txt
Tidak perlu toast logout.
```

Alternatif:

- Ubah logout menjadi client mutation.
- Tampilkan toast setelah `signOut`.
- Redirect setelah toast dipanggil.

Untuk issue ini, logout toast bersifat optional.

---

### 16. Remove Duplicate Inline General Feedback

Hapus inline general feedback yang sudah digantikan toast:

```txt
Subject berhasil dibuat.
Study plan berhasil dibuat.
Task berhasil dibuat.
Study session berhasil dibuat.
Profile berhasil diperbarui.
AI plan berhasil disimpan.
```

Tetap pertahankan inline feedback untuk:

```txt
Field validation error
No subject warning
No study plan warning
Authentication form guidance
AI provider configuration warning
Danger confirmation description
Query ErrorState
```

Jangan menghapus feedback penting hanya karena toast tersedia.

---

### 17. Keep Form Validation Inline

Contoh:

```tsx
{
  form.formState.errors.title ? (
    <p className="mt-2 text-sm text-rose-600">{form.formState.errors.title.message}</p>
  ) : null;
}
```

Jangan ubah menjadi:

```ts
toast.error(form.formState.errors.title.message);
```

Alasan:

```txt
User perlu mengetahui field mana yang salah.
Toast bisa hilang sebelum user memperbaiki input.
Banyak validation error dapat membuat terlalu banyak toast.
```

---

### 18. Close Dialog Only After Success

Affected dialogs:

```txt
Subject update/delete
Study plan update/delete
Task update/delete
Study session update/delete
```

Pattern:

```tsx
const result = await mutation.mutateAsync(values);

if (!result.success) {
  return;
}

setOpen(false);
```

Jangan:

```tsx
await mutation.mutateAsync(values);
setOpen(false);
```

karena dialog akan tertutup meskipun mutation gagal.

Toast ditangani oleh mutation hook.

---

### 19. Reset Form Only After Success

Pattern:

```tsx
const result = await mutation.mutateAsync(values);

if (!result.success) {
  return;
}

form.reset();
```

Affected:

```txt
Create Subject
Create Study Plan
Create Task
Create Study Session
```

Jangan reset input saat server mengembalikan error.

---

### 20. Prevent Duplicate Toast

Gunakan static toast ID untuk operasi long-running:

```txt
ai-study-plan-generate
ai-study-plan-save
```

Untuk CRUD biasa:

```txt
Tidak perlu static ID kecuali terbukti muncul duplicate toast.
```

Jangan memanggil toast success di dua tempat sekaligus:

```txt
Mutation hook
dan
Form component
```

Pilih satu sumber.

Rekomendasi:

```txt
Toast dikelola di mutation hook.
Form component hanya mengatur reset, dialog, dan navigation.
```

---

### 21. Standardize Error Handling

Server Action:

```ts
return {
  success: false,
  message: "Gagal membuat task.",
};
```

Mutation hook:

```ts
if (!result.success) {
  toast.error(result.message);
}
```

Unhandled exception:

```ts
onError: () => {
  toast.error(toastMessages.common.unexpectedError);
};
```

Jangan menampilkan:

```txt
Database connection string
PostgreSQL error
Stack trace
NVIDIA API key
Provider response body
Internal exception name
```

---

### 22. Toast Duration Rules

Gunakan default:

```txt
Success: 4 seconds
Error: 5–6 seconds
Info: 4 seconds
Warning: 5 seconds
Loading: sampai diganti success/error
```

Contoh error khusus:

```ts
toast.error(result.message, {
  duration: 6000,
});
```

Jangan membuat success toast bertahan terlalu lama.

---

### 23. Toast with Description

Untuk aksi tertentu, gunakan description.

Contoh save AI:

```ts
toast.success("Study plan berhasil disimpan.", {
  description: `${taskCount} task berhasil ditambahkan.`,
});
```

Contoh delete:

```ts
toast.success("Task berhasil dihapus.", {
  description: taskTitle,
});
```

Gunakan description hanya jika menambah konteks yang berguna.

---

### 24. Optional Toast Action

Untuk create Study Plan atau save AI, boleh tampilkan action:

```ts
toast.success("Study plan berhasil disimpan.", {
  action: {
    label: "View",
    onClick: () => router.push("/dashboard/plans"),
  },
});
```

Catatan:

- Optional untuk MVP.
- Jangan menambahkan action ke semua toast.
- Gunakan hanya jika navigation setelah aksi memang berguna.
- Action callback harus berada pada Client Component atau hook yang memiliki router.

---

### 25. Responsive Toast Requirements

Test pada mobile:

```txt
Toast tidak keluar viewport.
Text dapat wrap.
Close button dapat ditekan.
Toast tidak menutupi navigation penting terlalu lama.
Maksimal 4 toast terlihat.
```

Jika top-right terlalu mengganggu mobile, Sonner akan tetap menyesuaikan lebar, tetapi pastikan pengujian dilakukan pada viewport 320px.

---

### 26. Accessibility Requirements

Toast harus:

```txt
Tidak hanya menggunakan warna sebagai penanda.
Memiliki teks yang menjelaskan hasil aksi.
Close button dapat digunakan keyboard.
Tidak menyampaikan field validation hanya melalui toast.
Tidak menampilkan terlalu banyak toast secara bersamaan.
```

Jangan membuat toast untuk setiap perubahan kecil karena dapat mengganggu screen reader.

---

### 27. Test Mutation Invalidation

Pastikan penambahan toast tidak menghapus query invalidation.

Contoh:

```ts
onSuccess: async (result) => {
  if (!result.success) {
    toast.error(result.message);
    return;
  }

  toast.success(toastMessages.task.createSuccess);

  await queryClient.invalidateQueries({
    queryKey: tasksQueryKey,
  });
};
```

Query invalidation tetap harus berjalan setelah success.

---

### 28. Run Checks

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

```txt
components/
└── providers/
    └── toast-provider.tsx

hooks/
└── use-action-toast.ts

lib/
└── toast-messages.ts
```

Existing mutation hooks dan form components ikut diperbarui untuk menggunakan toast.

## Acceptance Criteria

- Package Sonner terpasang.
- Global ToastProvider tersedia.
- ToastProvider hanya dipasang satu kali.
- Toast dapat digunakan dari seluruh Client Component.
- Toast success tampil setelah create berhasil.
- Toast success tampil setelah update berhasil.
- Toast success tampil setelah delete berhasil.
- Toast error tampil ketika action mengembalikan `success: false`.
- Toast error tampil ketika mutation mengalami exception.
- Subject mutations menggunakan toast.
- Study plan mutations menggunakan toast.
- Task mutations menggunakan toast.
- Task status mutation menggunakan toast.
- Study session mutations menggunakan toast.
- Settings update menggunakan toast.
- AI generate menggunakan loading toast.
- AI save menggunakan loading toast.
- Loading toast AI berubah menjadi success atau error.
- Register menggunakan toast.
- Login error menggunakan toast.
- Field validation error tetap inline.
- Query error tetap menggunakan ErrorState.
- Empty state tidak menggunakan toast.
- Dialog hanya tertutup setelah mutation berhasil.
- Form hanya reset setelah mutation berhasil.
- Query invalidation tetap berjalan.
- Tidak ada duplicate success toast.
- Tidak ada duplicate error toast.
- General inline success message yang duplikat dihapus.
- Technical error tidak ditampilkan kepada user.
- NVIDIA provider error tidak mengekspos data internal.
- Toast responsive pada mobile.
- Toast close button dapat digunakan.
- Maksimal jumlah visible toast dibatasi.
- Tidak ada API route baru.
- Tidak ada schema database yang diubah.
- Tidak ada shadcn/ui yang ditambahkan.
- Tidak ada folder di dalam `src/`.
- Tidak ada error TypeScript.
- Tidak ada error lint.
- `pnpm format:check` berhasil.
- `pnpm build` berhasil.

## Testing Checklist

### 1. Test Global Toaster

Jalankan aplikasi:

```bash
pnpm dev
```

Trigger satu mutation.

Expected:

```txt
Toast tampil di kanan atas.
Toast memiliki close button.
Toast tidak muncul dua kali.
```

---

### 2. Test Create Subject

Buat subject baru.

Expected:

```txt
Toast success tampil.
Subject list ter-update.
Form reset.
Tidak ada duplicate inline success message.
```

---

### 3. Test Subject Validation Error

Submit subject dengan nama terlalu pendek.

Expected:

```txt
Validation error tampil di bawah field.
Tidak muncul banyak toast validation.
Server action tidak dipanggil jika client validation gagal.
```

---

### 4. Test Duplicate Subject

Buat subject dengan nama yang sudah digunakan.

Expected:

```txt
Toast error tampil menggunakan message dari server.
Form tidak reset.
Data tidak bertambah.
```

---

### 5. Test Study Plan CRUD

Test create, update, dan delete.

Expected:

```txt
Toast sesuai aksi tampil.
Dialog update/delete hanya tertutup setelah berhasil.
Query study plan ter-update.
```

---

### 6. Test Task Status Update

Ubah status task.

Expected:

```txt
Hanya satu toast success tampil.
Status task berubah.
Progress study plan ikut update.
```

---

### 7. Test Study Session CRUD

Test create, update, dan delete.

Expected:

```txt
Toast success tampil.
Analytics dan dashboard tetap ter-update.
```

---

### 8. Test Settings Update

Update nama atau email.

Expected:

```txt
Toast success tampil.
Inline success message duplikat tidak tampil.
Current user query ter-update.
```

Gunakan duplicate email.

Expected:

```txt
Toast error dari server tampil.
Form tidak reset.
```

---

### 9. Test AI Generation

Generate AI Study Plan.

Expected:

```txt
Loading toast tampil.
Hanya satu toast aktif untuk proses generate.
Loading toast berubah menjadi success.
Preview muncul.
```

---

### 10. Test AI Failure

Gunakan API key salah atau simulasikan provider gagal.

Expected:

```txt
Loading toast berubah menjadi error.
Tidak muncul loading toast yang tertinggal.
API key dan provider response internal tidak tampil.
Form input tetap tersedia.
```

---

### 11. Test Save Generated Plan

Klik Save to StudyFlow.

Expected:

```txt
Loading toast tampil.
Toast berubah menjadi success.
Study plan dan tasks tersimpan.
Query study plan dan task ter-update.
```

---

### 12. Test Network/Unexpected Error

Simulasikan exception.

Expected:

```txt
Toast unexpected error tampil.
Tidak ada stack trace.
Button kembali aktif setelah mutation selesai.
```

---

### 13. Test Mobile Toast

Gunakan viewport:

```txt
320 × 568
375 × 667
390 × 844
```

Expected:

```txt
Toast tidak keluar viewport.
Text dapat wrap.
Close button mudah ditekan.
Tidak ada horizontal overflow.
```

---

### 14. Test Duplicate Click

Klik tombol submit beberapa kali dengan cepat.

Expected:

```txt
Button disabled saat pending.
Hanya satu mutation dari UI.
Hanya satu toast tampil.
```

---

### 15. Test Accessibility

Gunakan keyboard:

```txt
Tab ke close button.
Tekan Enter untuk menutup toast.
```

Expected:

```txt
Toast dapat ditutup menggunakan keyboard.
Pesan tetap dapat dipahami tanpa hanya mengandalkan warna.
```

---

### 16. Run Checks

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

- Toast dipakai untuk feedback global, bukan field validation.
- Query error tetap menggunakan ErrorState.
- Empty state tetap menggunakan EmptyState.
- Loading skeleton tidak diganti toast.
- Mutation hook menjadi sumber utama toast.
- Jangan menampilkan toast yang sama dari hook dan component.
- Jangan menampilkan technical error.
- Jangan expose NVIDIA API response internal.
- Loading toast wajib diselesaikan menjadi success atau error.
- Inline feedback masih boleh digunakan untuk pesan yang harus tetap terlihat.
- Notification center dan persistent notification dibuat di issue terpisah.

## Suggested Commit Message

```bash
feat: add global toast notifications
```
