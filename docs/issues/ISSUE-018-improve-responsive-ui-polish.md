# ISSUE-018 — Improve Responsive UI Polish

## Status

Planned

## Priority

Medium

## Type

UI/UX Improvement / Responsive Design

## Summary

Meningkatkan responsive design dan visual consistency di seluruh halaman StudyFlow agar aplikasi nyaman digunakan pada mobile, tablet, laptop, dan desktop.

Issue ini berfokus pada perbaikan layout, spacing, typography, navigation, form, card, modal, chart, serta overflow tanpa mengubah business logic utama.

Target viewport:

```txt
Mobile: 320px–767px
Tablet: 768px–1023px
Desktop: 1024px+
Large desktop: 1440px+
```

## Background

StudyFlow sudah memiliki fitur utama:

```txt
Landing Page
Authentication
Dashboard Overview
Subject Management
Study Plan Management
Task Management
Study Session Tracker
Analytics Dashboard
Calendar Deadline View
AI Study Plan Generator
User Settings
```

Setelah fitur utama selesai, diperlukan tahap responsive polish agar:

- Sidebar tidak mengganggu konten mobile.
- Form tidak terlalu sempit atau terlalu lebar.
- Card tidak mengalami overflow.
- Chart tetap terbaca pada layar kecil.
- Tombol tetap mudah ditekan.
- Modal tetap dapat di-scroll.
- Typography konsisten.
- Layout tidak terlihat terlalu kosong pada desktop.
- Navigasi mudah digunakan di semua ukuran layar.

## Goals

- Memperbaiki responsive layout seluruh dashboard.
- Memperbaiki mobile sidebar.
- Memperbaiki dashboard topbar.
- Menetapkan max-width konten dashboard.
- Menstandarkan spacing antarseksi.
- Memperbaiki card grid pada mobile dan tablet.
- Memperbaiki form layout pada layar kecil.
- Memperbaiki dialog agar tidak keluar viewport.
- Memperbaiki button layout pada mobile.
- Memperbaiki badge wrapping.
- Memperbaiki text truncation.
- Memperbaiki chart responsiveness.
- Memperbaiki navigation usability.
- Memastikan tidak ada horizontal overflow.
- Menstandarkan page header.
- Menstandarkan responsive typography.
- Menjaga visual consistency clean white SaaS StudyFlow.
- Memastikan keyboard dan touch interaction tetap nyaman.

## Non-Goals

- Tidak mengubah schema database.
- Tidak mengubah business logic CRUD.
- Tidak membuat fitur baru.
- Tidak membuat dark mode.
- Tidak mengganti design system secara total.
- Tidak menambahkan shadcn/ui.
- Tidak membuat native mobile app.
- Tidak membuat PWA.
- Tidak membuat animation kompleks.
- Tidak mengganti seluruh warna brand.
- Tidak membuat API route baru.
- Tidak mengubah authentication flow.

## Affected Routes

```txt
/
/login
/register
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

## Design Principles

Gunakan prinsip berikut:

```txt
Mobile-first
Readable content width
Consistent spacing
Touch-friendly controls
Minimal horizontal scrolling
Clear visual hierarchy
Reusable responsive patterns
Progressive enhancement
```

Minimum touch target:

```txt
44px × 44px
```

Recommended content width:

```txt
max-w-[1600px]
```

Recommended dashboard horizontal padding:

```txt
Mobile: px-4
Tablet: px-6
Desktop: px-8
```

Recommended section spacing:

```txt
space-y-6
lg:space-y-8
```

## Folder Structure

Tambahkan reusable layout components jika diperlukan:

```txt
components/
├── common/
│   ├── page-header.tsx
│   └── responsive-actions.tsx
├── layout/
│   ├── dashboard-content.tsx
│   ├── dashboard-mobile-sidebar.tsx
│   ├── dashboard-sidebar.tsx
│   └── dashboard-topbar.tsx
└── ui/
    ├── dialog.tsx
    └── responsive-grid.tsx
