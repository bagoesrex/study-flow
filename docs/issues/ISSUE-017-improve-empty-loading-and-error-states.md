# ISSUE-017 — Improve Empty, Loading, and Error States

## Status

Planned

## Priority

Medium

## Type

UI/UX Improvement / Reliability

## Summary

Meningkatkan empty state, loading state, error state, dan feedback state di seluruh halaman StudyFlow agar aplikasi terasa konsisten, responsif, dan production-ready.

Saat ini masing-masing fitur sudah memiliki state dasar, tetapi implementasinya masih tersebar dan menggunakan tampilan berbeda-beda.

Issue ini akan membuat reusable state components yang dapat digunakan di seluruh aplikasi.

## Background

StudyFlow sudah memiliki beberapa halaman utama:

```txt
/dashboard
/dashboard/subjects
/dashboard/plans
/dashboard/tasks
/dashboard/sessions
/dashboard/calendar
/dashboard/analytics
/dashboard/ai
/dashboard/settings
```

Masing-masing halaman dapat mengalami kondisi:

```txt
Data belum tersedia
Data sedang dimuat
Request gagal
Mutation sedang diproses
Form berhasil disimpan
Akses tidak ditemukan
```

Tanpa state yang konsisten, pengalaman user terasa tidak stabil dan beberapa halaman dapat menampilkan layout kosong tanpa arahan yang jelas.

## Goals

- Membuat reusable empty state component.
- Membuat reusable loading skeleton component.
- Membuat reusable error state component.
- Membuat reusable inline feedback message.
- Menambahkan retry button pada query error.
- Membuat loading state yang sesuai dengan bentuk konten.
- Menonaktifkan tombol saat mutation berjalan.
- Menampilkan loading text dan spinner pada mutation.
- Menampilkan empty state dengan CTA yang relevan.
- Menampilkan pesan error yang mudah dipahami.
- Menghindari menampilkan technical error kepada user.
- Menjaga tampilan konsisten di semua halaman.
- Meningkatkan accessibility untuk loading dan error state.
- Menghindari duplicate state component pada setiap feature.

## Non-Goals

- Tidak membuat sistem toast global.
- Tidak membuat custom error tracking.
- Tidak mengintegrasikan Sentry.
- Tidak membuat offline mode.
- Tidak membuat optimistic update.
- Tidak membuat retry otomatis berkali-kali.
- Tidak membuat custom 404 dan 500 page global.
- Tidak mengubah schema database.
- Tidak mengubah business logic CRUD.
- Tidak membuat API route baru.
- Tidak menambahkan shadcn/ui.

## Affected Routes

```txt
/dashboard
/dashboard/subjects
/dashboard/plans
/dashboard/tasks
/dashboard/sessions
/dashboard/calendar
/dashboard/analytics
/dashboard/ai
/dashboard/settings
/login
/register
```

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
components/
├── common/
│   ├── empty-state.tsx
│   ├── error-state.tsx
│   ├── feedback-message.tsx
│   ├── loading-spinner.tsx
│   └── page-loading-state.tsx
└── skeletons/
    ├── card-grid-skeleton.tsx
    ├── dashboard-skeleton.tsx
    ├── form-skeleton.tsx
    ├── list-skeleton.tsx
    └── stat-card-skeleton.tsx

