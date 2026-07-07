# ISSUE-006 — Build Dashboard Navigation and Responsive Sidebar

## Status

Planned

## Priority

High

## Type

Feature / Dashboard Layout

## Summary

Membangun dashboard navigation yang lebih lengkap dan responsive untuk StudyFlow. Issue ini fokus pada sidebar desktop, mobile navigation, active route state, dashboard topbar, user session display, dan logout button.

Issue ini tidak membuat fitur CRUD. Tujuan utamanya adalah menyiapkan layout dashboard yang siap dipakai untuk fitur berikutnya seperti Subject Management, Study Plan Management, Task Management, Study Session Tracker, dan Analytics.

## Background

Project StudyFlow sudah memiliki:

```txt
Next.js App Router
Custom Tailwind components
Radix UI primitives
Auth.js authentication
Drizzle PostgreSQL schema
TanStack Query setup
Basic dashboard page
```

Saat ini dashboard membutuhkan layout yang lebih production-ready agar halaman-halaman berikutnya bisa konsisten.

Dashboard navigation harus mendukung:

```txt
Desktop sidebar
Mobile sidebar drawer
Active navigation state
Dashboard topbar
User info
Logout button
Responsive layout
```

## Goals

- Membuat dashboard layout yang reusable.
- Membuat sidebar desktop dengan active state.
- Membuat mobile sidebar drawer menggunakan Radix Dialog.
- Membuat dashboard topbar.
- Menampilkan nama/email user dari session.
- Menambahkan logout button di dashboard.
- Membuat navigation constants lebih rapi.
- Membuat dashboard route group layout.
- Membuat placeholder pages untuk semua menu dashboard.
- Memastikan semua dashboard page protected.
- Memastikan layout responsive untuk mobile, tablet, dan desktop.

## Non-Goals

- Tidak membuat CRUD subject.
- Tidak membuat CRUD study plan.
- Tidak membuat CRUD task.
- Tidak membuat CRUD study session.
- Tidak membuat chart analytics real.
- Tidak membuat API endpoint baru.
- Tidak membuat Server Actions baru selain jika diperlukan untuk logout.
- Tidak mengubah schema database.
- Tidak mengubah auth flow utama.
- Tidak menambahkan shadcn/ui.
- Tidak menambahkan role-based admin layout.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Radix Dialog
- Lucide React
- Auth.js
- Custom UI Components

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
app/
├── dashboard/
│   ├── analytics/
│   │   └── page.tsx
│   ├── plans/
│   │   └── page.tsx
│   ├── sessions/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   ├── subjects/
│   │   └── page.tsx
│   ├── tasks/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx

components/
└── layout/
    ├── dashboard-layout.tsx
    ├── dashboard-sidebar.tsx
    ├── dashboard-mobile-sidebar.tsx
    ├── dashboard-topbar.tsx
    └── dashboard-nav-item.tsx

constants/
└── navigation.ts

lib/
└── auth-guard.ts
```

## Dashboard Routes

Buat route dashboard berikut:

```txt
/dashboard
/dashboard/subjects
/dashboard/plans
/dashboard/tasks
/dashboard/sessions
/dashboard/analytics
/dashboard/settings
```

Menu yang tampil di sidebar:

```txt
Overview
Subjects
Study Plans
Tasks
Sessions
Analytics
Settings
```

## Implementation Steps

### 1. Update Dashboard Navigation Constants

Edit file:

```txt
constants/navigation.ts
```

Pastikan `dashboardNavItems` memiliki data berikut:

```ts
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Settings,
  Timer,
} from "lucide-react";

export const dashboardNavItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Subjects",
    href: "/dashboard/subjects",
    icon: BookOpen,
  },
  {
    label: "Study Plans",
    href: "/dashboard/plans",
    icon: CalendarDays,
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    label: "Sessions",
    href: "/dashboard/sessions",
    icon: Timer,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];
```

---

### 2. Create Dashboard Nav Item Component

Buat file:

```txt
components/layout/dashboard-nav-item.tsx
```

Isi:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

type DashboardNavItemProps = {
  label: string;
  href: string;
  icon: LucideIcon;
  onClick?: () => void;
};

export function DashboardNavItem({ label, href, icon: Icon, onClick }: DashboardNavItemProps) {
  const pathname = usePathname();

  const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
        isActive
          ? "bg-slate-950 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
```

---

### 3. Update Dashboard Sidebar

Edit atau buat file:

```txt
components/layout/dashboard-sidebar.tsx
```

Isi:

```tsx
import Link from "next/link";

import { dashboardNavItems } from "@/constants/navigation";
import { DashboardNavItem } from "@/components/layout/dashboard-nav-item";

export function DashboardSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-6 lg:block">
      <div className="mb-8 px-3">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight text-slate-950">
          StudyFlow
        </Link>
        <p className="mt-1 text-sm text-slate-500">Learning dashboard</p>
      </div>

      <nav className="space-y-1">
        {dashboardNavItems.map((item) => (
          <DashboardNavItem key={item.href} {...item} />
        ))}
      </nav>
    </aside>
  );
}
```