```

File yang kemungkinan diperbarui:

```txt
app/globals.css
app/page.tsx
app/(auth)/login/page.tsx
app/(auth)/register/page.tsx
app/dashboard/layout.tsx
app/dashboard/page.tsx
app/dashboard/subjects/page.tsx
app/dashboard/plans/page.tsx
app/dashboard/tasks/page.tsx
app/dashboard/sessions/page.tsx
app/dashboard/calendar/page.tsx
app/dashboard/analytics/page.tsx
app/dashboard/ai/page.tsx
app/dashboard/settings/page.tsx

components/layout/dashboard-layout.tsx
components/layout/dashboard-sidebar.tsx
components/layout/dashboard-mobile-sidebar.tsx
components/layout/dashboard-topbar.tsx

features/subjects/*
features/study-plans/*
features/tasks/*
features/study-sessions/*
features/analytics/*
features/calendar/*
features/ai-study-plan/*
features/settings/*
```

## Implementation Steps

### 1. Add Global Overflow Protection

Edit:

```txt
app/globals.css
```

Pastikan global styles memiliki:

```css
html {
  min-width: 320px;
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  overflow-x: hidden;
}

* {
  min-width: 0;
}
```

Catatan:

- `min-width: 0` membantu flex/grid child agar tidak menyebabkan overflow.
- Pastikan style ini tidak merusak komponen input atau dialog.
- Jangan memakai `overflow-x-hidden` untuk menutupi layout rusak tanpa memperbaiki sumber overflow.

---

### 2. Create Dashboard Content Wrapper

Buat file:

```txt
components/layout/dashboard-content.tsx
```

Isi:

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type DashboardContentProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardContent({ children, className }: DashboardContentProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8",
        className
      )}
    >
      {children}
    </main>
  );
}
```

Gunakan wrapper ini pada dashboard layout agar seluruh halaman memiliki:

```txt
Consistent max width
Consistent padding
Consistent vertical spacing
```

---

### 3. Update Dashboard Layout

Edit:

```txt
components/layout/dashboard-layout.tsx
```

Struktur yang direkomendasikan:

```tsx
import type { ReactNode } from "react";

import { DashboardContent } from "@/components/layout/dashboard-content";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

type DashboardLayoutProps = {
  children: ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="min-w-0 lg:pl-72">
        <DashboardTopbar user={user} />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </div>
  );
}
```

Expected:

```txt
Desktop sidebar fixed.
Content mendapat offset lg:pl-72.
Mobile tidak memiliki sidebar offset.
Content tidak overflow.
```

---

### 4. Improve Desktop Sidebar

Edit:

```txt
components/layout/dashboard-sidebar.tsx
```

Requirements:

- Sidebar hanya tampil mulai breakpoint `lg`.
- Gunakan fixed positioning.
- Tinggi penuh viewport.
- Navigation area dapat di-scroll.
- Footer sidebar tidak terpotong.
- Active navigation jelas.
- Label tidak overflow.

Recommended root class:

```tsx
<aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
```

Navigation area:

```tsx
<nav className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
```

Navigation item:

```txt
Minimum height 44px
Rounded-xl atau rounded-2xl
Icon shrink-0
Label truncate
Active background jelas
```

Example:

```tsx
className = "flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium";
```

---

### 5. Improve Mobile Sidebar

Edit:

```txt
components/layout/dashboard-mobile-sidebar.tsx
```

Requirements:

- Gunakan Radix Dialog.
- Drawer muncul dari kiri.
- Lebar tidak memenuhi seluruh layar.
- Maksimal sekitar `w-[88vw] max-w-sm`.
- Drawer bisa ditutup melalui overlay.
- Drawer tertutup setelah navigation item dipilih.
- Body tidak scroll saat drawer terbuka.
- Navigation area dapat di-scroll.
- Close button memiliki label accessibility.

Recommended content class:

```tsx
className = "fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-sm flex-col bg-white shadow-2xl";
```

Overlay:

```tsx
className = "fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm";
```

Expected:

```txt
Tidak ada horizontal overflow.
Drawer nyaman digunakan pada layar 320px.
User dapat menutup drawer dengan keyboard Escape.
```

---

### 6. Improve Dashboard Topbar

Edit:

```txt
components/layout/dashboard-topbar.tsx
```

Requirements:

- Sticky pada bagian atas.
- Mobile menu button hanya tampil di bawah `lg`.
- User name/email tidak memaksa lebar.
- Email disembunyikan di mobile kecil jika perlu.
- Topbar tetap ringkas.
- Gunakan translucent white background jika sesuai.

Recommended wrapper:

```tsx
<header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
```

Inner wrapper:

```tsx
<div className="mx-auto flex min-h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
```

User info:

```txt
Name truncate
Email truncate
Avatar shrink-0
Hide email below sm if needed
```

---

### 7. Create Reusable Page Header

Buat file:

```txt
components/common/page-header.tsx
```

Isi:

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>

        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex w-full flex-wrap gap-3 sm:w-auto sm:justify-end">{actions}</div>
      ) : null}
    </div>
  );
}
```

Gunakan pada semua halaman dashboard untuk menghindari perbedaan typography dan spacing.

---

### 8. Create Responsive Actions Wrapper

Buat file:

```txt
components/common/responsive-actions.tsx
```

Isi:

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type ResponsiveActionsProps = {
  children: ReactNode;
  className?: string;
};

export function ResponsiveActions({ children, className }: ResponsiveActionsProps) {
  return (
    <div className={cn("flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap", className)}>
      {children}
    </div>
  );
}
```

Button di dalam wrapper disarankan:

```tsx
className = "w-full sm:w-auto";
```

---

### 9. Standardize Dashboard Page Structure

Semua halaman dashboard menggunakan pola:

```tsx
<div className="space-y-6 lg:space-y-8">
  <PageHeader title="Page Title" description="Page description." />

  {/* page content */}