app/
├── dashboard/
│   └── loading.tsx
└── error.tsx
```

File yang kemungkinan diperbarui:

```txt
features/subjects/components/subject-list.tsx
features/study-plans/components/study-plan-list.tsx
features/tasks/components/task-list.tsx
features/study-sessions/components/study-session-list.tsx
features/analytics/*
features/calendar/*
features/ai-study-plan/*
features/settings/*
app/dashboard/page.tsx
app/login/page.tsx
app/register/page.tsx
```

## State Design Guidelines

Gunakan aturan berikut:

```txt
Empty state:
Icon + title + description + optional CTA

Loading state:
Skeleton yang menyerupai layout asli

Error state:
Title + user-friendly message + optional retry button

Mutation loading:
Disable button + spinner + action label

Success/error feedback:
Inline message sementara sampai toast global dibuat
```

Hindari:

```txt
Menampilkan JSON error
Menampilkan stack trace
Hanya menampilkan teks "Loading..."
Hanya menampilkan teks "Error"
Skeleton dengan layout yang sangat berbeda dari konten asli
Tombol tetap aktif saat mutation berjalan
```

## Implementation Steps

### 1. Create Loading Spinner

Buat file:

```txt
components/common/loading-spinner.tsx
```

Isi:

```tsx
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/cn";

type LoadingSpinnerProps = {
  className?: string;
  label?: string;
};

export function LoadingSpinner({ className, label = "Loading" }: LoadingSpinnerProps) {
  return (
    <span role="status" aria-label={label} className="inline-flex items-center justify-center">
      <LoaderCircle className={cn("h-4 w-4 animate-spin", className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
```

---

### 2. Create Reusable Empty State

Buat file:

```txt
components/common/empty-state.tsx
```

Isi:

```tsx
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <Card className={cn("flex flex-col items-center justify-center p-10 text-center", className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>

      {action ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{action}</div>
      ) : null}
    </Card>
  );
}
```

---

### 3. Create Reusable Error State

Buat file:

```txt
components/common/error-state.tsx
```

Isi:

```tsx
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ErrorStateProps = {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  message = "Data gagal dimuat. Silakan coba lagi.",
  retryLabel = "Try Again",
  onRetry,
}: ErrorStateProps) {
  return (
    <Card role="alert" className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{message}</p>

      {onRetry ? (
        <Button type="button" variant="outline" className="mt-6" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </Card>
  );
}
```

---

### 4. Create Feedback Message

Buat file:

```txt
components/common/feedback-message.tsx
```

Isi:

```tsx
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import { cn } from "@/lib/cn";

type FeedbackMessageVariant = "success" | "error" | "info";

type FeedbackMessageProps = {
  variant: FeedbackMessageVariant;
  message: string;
  className?: string;
};

const variants = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  error: {
    icon: AlertCircle,
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
};

export function FeedbackMessage({ variant, message, className }: FeedbackMessageProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
        config.className,
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
```

---

### 5. Create Page Loading State

Buat file:

```txt
components/common/page-loading-state.tsx
```

Isi:

```tsx
import { LoadingSpinner } from "@/components/common/loading-spinner";

type PageLoadingStateProps = {
  title?: string;
  description?: string;
};

export function PageLoadingState({
  title = "Loading",
  description = "Please wait while we prepare your data.",
}: PageLoadingStateProps) {
  return (
    <div
      role="status"
      className="flex min-h-[320px] flex-col items-center justify-center text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <LoadingSpinner className="h-6 w-6" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
```

Gunakan skeleton untuk halaman yang layout-nya sudah diketahui. Gunakan `PageLoadingState` hanya jika skeleton khusus belum tersedia.

---

### 6. Create Card Grid Skeleton

Buat file:

```txt
components/skeletons/card-grid-skeleton.tsx
```

Isi:

```tsx
import { Card } from "@/components/ui/card";

type CardGridSkeletonProps = {
  count?: number;
  className?: string;
};

export function CardGridSkeleton({
  count = 4,
  className = "md:grid-cols-2",
}: CardGridSkeletonProps) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="space-y-4 p-5">
          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-100" />
          <div className="h-6 w-3/4 animate-pulse rounded-lg bg-slate-100" />
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100" />
          </div>
          <div className="h-2 w-full animate-pulse rounded-full bg-slate-100" />
        </Card>
      ))}
    </div>
  );
}
```

---

### 7. Create List Skeleton

Buat file:

```txt
components/skeletons/list-skeleton.tsx
```

Isi:

```tsx
import { Card } from "@/components/ui/card";

type ListSkeletonProps = {
  count?: number;
};

export function ListSkeleton({ count = 5 }: ListSkeletonProps) {
  return (
    <Card className="p-5">
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
          >
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-100" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
              <div className="h-3 w-1/3 animate-pulse rounded-full bg-slate-100" />
            </div>

            <div className="h-7 w-20 animate-pulse rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    </Card>
  );
}
```

---

### 8. Create Stat Card Skeleton

Buat file:

```txt
components/skeletons/stat-card-skeleton.tsx
```

Isi:

```tsx
import { Card } from "@/components/ui/card";

type StatCardSkeletonProps = {
  count?: number;
};

export function StatCardSkeleton({ count = 4 }: StatCardSkeletonProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="space-y-4 p-5">
          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-100" />
          <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-3 w-32 animate-pulse rounded-full bg-slate-100" />
        </Card>
      ))}
    </div>
  );
}
```

---

### 9. Create Form Skeleton

Buat file:

```txt
components/skeletons/form-skeleton.tsx
```

Isi:

```tsx
import { Card } from "@/components/ui/card";

type FormSkeletonProps = {
  fields?: number;
};

export function FormSkeleton({ fields = 4 }: FormSkeletonProps) {
  return (
    <Card className="space-y-5 p-6">
      <div className="space-y-2">
        <div className="h-5 w-40 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-64 animate-pulse rounded-full bg-slate-100" />
      </div>

      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
        </div>
      ))}

      <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-100" />
    </Card>
  );
}
```

---

### 10. Create Dashboard Skeleton

Buat file:

```txt
components/skeletons/dashboard-skeleton.tsx
```

Isi:

```tsx
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
import { ListSkeleton } from "@/components/skeletons/list-skeleton";
import { StatCardSkeleton } from "@/components/skeletons/stat-card-skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-4 w-80 animate-pulse rounded-full bg-slate-100" />
      </div>

      <StatCardSkeleton />

      <CardGridSkeleton count={2} />

      <ListSkeleton />
    </div>
  );
}
```

---

### 11. Add Dashboard Loading Route

Buat file:

```txt
app/dashboard/loading.tsx
```

Isi:

```tsx
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

export default function DashboardLoading() {
  return <DashboardSkeleton />;
}
```

Ini digunakan saat Next.js sedang melakukan navigasi atau memuat Server Component di dalam dashboard.

---

### 12. Add Global Route Error Boundary

Buat file:

```txt
app/error.tsx
```

Isi:

```tsx
"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/common/error-state";

type GlobalErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6">
      <div className="w-full">
        <ErrorState
          title="Aplikasi mengalami masalah"
          message="Terjadi kesalahan saat memuat halaman. Silakan coba kembali."
          onRetry={reset}
        />
      </div>
    </main>
  );
}
```

Catatan:

- Jangan tampilkan `error.message` langsung kepada user.
- Logging ke console masih diperbolehkan untuk development.
- Error monitoring eksternal dibuat di issue terpisah.

---

### 13. Refactor Subject States

Edit:

```txt
features/subjects/components/subject-list.tsx
```

Loading:

```tsx
if (query.isLoading) {
  return <CardGridSkeleton />;
}
```

Error:

```tsx
if (query.isError) {
  return (
    <ErrorState
      title="Gagal memuat subject"
      message="Subject belum bisa dimuat. Silakan coba kembali."
      onRetry={() => query.refetch()}
    />
  );
}
```

Empty state boleh menggunakan component baru:

```tsx
<EmptyState
  icon={BookOpen}
  title="Belum ada subject"
  description="Buat subject pertama untuk mulai mengatur rencana belajar."
/>
```

Component lama `subject-empty-state.tsx` boleh:

```txt
Dihapus dan diganti reusable EmptyState
atau
Tetap dipakai sebagai wrapper dari reusable EmptyState
```

---

### 14. Refactor Study Plan States

Edit:

```txt
features/study-plans/components/study-plan-list.tsx
```

Gunakan:

```tsx
<CardGridSkeleton />
```

Untuk error:

```tsx
<ErrorState
  title="Gagal memuat study plan"
  message="Study plan belum bisa dimuat. Silakan coba kembali."
  onRetry={() => query.refetch()}
/>
```

Empty state harus tetap memiliki CTA ke pembuatan subject jika subject belum tersedia.

---

### 15. Refactor Task States

Edit:

```txt
features/tasks/components/task-list.tsx
```

Gunakan skeleton reusable.

Error state harus memiliki retry:

```tsx
<ErrorState
  title="Gagal memuat task"
  message="Task belum bisa dimuat. Silakan coba kembali."
  onRetry={() => query.refetch()}
/>
```

Empty state harus memberikan arahan:

```txt
Buat study plan terlebih dahulu jika belum ada plan.
Buat task pertama jika plan sudah tersedia.
```

---

### 16. Refactor Study Session States

Edit:

```txt
features/study-sessions/components/study-session-list.tsx
```

Loading menggunakan card grid skeleton.

Error menggunakan reusable `ErrorState`.

Empty state memberikan CTA ke:

```txt
/dashboard/sessions
/dashboard/subjects
```

Jangan menampilkan tombol yang mengarah ke route saat ini tanpa fungsi yang jelas.

---

### 17. Refactor Analytics States

Edit halaman atau component analytics.

Loading:

```tsx
<>
  <StatCardSkeleton count={6} />
  <CardGridSkeleton count={4} />
</>
```

Error:

```tsx
<ErrorState
  title="Gagal memuat analytics"
  message="Data analytics belum bisa dihitung. Silakan coba kembali."
  onRetry={() => query.refetch()}
/>
```

Empty analytics tetap berbeda dari error:

```txt
Empty = data memang belum tersedia.
Error = request gagal.
```

---

### 18. Refactor AI Generator States

Pada form AI generator:

```txt
Generate button disabled saat mutation.isPending.
Save button disabled saat mutation.isPending.
```

Contoh tombol generate:

```tsx
<Button type="submit" disabled={mutation.isPending}>
  {mutation.isPending ? (
    <>
      <LoadingSpinner />
      Generating...
    </>
  ) : (
    "Generate Study Plan"
  )}
</Button>
```

Error generate:

```tsx
{
  mutation.data && !mutation.data.success ? (
    <FeedbackMessage variant="error" message={mutation.data.message} />
  ) : null;
}
```

Save success:

```tsx
{
  saveMutation.data?.success ? (
    <FeedbackMessage variant="success" message="Generated study plan berhasil disimpan." />
  ) : null;
}
```

Saat generating, jangan hapus preview lama secara otomatis kecuali generate baru berhasil.

---

### 19. Refactor Settings Form State

Pada profile settings:

```txt
Disable submit ketika mutation pending.
Tampilkan spinner.
Tampilkan inline success message.
Tampilkan inline error message.
```

Gunakan:

```tsx
<FeedbackMessage />
```

Hindari success message tetap tampil saat user mulai mengubah form lagi.

Reset success state saat form berubah atau saat submit baru dimulai.

---

### 20. Refactor Authentication Forms

Pada login dan register:

```txt
Disable tombol saat pending.
Tampilkan spinner.
Tampilkan error credential dalam FeedbackMessage.
Jangan tampilkan exception teknis.
Pertahankan nilai input ketika login gagal.
```

Contoh:

```tsx
<Button type="submit" disabled={mutation.isPending}>
  {mutation.isPending ? (
    <>
      <LoadingSpinner />
      Signing in...
    </>
  ) : (
    "Sign In"
  )}
</Button>
```

Pesan error yang direkomendasikan:

```txt
Email atau password tidak valid.
Registrasi gagal. Silakan periksa data yang dimasukkan.
```

---

### 21. Prevent Duplicate Submission

Pastikan semua mutation button menggunakan:

```tsx
disabled={mutation.isPending}
```

Affected mutation:

```txt
Register
Login
Create subject
Update subject
Delete subject
Create study plan
Update study plan
Delete study plan
Create task
Update task
Update task status
Delete task
Create session
Update session
Delete session
Update profile
Generate AI plan
Save AI plan
```

Server tetap harus menangani duplicate request dengan aman, tetapi UI wajib mencegah klik berulang.

---

### 22. TanStack Query Retry Policy

Update Query Provider jika diperlukan.

Contoh:

```tsx
const [queryClient] = useState(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
          staleTime: 30_000,
        },
        mutations: {
          retry: 0,
        },
      },
    })
);
```

Rules:

```txt
Query boleh retry maksimal 1 kali.
Mutation tidak retry otomatis.
User dapat menekan tombol retry secara manual.
```

Jangan gunakan retry tinggi untuk Server Actions karena dapat menyebabkan request berulang yang tidak perlu.

---

### 23. Accessibility Requirements

Semua state wajib memperhatikan:

```txt
Loading memiliki role="status"
Error memiliki role="alert"
Icon dekoratif memiliki aria-hidden
Spinner memiliki sr-only label
Button disabled saat proses
Focus tetap dapat diakses menggunakan keyboard
Warna bukan satu-satunya indikator status
```

---

### 24. Run Checks

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
├── common/
│   ├── empty-state.tsx
│   ├── error-state.tsx
│   ├── feedback-message.tsx
│   ├── loading-spinner.tsx
│   └── page-loading-state.tsx
└── skeletons/
    ├── card-grid-skeleton.tsx
    ├── dashboard-skeleton.tsx
    ├── form-skeleton.tsx
    ├── list-skeleton.tsx
    └── stat-card-skeleton.tsx

app/
├── dashboard/
│   └── loading.tsx
└── error.tsx
```

Existing feature files ikut diperbarui agar memakai reusable state components.

## Acceptance Criteria

- Reusable empty state component tersedia.
- Reusable error state component tersedia.
- Reusable loading spinner tersedia.
- Reusable feedback message tersedia.
- Reusable skeleton components tersedia.
- Dashboard route memiliki `loading.tsx`.
- Global route error boundary tersedia.
- Subject list menggunakan loading skeleton.
- Subject list memiliki retry error state.
- Study plan list menggunakan loading skeleton.
- Study plan list memiliki retry error state.
- Task list menggunakan loading skeleton.
- Task list memiliki retry error state.
- Study session list menggunakan loading skeleton.
- Study session list memiliki retry error state.
- Analytics memiliki loading skeleton.
- Analytics membedakan empty dan error state.
- AI generator menampilkan pending state saat generate.
- AI generator menampilkan pending state saat save.
- Settings form menampilkan pending, error, dan success state.
- Login form mencegah duplicate submit.
- Register form mencegah duplicate submit.
- Semua mutation button disabled saat pending.
- Mutation tidak retry otomatis.
- Query retry maksimal satu kali.
- Technical error tidak ditampilkan langsung kepada user.
- Loading state memiliki accessibility role.
- Error state memiliki accessibility role.
- Empty state memiliki CTA yang relevan jika diperlukan.
- State UI konsisten di seluruh aplikasi.
- Tidak ada API route baru.
- Tidak ada schema database yang diubah.
- Tidak ada shadcn/ui yang ditambahkan.
- Tidak ada folder di dalam `src/`.
- Tidak ada error TypeScript.
- Tidak ada error lint.
- `pnpm format:check` berhasil.
- `pnpm build` berhasil.

## Testing Checklist

### 1. Test Loading State

Gunakan network throttling atau tambahkan delay sementara.

Expected:

```txt
Skeleton tampil saat data dimuat.
Layout tidak melompat secara berlebihan.
Tidak hanya menampilkan teks Loading.
```

---

### 2. Test Query Error

Matikan koneksi database sementara atau simulasi action gagal.

Expected:

```txt
Error state tampil.
Tidak ada stack trace.
Retry button tersedia.
Klik retry menjalankan query kembali.
```

---

### 3. Test Empty State

Gunakan user baru tanpa data.

Expected:

```txt
Empty state tampil.
Title dan description sesuai halaman.
CTA relevan tersedia.
Empty state tidak dianggap error.
```

---

### 4. Test Duplicate Submission

Klik tombol create/save beberapa kali dengan cepat.

Expected:

```txt
Button langsung disabled.
Hanya satu mutation yang diproses dari UI.
Spinner dan loading label tampil.
```

---

### 5. Test Login Failure

Gunakan password salah.

Expected:

```txt
Pesan error user-friendly tampil.
Email tetap terisi.
Password boleh dikosongkan setelah gagal.
Tidak ada technical error.
```

---

### 6. Test AI Generate Loading

Generate study plan menggunakan NVIDIA provider.

Expected:

```txt
Tombol generate disabled.
Spinner tampil.
Label berubah menjadi Generating.
Preview lama tidak hilang sebelum hasil baru berhasil.
```

---

### 7. Test AI Generate Failure

Simulasikan NVIDIA API gagal.

Expected:

```txt
Error feedback tampil.
User dapat mencoba generate lagi.
Form input tidak hilang.
API key atau detail internal tidak ditampilkan.
```

---

### 8. Test Settings Update

Update profile.

Expected:

```txt
Button disabled saat menyimpan.
Success message tampil jika berhasil.
Error message tampil jika gagal.
Tidak ada duplicate request dari UI.
```

---

### 9. Test Accessibility

Periksa dengan keyboard dan browser accessibility tools.

Expected:

```txt
Spinner memiliki status label.
Error memiliki role alert.
Focus button retry dapat diakses.
Disabled button tidak dapat diklik.
```

---

### 10. Run Checks

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

- Jangan membuat toast system pada issue ini.
- Inline feedback dipakai sampai toast global dibuat pada ISSUE-019.
- Jangan menampilkan raw error dari database atau provider AI.
- Empty state, loading state, dan error state memiliki fungsi yang berbeda.
- Gunakan skeleton yang menyerupai konten asli.
- Hindari duplicate components untuk setiap feature.
- Existing feature-specific empty state boleh tetap dipakai sebagai wrapper.
- Jangan mengubah business logic utama.
- Prioritaskan konsistensi dan accessibility.

## Suggested Commit Message

```bash
refactor: improve empty loading and error states
```