---

### 4. Create Dashboard Mobile Sidebar

Buat file:

```txt
components/layout/dashboard-mobile-sidebar.tsx
```

Isi:

```tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { dashboardNavItems } from "@/constants/navigation";
import { DashboardNavItem } from "@/components/layout/dashboard-nav-item";
import { Button } from "@/components/ui/button";

export function DashboardMobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Menu className="h-4 w-4" />
          Menu
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" />

        <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] border-r border-slate-200 bg-white p-5 shadow-xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-xl font-bold tracking-tight text-slate-950"
              >
                StudyFlow
              </Link>
              <p className="mt-1 text-sm text-slate-500">Learning dashboard</p>
            </div>

            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" aria-label="Close menu">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          <nav className="space-y-1">
            {dashboardNavItems.map((item) => (
              <DashboardNavItem key={item.href} {...item} onClick={() => setOpen(false)} />
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

---

### 5. Create Dashboard Topbar

Buat file:

```txt
components/layout/dashboard-topbar.tsx
```

Isi:

```tsx
import { LogoutButton } from "@/features/auth/components/logout-button";
import { DashboardMobileSidebar } from "@/components/layout/dashboard-mobile-sidebar";

type DashboardTopbarProps = {
  title: string;
  description?: string;
  user?: {
    name?: string | null;
    email?: string | null;
  };
};

export function DashboardTopbar({ title, description, user }: DashboardTopbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <DashboardMobileSidebar />

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">
              {description ?? "StudyFlow Dashboard"}
            </p>
            <h1 className="truncate text-xl font-semibold tracking-tight text-slate-950">
              {title}
            </h1>
          </div>
        </div>

        <div className="hidden items-center gap-4 sm:flex">
          {user ? (
            <div className="text-right">
              <p className="text-sm font-medium text-slate-950">{user.name ?? "User"}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          ) : null}

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
```

---

### 6. Create Dashboard Layout Component

Buat file:

```txt
components/layout/dashboard-layout.tsx
```

Isi:

```tsx
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

type DashboardLayoutProps = {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
  };
};

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="min-w-0 flex-1">
          <DashboardTopbar title="Dashboard" description="Your learning overview" user={user} />

          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
```

Catatan:

- Title dashboard masih global.
- Dynamic title per page bisa dibuat di issue berikutnya.
- Untuk MVP, ini sudah cukup.

---

### 7. Create Dashboard Route Layout

Buat file:

```txt
app/dashboard/layout.tsx
```

Isi:

```tsx
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { requireUser } from "@/lib/auth-guard";

type DashboardRouteLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardRouteLayout({ children }: DashboardRouteLayoutProps) {
  const user = await requireUser();

  return (
    <DashboardLayout
      user={{
        name: user.name,
        email: user.email,
      }}
    >
      {children}
    </DashboardLayout>
  );
}
```

Tujuan:

- Semua route di dalam `/dashboard` otomatis protected.
- Tidak perlu membungkus setiap page dengan dashboard shell manual.
- Dashboard layout konsisten di semua page.

---

### 8. Refactor Dashboard Page

Edit file:

```txt
app/dashboard/page.tsx
```

Hapus wrapper `DashboardShell` lama jika masih ada.

Page cukup berisi content:

```tsx
import { BookOpen, CalendarDays, CheckSquare, Timer } from "lucide-react";

import { StatCard } from "@/components/common/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const dashboardStats = [
  {
    label: "Study Hours",
    value: "8.5h",
    description: "Tracked this week",
    icon: Timer,
  },
  {
    label: "Active Plans",
    value: "3",
    description: "Currently in progress",
    icon: CalendarDays,
  },
  {
    label: "Completed Tasks",
    value: "12",
    description: "Finished this week",
    icon: CheckSquare,
  },
  {
    label: "Subjects",
    value: "5",
    description: "Learning categories",
    icon: BookOpen,
  },
];