</div>
```

Affected pages:

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

Hapus heading layout yang berulang dan berbeda-beda.

---

### 10. Improve CRUD Page Layout

Halaman berikut menggunakan form + list:

```txt
/dashboard/subjects
/dashboard/plans
/dashboard/tasks
/dashboard/sessions
/dashboard/ai
```

Recommended layout:

```tsx
<div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] xl:items-start">
  <div className="xl:sticky xl:top-24">{/* create form */}</div>

  <div className="min-w-0">{/* list or preview */}</div>
</div>
```

Rules:

- Form tampil di atas list pada mobile.
- Form dan list dua kolom hanya pada desktop besar.
- Form boleh sticky pada desktop.
- Jangan gunakan fixed width tanpa `minmax`.
- List area wajib memiliki `min-w-0`.

---

### 11. Improve Card Grids

Gunakan responsive grid berikut sesuai kebutuhan.

Standard two-column feature grid:

```tsx
className = "grid gap-4 sm:grid-cols-2";
```

Dashboard statistics:

```tsx
className = "grid gap-4 sm:grid-cols-2 xl:grid-cols-4";
```

Analytics cards:

```tsx
className = "grid gap-6 xl:grid-cols-2";
```

Card rules:

```txt
Use min-w-0
Long titles truncate atau line-clamp
Action buttons wrap
Metadata wrap
Tidak menggunakan fixed height kecuali skeleton
```

Recommended card header:

```tsx
<div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
```

---

### 12. Improve Form Responsiveness

Affected forms:

```txt
Authentication forms
Subject form
Study plan form
Task form
Study session form
AI generator form
Settings form
```

Requirements:

- Input menggunakan lebar penuh.
- Label mudah dibaca.
- Error message tidak merusak layout.
- Date fields dapat dibuat dua kolom mulai `sm`.
- Action button full width pada mobile.
- Textarea memiliki minimum height.
- Form spacing konsisten.

Recommended field grid:

```tsx
<div className="grid gap-4 sm:grid-cols-2">
```

Button:

```tsx
<Button className="w-full sm:w-auto">
```

Textarea:

```tsx
className = "min-h-28 resize-y";
```

Date fields:

```txt
startDate + endDate
startedAt + endedAt
```

Tampilkan satu kolom mobile dan dua kolom tablet.

---

### 13. Improve Native Select UI

Select native yang digunakan sementara harus memiliki style konsisten:

```tsx
className =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200";
```

Requirements:

- Tidak overflow pada mobile.
- Option text boleh panjang.
- Placeholder jelas.
- Disabled style terlihat.

Jangan membuat Radix Select migration besar pada issue ini kecuali komponen sudah tersedia.

---

### 14. Improve Dialog Responsiveness

Affected dialogs:

```txt
Edit subject
Delete subject
Edit study plan
Delete study plan
Edit task
Delete task
Edit study session
Delete study session
```

Dialog content requirements:

```txt
Width: calc(100vw - 2rem)
Max width: 32rem atau 40rem
Max height: calc(100vh - 2rem)
Overflow-y-auto
Centered
Padding responsive
```

Recommended class:

```tsx
className =
  "fixed left-1/2 top-1/2 max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6";
```

Dialog action layout:

```tsx
<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
```

Buttons:

```tsx
className = "w-full sm:w-auto";
```

---

### 15. Improve Badge Wrapping

Card metadata sering memiliki beberapa badge:

```txt
Status
Priority
Mood
Event type
Deadline status
```

Gunakan:

```tsx
<div className="flex flex-wrap items-center gap-2">
```

Badge requirements:

- Jangan menggunakan `whitespace-nowrap` pada container utama.
- Badge text boleh nowrap.
- Container harus wrap.
- Tidak keluar dari card.

---

### 16. Improve Text Overflow

Gunakan pola berikut.

Single-line title:

```tsx
className = "truncate";
```

Two-line description:

```tsx
className = "line-clamp-2";
```

Long goal:

```tsx
className = "line-clamp-3";
```

Parent flex/grid wajib:

```tsx
className = "min-w-0";
```

Affected content:

```txt
Subject names
Study plan titles
Task titles
Email addresses
AI generated titles
Study plan goals
Session notes
Calendar descriptions
```

---

### 17. Improve Dashboard Overview

Edit:

```txt
app/dashboard/page.tsx
features/dashboard/components/*
```

Requirements:

- Overview cards satu kolom pada mobile.
- Dua kolom pada tablet.
- Empat kolom pada desktop.
- Active plans dan recent sessions satu kolom sampai desktop besar.
- Recent tasks full width.
- Progress labels tidak overflow.

Recommended:

```tsx
<div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
```

Recent list item:

```txt
Stack content pada mobile
Row layout mulai sm
Badge dan date wrap
```

---

### 18. Improve Subjects Page

Requirements:

- Create form di atas list pada mobile.
- Grid subject satu kolom mobile.
- Dua kolom mulai `md` atau `lg`.
- Card actions wrap.
- Long subject name truncate.
- Target hours tetap terbaca.

Recommended list grid:

```tsx
className = "grid gap-4 md:grid-cols-2";
```

---

### 19. Improve Study Plans Page

Requirements:

- Progress section tidak terpotong.
- Date range stack pada mobile.
- Status dan priority wrap.
- Edit/delete buttons full width jika area terlalu sempit.
- Goal dan description memakai line clamp.
- Empty state CTA wrap.

Recommended card actions:

```tsx
<div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
```

---

### 20. Improve Tasks Page

Requirements:

- Task list tidak terlalu padat pada mobile.
- Quick status button tidak mendorong card keluar.
- Due date berada di baris terpisah pada layar kecil.
- Status dan priority wrap.
- Study plan title truncate.
- Update/delete action mudah ditekan.

Jika quick status memiliki beberapa opsi, gunakan dropdown atau satu tombol next-state, bukan tiga tombol berjajar pada mobile.

---

### 21. Improve Study Sessions Page

Requirements:

- Duration tetap terlihat.
- Subject, plan, dan task tidak overflow.
- Date/time boleh stack.
- Note menggunakan line clamp.
- Mood badge wrap.
- Form date-time fields responsive.

Card header:

```txt
Mobile: vertical
Desktop/tablet: horizontal
```

---

### 22. Improve Calendar Page

Requirements:

- Summary cards responsive.
- Event group section tidak overflow.
- Event card date berpindah ke baris baru pada mobile.
- Badge wrap.
- Description line clamp.
- Group heading memiliki spacing konsisten.

Recommended event header:

```tsx
<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
```

---

### 23. Improve Analytics Charts

Affected components:

```txt
weekly-study-hours-chart.tsx
study-hours-by-subject-chart.tsx
task-status-chart.tsx
```

Requirements:

- Gunakan `ResponsiveContainer`.
- Parent chart memiliki explicit height.
- Chart tidak memakai fixed pixel width.
- Tooltip tidak keluar viewport.
- Axis label disederhanakan pada mobile.
- Subject names panjang dipotong.
- Pie chart legend wrap atau dipindah ke bawah.
- Empty chart state tetap tampil.

Example:

```tsx
<div className="h-72 w-full sm:h-80">
  <ResponsiveContainer width="100%" height="100%">
    {/* chart */}
  </ResponsiveContainer>