export default function DashboardPage() {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Study Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid h-72 grid-cols-7 items-end gap-3">
              {[40, 70, 50, 90, 65, 80, 55].map((height, index) => (
                <div
                  key={index}
                  className="rounded-full bg-gradient-to-t from-indigo-600 to-cyan-400"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Next.js Fullstack</p>
                <p className="text-sm font-semibold text-slate-950">72%</p>
              </div>
              <Progress value={72} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Django API Integration</p>
                <p className="text-sm font-semibold text-slate-950">48%</p>
              </div>
              <Progress value={48} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Database Design</p>
                <p className="text-sm font-semibold text-slate-950">86%</p>
              </div>
              <Progress value={86} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
```

---

### 9. Create Placeholder Dashboard Pages

Buat halaman placeholder berikut:

```txt
app/dashboard/subjects/page.tsx
app/dashboard/plans/page.tsx
app/dashboard/tasks/page.tsx
app/dashboard/sessions/page.tsx
app/dashboard/analytics/page.tsx
app/dashboard/settings/page.tsx
```

Contoh isi untuk `subjects/page.tsx`:

```tsx
import { Card } from "@/components/ui/card";

export default function SubjectsPage() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">Subjects</h2>
      <p className="mt-2 text-sm text-slate-500">
        Subject management will be implemented in the next issue.
      </p>
    </Card>
  );
}
```

Gunakan pola yang sama untuk page lain.

Copy placeholder:

```txt
Study Plans management will be implemented in the next issue.
Task management will be implemented in the next issue.
Study session tracker will be implemented in the next issue.
Analytics dashboard will be implemented in the next issue.
Settings page will be implemented in the next issue.
```

---

### 10. Remove Old Dashboard Shell If Unused

Jika file lama masih ada:

```txt
components/layout/dashboard-shell.tsx
```

Cek apakah masih dipakai.

Jika sudah tidak dipakai, boleh:

```txt
Hapus file dashboard-shell.tsx
```

Atau biarkan dulu jika masih ingin dipakai nanti.

Acceptance penting:

```txt
Tidak boleh ada dua layout dashboard yang membungkus halaman secara bersamaan.
```

---

### 11. Test Responsive Behavior

Cek viewport:

```txt
Mobile: 375px
Tablet: 768px
Desktop: 1024px+
```

Expected:

```txt
Mobile menampilkan tombol Menu.
Mobile sidebar muncul sebagai drawer.
Desktop menampilkan sidebar permanen.
Desktop tidak menampilkan tombol Menu.
Content tidak overflow horizontal.
```

---

## Expected Folder Structure

Setelah issue selesai:

```txt
app/
└── dashboard/
    ├── analytics/
    │   └── page.tsx
    ├── plans/
    │   └── page.tsx
    ├── sessions/
    │   └── page.tsx
    ├── settings/
    │   └── page.tsx
    ├── subjects/
    │   └── page.tsx
    ├── tasks/
    │   └── page.tsx
    ├── layout.tsx
    └── page.tsx

components/
└── layout/
    ├── dashboard-layout.tsx
    ├── dashboard-mobile-sidebar.tsx
    ├── dashboard-nav-item.tsx
    ├── dashboard-sidebar.tsx
    └── dashboard-topbar.tsx
```

## Acceptance Criteria

- Dashboard layout tersedia di `app/dashboard/layout.tsx`.
- Semua route `/dashboard/*` otomatis menggunakan dashboard layout.
- Dashboard route tetap protected.
- User yang belum login diarahkan ke `/login`.
- Sidebar desktop tampil di layar besar.
- Mobile sidebar drawer tampil di layar kecil.
- Active nav state berjalan.
- Menu aktif berubah sesuai pathname.
- Dashboard topbar tampil.
- Nama/email user tampil di topbar.
- Logout button tersedia di dashboard.
- Placeholder page `/dashboard/subjects` tersedia.
- Placeholder page `/dashboard/plans` tersedia.
- Placeholder page `/dashboard/tasks` tersedia.
- Placeholder page `/dashboard/sessions` tersedia.
- Placeholder page `/dashboard/analytics` tersedia.
- Placeholder page `/dashboard/settings` tersedia.
- Tidak ada fitur CRUD dibuat pada issue ini.
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
Dashboard tampil dengan sidebar, topbar, user info, dan content utama.
```

---

### 2. Test Protected Dashboard

Saat belum login, buka:

```txt
http://localhost:3000/dashboard
```

Expected:

```txt
User diarahkan ke /login.
```

---

### 3. Test Desktop Sidebar

Buka dashboard pada viewport desktop.

Expected:

```txt
Sidebar tampil permanen di kiri.
Menu dashboard terlihat lengkap.
Active route terlihat jelas.
```

---

### 4. Test Mobile Sidebar

Buka dashboard pada viewport mobile.

Expected:

```txt
Sidebar desktop hilang.
Tombol Menu tampil di topbar.
Klik Menu membuka drawer sidebar.
Klik menu di drawer menutup drawer dan pindah halaman.
```

---

### 5. Test Dashboard Routes

Cek route:

```txt
/dashboard
/dashboard/subjects
/dashboard/plans
/dashboard/tasks
/dashboard/sessions
/dashboard/analytics
/dashboard/settings
```

Expected:

```txt
Semua route bisa dibuka setelah login.
Semua route memakai layout dashboard yang sama.
Active nav state sesuai route.
```

---

### 6. Test Logout

Klik logout.

Expected:

```txt
Session terhapus.
User diarahkan ke /login.
User tidak bisa membuka /dashboard tanpa login ulang.
```

---

### 7. Run Checks

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

- Jangan membuat CRUD di issue ini.
- Jangan mengambil data subject/plan/task dari database dulu.
- Jangan membuat chart real.
- Jangan mengubah schema database.
- Jangan menambahkan shadcn/ui.
- Gunakan custom Tailwind components.
- Gunakan Radix Dialog untuk mobile sidebar.
- Gunakan Auth.js session dari `requireUser`.
- Jika layout lama `DashboardShell` masih ada, pastikan tidak menyebabkan double wrapper.
- Dashboard content real akan dibuat mulai issue berikutnya.

## Suggested Commit Message

```bash
feat: build dashboard navigation and responsive sidebar
```