</div>
```

Mobile chart recommendations:

```txt
Reduce axis tick font size
Reduce chart margins
Hide unnecessary grid lines
Use short labels
```

---

### 24. Improve AI Generator Page

Requirements:

- Form tampil di atas preview pada mobile.
- Preview tidak overflow karena generated JSON/text.
- Task list responsive.
- Save button full width pada mobile.
- Generated description dan goal wrap.
- Long generated titles truncate atau wrap.
- Loading state tidak mengubah layout berlebihan.

Recommended layout:

```tsx
<div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
```

---

### 25. Improve Settings Page

Recommended layout:

```tsx
<div className="grid gap-6 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
```

Requirements:

- Account card di atas form pada mobile.
- Email wrap atau truncate.
- Avatar tidak shrink.
- Form full width.
- Save button full width mobile.
- Profile image preview tidak overflow.

---

### 26. Improve Authentication Pages

Affected:

```txt
/login
/register
```

Requirements:

- Form card menggunakan lebar responsif.
- Minimum horizontal padding.
- Tidak terpotong keyboard mobile.
- Heading responsive.
- Button full width.
- Link register/login mudah ditekan.

Recommended shell:

```tsx
<main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
```

Card width:

```tsx
className = "w-full max-w-md";
```

---

### 27. Improve Landing Page Responsiveness

Affected sections:

```txt
Header
Hero
Dashboard preview
Stats
Features
How it works
Analytics preview
Testimonials
Final CTA
Footer
```

Requirements:

- Mobile navbar tidak overflow.
- Hide desktop navigation on mobile.
- Hero heading responsive.
- CTA buttons stack on mobile.
- Dashboard preview scales down.
- Stats satu kolom mobile, dua tablet, empat desktop.
- Feature cards responsive.
- Analytics preview tidak menyebabkan horizontal scroll.
- Footer links wrap.

Hero heading recommendation:

```tsx
className = "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl";
```

CTA wrapper:

```tsx
className = "flex flex-col gap-3 sm:flex-row";
```

---

### 28. Add Responsive Utility Grid

Buat file opsional:

```txt
components/ui/responsive-grid.tsx
```

Isi:

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type ResponsiveGridProps = {
  children: ReactNode;
  className?: string;
};

export function ResponsiveGrid({ children, className }: ResponsiveGridProps) {
  return <div className={cn("grid min-w-0 gap-4 sm:grid-cols-2", className)}>{children}</div>;
}
```

Gunakan hanya jika mengurangi duplikasi. Jangan membuat abstraction jika penggunaannya hanya satu kali.

---

### 29. Standardize Button Behavior

Button requirements:

```txt
Minimum height 40–44px
Full width on mobile forms
Clear disabled state
Icon shrink-0
Text truncate only when necessary
Action groups wrap
```

Icon button wajib memiliki:

```tsx
aria-label="Open menu"
```

Avoid:

```txt
Icon-only button without accessible label
Three or more action buttons forced into one row on mobile
Very small click targets
```

---

### 30. Standardize Spacing

Gunakan spacing konsisten:

```txt
Page sections: gap/space 6–8
Card content: p-4 mobile, p-5/p-6 desktop
Form fields: space-y-4
Card grids: gap-4 atau gap-5
Page header margin: handled by parent space-y
```

Hindari penggunaan acak seperti:

```txt
mt-3, mt-7, mt-11 tanpa pola
px-2 pada satu halaman dan px-10 di halaman lain
```

---

### 31. Add Responsive Test Viewports

Test minimal viewport berikut:

```txt
320 × 568
375 × 667
390 × 844
768 × 1024
1024 × 768
1280 × 720
1440 × 900
1920 × 1080
```

Browser devtools device examples:

```txt
iPhone SE
iPhone 12/13
Pixel 7
iPad Mini
iPad Pro
Responsive desktop
```

---

### 32. Check Horizontal Overflow

Pada setiap route, jalankan browser console:

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth;
```

Expected:

```txt
false
```

Jika hasil `true`, cari element penyebab:

```js
[...document.querySelectorAll("*")].filter(
  (element) => element.getBoundingClientRect().right > document.documentElement.clientWidth
);
```

Jangan hanya menambahkan `overflow-hidden` tanpa memperbaiki komponen penyebab.

---

### 33. Verify Navigation Behavior

Mobile:

```txt
Menu button membuka sidebar.
Overlay menutup sidebar.
Escape menutup sidebar.
Klik navigation item menutup sidebar.
Active state tampil.
Tidak ada body horizontal scroll.
```

Desktop:

```txt
Sidebar tetap tampil.
Content tidak tertutup sidebar.
Sidebar navigation bisa scroll.
Topbar tetap sticky.
```

---

### 34. Run Checks

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
│   ├── page-header.tsx
│   └── responsive-actions.tsx
├── layout/
│   ├── dashboard-content.tsx
│   ├── dashboard-layout.tsx
│   ├── dashboard-mobile-sidebar.tsx
│   ├── dashboard-sidebar.tsx
│   └── dashboard-topbar.tsx
└── ui/
    └── responsive-grid.tsx
```

Existing page dan feature components ikut diperbarui untuk menggunakan responsive patterns.

## Acceptance Criteria

- Seluruh dashboard dapat digunakan pada viewport 320px.
- Tidak ada horizontal overflow di route utama.
- Desktop sidebar tidak menutupi konten.
- Mobile sidebar dapat dibuka dan ditutup.
- Mobile sidebar tertutup setelah navigation dipilih.
- Dashboard topbar responsive.
- Dashboard content memiliki max-width konsisten.
- Dashboard padding responsive.
- Page header reusable tersedia.
- Page title responsive.
- Page actions wrap pada mobile.
- CRUD form tampil di atas list pada mobile.
- CRUD form dan list menjadi dua kolom pada desktop besar.
- Card grid responsive.
- Card title tidak overflow.
- Description panjang menggunakan line clamp.
- Badge container dapat wrap.
- Form input full width.
- Date field responsive.
- Submit button full width pada mobile.
- Dialog tidak keluar viewport.
- Dialog content dapat di-scroll.
- Dialog actions responsive.
- Dashboard overview responsive.
- Subject cards responsive.
- Study plan cards responsive.
- Task cards responsive.
- Study session cards responsive.
- Calendar event cards responsive.
- Analytics charts menggunakan responsive container.
- AI Generator responsive.
- Settings page responsive.
- Login page responsive.
- Register page responsive.
- Landing page responsive.
- Touch target action utama minimal sekitar 44px.
- Icon button memiliki accessible label.
- Tidak ada business logic yang berubah.
- Tidak ada schema database yang berubah.
- Tidak ada API route baru.
- Tidak ada shadcn/ui yang ditambahkan.
- Tidak ada folder di dalam `src/`.
- Tidak ada error TypeScript.
- Tidak ada error lint.
- `pnpm format:check` berhasil.
- `pnpm build` berhasil.

## Testing Checklist

### 1. Test Mobile Sidebar

Gunakan viewport:

```txt
375 × 667
```

Expected:

```txt
Desktop sidebar tersembunyi.
Menu button tampil.
Drawer terbuka dari kiri.
Drawer tidak memenuhi seluruh lebar.
Navigation bisa di-scroll.
Klik menu menutup drawer.
```

---

### 2. Test Desktop Sidebar

Gunakan viewport:

```txt
1440 × 900
```

Expected:

```txt
Sidebar tampil.
Content memiliki offset yang benar.
Topbar sticky.
Sidebar tidak menutupi content.
```

---

### 3. Test CRUD Pages on Mobile

Buka:

```txt
/dashboard/subjects
/dashboard/plans
/dashboard/tasks
/dashboard/sessions
```

Expected:

```txt
Form tampil di atas list.
Input tidak overflow.
Button mudah ditekan.
Card satu kolom.
Action button tetap terlihat.
```

---

### 4. Test CRUD Pages on Desktop

Gunakan viewport:

```txt
1440 × 900
```

Expected:

```txt
Form dan list dua kolom.
Form bisa sticky.
List memiliki lebar yang cukup.
Tidak ada area kosong berlebihan.
```

---

### 5. Test Dialog on Small Screen

Gunakan viewport:

```txt
320 × 568
```

Buka dialog edit.

Expected:

```txt
Dialog tidak keluar viewport.
Dialog dapat di-scroll.
Action button stack.
Close button dapat diakses.
```

---

### 6. Test Analytics Charts

Gunakan viewport mobile dan desktop.

Expected:

```txt
Chart mengikuti lebar container.
Tidak ada horizontal scroll.
Axis label tetap terbaca.
Tooltip tidak keluar layar.
```

---

### 7. Test Long Content

Gunakan data:

```txt
Subject name sangat panjang.
Study plan title sangat panjang.
Task title sangat panjang.
Email sangat panjang.
AI generated description panjang.
```

Expected:

```txt
Layout tidak overflow.
Title truncate atau wrap sesuai konteks.
Description memakai line clamp.
Card tetap rapi.
```

---

### 8. Test Landing Page

Gunakan viewport:

```txt
320 × 568
768 × 1024
1440 × 900
```

Expected:

```txt
Hero text responsive.
CTA stack pada mobile.
Dashboard preview tidak overflow.
Stats dan feature cards responsive.
Navbar tidak overflow.
```

---

### 9. Test Touch Targets

Periksa:

```txt
Mobile sidebar menu
Dialog close
Edit button
Delete button
Status button
Submit button
Navigation links
```

Expected:

```txt
Action utama mudah ditekan.
Tidak ada button terlalu kecil.
```

---

### 10. Test Horizontal Overflow

Jalankan pada setiap route:

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth;
```

Expected:

```txt
false
```

---

### 11. Test Keyboard Navigation

Expected:

```txt
Menu mobile dapat dibuka dengan keyboard.
Dialog dapat ditutup dengan Escape.
Focus tidak hilang.
Button dan link dapat diakses dengan Tab.
```

---

### 12. Run Checks

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

- Gunakan pendekatan mobile-first.
- Jangan memperbaiki overflow hanya dengan menyembunyikannya.
- Hindari fixed width tanpa responsive fallback.
- Gunakan `min-w-0` pada flex dan grid child.
- Gunakan `ResponsiveContainer` untuk Recharts.
- Jangan mengubah business logic.
- Jangan membuat komponen abstraction yang tidak diperlukan.
- Prioritaskan konsistensi spacing, typography, dan interaction.
- Visual polish tidak boleh mengurangi accessibility.
- Screenshot comparison boleh dilakukan untuk mengecek konsistensi antarrute.

## Suggested Commit Message

```bash
refactor: improve responsive dashboard ui
```
