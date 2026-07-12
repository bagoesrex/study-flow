# ISSUE-022 — Improve Dashboard UI and UX

## Status

Planned

## Priority

High

## Type

UI/UX Improvement / Dashboard Redesign

## Summary

Meningkatkan tampilan dan pengalaman penggunaan dashboard StudyFlow agar terasa lebih modern, terstruktur, konsisten, dan mudah dipahami.

Issue ini berfokus pada penyempurnaan dashboard shell, sidebar, topbar, overview, navigasi, page header, card, form, dialog, quick action, informasi status, dan hierarchy visual.

Perubahan dilakukan tanpa mengubah business logic, schema database, atau alur utama aplikasi.

Affected routes:

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

## Background

StudyFlow sudah memiliki fitur utama:

```txt
Dashboard Overview
Subject Management
Study Plan Management
Task Management
Study Session Tracker
Calendar Deadline View
Analytics Dashboard
AI Study Plan Generator
User Settings
Search, Filter, and Sort
Toast Notifications
Responsive UI
```

Namun dashboard masih dapat ditingkatkan pada beberapa bagian:

```txt
Navigasi sidebar masih terasa seperti daftar menu biasa
Hierarchy informasi setiap halaman belum sepenuhnya konsisten
Create form mengambil terlalu banyak ruang
Overview belum menunjukkan prioritas user secara jelas
Quick action belum tersedia
Card antarfitur memiliki struktur yang berbeda
Informasi status terlalu tersebar
Action button terlalu banyak terlihat sekaligus
Empty state belum selalu mengarahkan user ke langkah berikutnya
Dashboard belum terasa cukup hidup sebagai aplikasi SaaS modern
```

## Goals

- Meningkatkan information architecture dashboard.
- Membuat sidebar lebih terstruktur.
- Membuat topbar lebih informatif.
- Membuat dashboard overview lebih actionable.
- Menambahkan quick action yang relevan.
- Menstandarkan page header.
- Menstandarkan card hierarchy.
- Menstandarkan action menu.
- Mengurangi visual clutter.
- Memperbaiki create dan edit flow.
- Memperbaiki form grouping.
- Memperbaiki dialog dan confirmation flow.
- Memperjelas status dan priority.
- Memperjelas hubungan subject, study plan, task, dan session.
- Membuat empty state lebih actionable.
- Membuat halaman data terasa lebih ringan.
- Menambahkan micro-interaction secara terkontrol.
- Mempertahankan responsive behavior.
- Mempertahankan accessibility.
- Mempertahankan semua business logic yang sudah ada.

## Non-Goals

- Tidak mengubah schema database.
- Tidak membuat API route baru.
- Tidak mengubah authentication.
- Tidak membuat fitur chat.
- Tidak membuat notification center.
- Tidak membuat kanban drag and drop.
- Tidak membuat global command palette.
- Tidak membuat pagination.
- Tidak membuat dark mode.
- Tidak membuat theme editor.
- Tidak membuat dashboard admin.
- Tidak menambahkan shadcn/ui.
- Tidak mengganti Radix UI.
- Tidak mengubah AI provider.
- Tidak membuat ulang landing page.
- Tidak mengubah formula analytics.
- Tidak mengubah business rules CRUD.

## UX Principles

Gunakan prinsip:

```txt
Clear before clever
Primary action must be obvious
Progressive disclosure
Consistent information hierarchy
Reduce visible actions
Keep context visible
Minimize unnecessary navigation
Use empty states as guidance
Feedback must be immediate
Responsive and keyboard accessible
```

## Design Direction

Gunakan gaya:

```txt
Modern productivity SaaS
Bright white interface
Soft slate background
Subtle indigo accent
Rounded cards
Low-contrast borders
Clear typography
Compact but readable density
Minimal decorative gradients
Strong visual hierarchy
Subtle interaction feedback
```

Recommended colors:

```txt
App background: slate-50
Card background: white
Primary text: slate-950
Secondary text: slate-500
Border: slate-200/80
Primary accent: indigo-600
Secondary accent: violet-500
Success: emerald
Warning: amber
Danger: rose
```

## Dashboard Information Architecture

Sidebar dibagi menjadi kelompok:

```txt
Workspace
- Overview
- Subjects
- Study Plans
- Tasks
- Study Sessions

Insights
- Calendar
- Analytics
- AI Generator

Account
- Settings
```

Jangan tampilkan semua menu sebagai satu daftar panjang tanpa grouping.

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
components/
├── common/
│   ├── action-menu.tsx
│   ├── entity-meta.tsx
│   ├── page-header.tsx
│   ├── section-header.tsx
│   ├── status-indicator.tsx
│   └── surface-card.tsx
├── layout/
│   ├── dashboard-breadcrumb.tsx
│   ├── dashboard-content.tsx
│   ├── dashboard-mobile-sidebar.tsx
│   ├── dashboard-sidebar.tsx
│   ├── dashboard-sidebar-group.tsx
│   └── dashboard-topbar.tsx
└── ui/
    ├── dropdown-menu.tsx
    └── segmented-control.tsx

features/
└── dashboard/
    ├── components/
    │   ├── dashboard-greeting.tsx
    │   ├── dashboard-quick-actions.tsx
    │   ├── dashboard-today-focus.tsx
    │   ├── dashboard-overview-cards.tsx
    │   ├── upcoming-deadlines-card.tsx
    │   ├── recent-activity-card.tsx
    │   └── active-study-plans-card.tsx
    └── utils/
        └── dashboard-priority.ts
```

Existing feature components ikut diperbarui.

## Implementation Steps

### 1. Define Dashboard Navigation Groups

Edit:

```txt
constants/navigation.ts
```

Gunakan struktur grouped navigation:

```ts
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Settings,
  Sparkles,
  Timer,
} from "lucide-react";

export const dashboardNavigationGroups = [
  {
    label: "Workspace",
    items: [
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
        label: "Study Sessions",
        href: "/dashboard/sessions",
        icon: Timer,
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        label: "Calendar",
        href: "/dashboard/calendar",
        icon: CalendarDays,
      },
      {
        label: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
      },
      {
        label: "AI Generator",
        href: "/dashboard/ai",
        icon: Sparkles,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
] as const;
```

Expected:

```txt
Sidebar lebih mudah dipindai.
Menu dikelompokkan berdasarkan fungsi.
Mobile dan desktop menggunakan data navigasi yang sama.
```

---

### 2. Create Sidebar Group Component

Buat file:

```txt
components/layout/dashboard-sidebar-group.tsx
```

Requirements:

- Menampilkan group label.
- Menampilkan item navigasi.
- Active item memiliki background dan indicator.
- Icon memiliki ukuran konsisten.
- Label truncate.
- Touch target minimal 44px.
- Group label tidak terlalu dominan.

Recommended styles:

```txt
Group label:
text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400

Menu item:
min-h-11 rounded-xl px-3

Active:
bg-slate-950 text-white

Inactive:
text-slate-600 hover:bg-slate-100 hover:text-slate-950
```

Tambahkan indicator kecil pada active item jika diperlukan.

---

### 3. Improve Desktop Sidebar

Edit:

```txt
components/layout/dashboard-sidebar.tsx
```

Sidebar structure:

```txt
Brand
Workspace navigation
Insights navigation
Account navigation
User summary / logout
```

Requirements:

- Width sekitar `272px–288px`.
- Sidebar fixed pada desktop.
- Navigation area scrollable.
- Footer tetap terlihat.
- Active state jelas.
- Tidak menggunakan border dan shadow berlebihan.
- Logo dan nama aplikasi konsisten dengan landing page.
- Tambahkan short workspace description optional.

Recommended brand:

```tsx
<div className="flex items-center gap-3 px-4 py-5">
  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white">
    S
  </div>

  <div className="min-w-0">
    <p className="truncate font-bold text-slate-950">StudyFlow</p>
    <p className="truncate text-xs text-slate-500">Learning workspace</p>
  </div>
</div>
```

---

### 4. Improve Mobile Sidebar

Edit:

```txt
components/layout/dashboard-mobile-sidebar.tsx
```

Requirements:

- Menggunakan grouped navigation yang sama.
- Menampilkan user summary.
- Navigation item menutup drawer.
- Drawer memiliki header dan close button.
- Logout ditempatkan pada bagian bawah.
- Active navigation terlihat.
- Tidak ada duplicate navigation logic.

---

### 5. Create Dashboard Breadcrumb

Buat file:

```txt
components/layout/dashboard-breadcrumb.tsx
```

Breadcrumb examples:

```txt
Dashboard / Subjects
Dashboard / Study Plans
Dashboard / AI Generator
```

Requirements:

- Tidak perlu tampil di `/dashboard`.
- Tampil mulai viewport `sm` atau `md`.
- Menggunakan semantic navigation.
- Current page memiliki `aria-current="page"`.
- Tidak terlalu dominan.

Example:

```tsx
<nav aria-label="Breadcrumb">
  <ol className="flex items-center gap-2 text-sm text-slate-500">
    <li>
      <Link href="/dashboard">Dashboard</Link>
    </li>
    <li aria-hidden="true">/</li>
    <li aria-current="page" className="text-slate-950">
      Study Plans
    </li>
  </ol>
</nav>
```

---

### 6. Improve Dashboard Topbar

Edit:

```txt
components/layout/dashboard-topbar.tsx
```

Topbar content:

```txt
Mobile sidebar button
Breadcrumb
Quick create button
User menu
```

Recommended primary quick action:

```txt
+ Create
```

Quick create menu:

```txt
New Subject
New Study Plan
New Task
Log Study Session
Generate with AI
```

Quick create hanya mengarahkan atau membuka existing create flow.

Tidak membuat data secara langsung.

Requirements:

- Topbar sticky.
- User email tidak selalu ditampilkan.
- Gunakan avatar initials jika image tidak tersedia.
- Quick create disembunyikan atau dipadatkan di mobile.
- User menu menggunakan Radix Dropdown Menu.

---

### 7. Create Reusable Action Menu

Buat file:

```txt
components/common/action-menu.tsx
```

Tujuan:

```txt
Mengurangi tombol Edit/Delete yang selalu terlihat pada setiap card.
```

Gunakan menu tiga titik:

```txt
View details
Edit
Archive optional
Delete
```

Props:

```ts
type ActionMenuItem = {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

type ActionMenuProps = {
  label?: string;
  items: ActionMenuItem[];
};
```

Requirements:

- Menggunakan Radix Dropdown Menu.
- Trigger memiliki `aria-label`.
- Destructive item berwarna rose.
- Keyboard accessible.
- Tidak membuka menu ketika action pending.

---

### 8. Replace Visible Card Actions

Affected cards:

```txt
Subject Card
Study Plan Card
Task Card
Study Session Card
Calendar Event Card optional
```

Before:

```txt
Edit button
Delete button
Archive button
Status button
```

After:

```txt
Primary contextual action tetap terlihat
Secondary actions masuk ke action menu
```

Examples:

```txt
Task card:
Primary visible action = Update Status
Menu = Edit, Delete

Study Plan card:
Primary visible action = View Tasks
Menu = Edit, Delete

Subject card:
Primary visible action = View Plans
Menu = Edit, Archive, Delete
```

Tujuan:

```txt
Mengurangi visual clutter.
Memperjelas action utama.
```

---

### 9. Create Surface Card Component

Buat file:

```txt
components/common/surface-card.tsx
```

Props:

```ts
type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
};
```

Recommended base class:

```txt
rounded-2xl
border border-slate-200/80
bg-white
shadow-sm
```

Interactive:

```txt
transition
hover:-translate-y-0.5
hover:border-slate-300
hover:shadow-md
```

Gunakan secara terkontrol.

Tidak semua card perlu bergerak saat hover.

---

### 10. Create Section Header

Buat file:

```txt
components/common/section-header.tsx
```

Props:

```ts
type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};
```

Gunakan untuk:

```txt
Today’s Focus
Active Study Plans
Upcoming Deadlines
Recent Activity
Weekly Progress
```

Ini berbeda dengan `PageHeader`, yang digunakan untuk heading utama halaman.

---

### 11. Create Entity Meta Component

Buat file:

```txt
components/common/entity-meta.tsx
```

Tujuan:

```txt
Menstandarkan metadata subject, study plan, task, dan session.
```

Example:

```tsx
<EntityMeta
  items={[
    { icon: BookOpen, label: plan.subjectName },
    { icon: CalendarDays, label: "Due 14 Jul 2026" },
    { icon: CheckSquare, label: "4/8 tasks" },
  ]}
/>
```

Requirements:

- Metadata wrap.
- Icon decorative.
- Text truncate bila diperlukan.
- Tidak terlalu banyak item.

Maksimal metadata utama:

```txt
3–4 item per card
```

---

## Dashboard Overview Redesign

### 12. Improve Dashboard Greeting

Buat file:

```txt
features/dashboard/components/dashboard-greeting.tsx
```

Content:

```txt
Greeting berdasarkan waktu
Nama user
Short contextual message
Current date
```

Examples:

```txt
Good morning, Bagus.
Let’s make progress on what matters today.
```

Gunakan nama user dari session.

Jangan menggunakan greeting yang terlalu panjang.

Date format:

```txt
Monday, 13 July 2026
```

---

### 13. Improve Dashboard Overview Layout

Update:

```txt
app/dashboard/page.tsx
```

Recommended order:

```txt
1. Greeting and quick actions
2. Overview metrics
3. Today’s Focus
4. Active Study Plans
5. Upcoming Deadlines
6. Weekly Progress
7. Recent Activity
```

Recommended structure:

```tsx
<div className="space-y-6 lg:space-y-8">
  <DashboardGreeting />

  <DashboardOverviewCards />

  <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
    <DashboardTodayFocus />
    <DashboardQuickActions />
  </div>

  <div className="grid gap-6 xl:grid-cols-2">
    <ActiveStudyPlansCard />
    <UpcomingDeadlinesCard />
  </div>

  <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
    <WeeklyProgressCard />
    <RecentActivityCard />
  </div>
</div>
```

---

### 14. Improve Overview Cards

Edit:

```txt
features/dashboard/components/dashboard-overview-cards.tsx
```

Metric cards:

```txt
Active Subjects
Active Study Plans
Task Completion
Study Time This Week
```

Jangan menampilkan terlalu banyak metric sekaligus.

Setiap card memiliki:

```txt
Icon
Label
Main value
Contextual description
Optional trend or secondary value
```

Example:

```txt
Task Completion
72%
18 of 25 tasks completed
```

Gunakan visual emphasis:

```txt
Main value besar
Description kecil
Icon berada dalam subtle surface
```

---

### 15. Create Today’s Focus

Buat file:

```txt
features/dashboard/components/dashboard-today-focus.tsx
```

Data menggunakan task yang sudah tersedia.

Prioritas:

```txt
1. Overdue non-completed task
2. Task due today
3. Urgent task
4. High-priority task
5. Nearest upcoming task
```

Tampilkan maksimal:

```txt
3 task
```

Setiap task:

```txt
Title
Subject
Study Plan
Priority
Due status
Quick status action
```

Jika tidak ada task:

```txt
You’re all caught up.
Create a new task or start a study session.
```

Tidak perlu schema baru.

---

### 16. Create Dashboard Quick Actions

Buat file:

```txt
features/dashboard/components/dashboard-quick-actions.tsx
```

Quick actions:

```txt
Create Subject
Create Study Plan
Add Task
Log Session
Generate with AI
```

Gunakan links ke route existing.

Design:

```txt
Compact tiles
Icon
Title
Short supporting text
Hover feedback
```

Mobile:

```txt
Two-column grid
```

Desktop:

```txt
Two or three-column grid
```

Jangan menggunakan card besar untuk setiap action.

---

### 17. Improve Active Study Plans

Edit atau buat:

```txt
features/dashboard/components/active-study-plans-card.tsx
```

Tampilkan maksimal:

```txt
4 plan
```

Setiap plan memiliki:

```txt
Subject color
Title
Progress
Completed/total tasks
Deadline optional
Status
```

Primary action:

```txt
Open plan / View tasks
```

Progress bar harus konsisten dengan ISSUE-014.

Jika tidak ada plan:

```txt
Create your first study plan.
```

---

### 18. Create Upcoming Deadlines Card

Buat file:

```txt
features/dashboard/components/upcoming-deadlines-card.tsx
```

Tampilkan:

```txt
Overdue
Today
This week
Upcoming
```

Urutan:

```txt
Overdue first
Today
Nearest future date
```

Tampilkan maksimal:

```txt
5 task
```

Gunakan date/status label yang mudah dipahami:

```txt
Overdue by 2 days
Due today
Due tomorrow
Due in 4 days
```

---

### 19. Improve Recent Activity

Buat file:

```txt
features/dashboard/components/recent-activity-card.tsx
```

Gabungkan aktivitas:

```txt
Task completed
Study session logged
Study plan created
Subject created
```

Scope MVP:

- Jika query gabungan sulit, gunakan task dan study session yang sudah tersedia.
- Tidak perlu membuat activity log table.
- Jangan membuat data palsu.

Example:

```txt
Completed “Setup Authentication”
23 minutes ago

Logged a 45-minute session
2 hours ago
```

Gunakan relative time helper.

---

## Page-Level UX Improvements

### 20. Standardize Page Header

Semua halaman memakai:

```tsx
<PageHeader
  title="Study Plans"
  description="Organize goals into structured and trackable plans."
  actions={<CreateStudyPlanButton />}
/>
```

Page header actions:

```txt
Primary action maksimal satu
Secondary action maksimal satu
```

Jangan menempatkan terlalu banyak button pada heading.

---

### 21. Move Create Forms into Dialog or Drawer

Affected pages:

```txt
Subjects
Study Plans
Tasks
Study Sessions
```

Existing create form yang selalu terlihat dapat diganti dengan:

```txt
Primary Create button
↓
Dialog desktop
Drawer/full-height dialog mobile
```

Tujuan:

```txt
Memberikan lebih banyak ruang untuk data.
Mengurangi tampilan form panjang saat user hanya ingin melihat data.
```

Gunakan Radix Dialog.

Requirements:

- Form lama tetap digunakan sebagai reusable form component.
- Tidak menduplikasi validation.
- Dialog hanya tertutup setelah success.
- Form reset setelah success.
- Mobile dialog dapat di-scroll.
- Focus dikembalikan ke trigger setelah dialog ditutup.

---

### 22. Improve Form Information Grouping

Study Plan form:

```txt
Basic Information
- Subject
- Title
- Description

Goal and Timeline
- Goal
- Start Date
- End Date
- Estimated Hours

Priority and Status
- Priority
- Status
```

Task form:

```txt
Task Information
- Study Plan
- Title
- Description

Planning
- Priority
- Due Date
- Position
```

Study Session form:

```txt
Session Context
- Subject
- Study Plan
- Task

Session Details
- Started At
- Ended At / Duration
- Mood
- Notes
```

Gunakan section label kecil, bukan card bertumpuk terlalu banyak.

---

### 23. Improve Subject Page

Route:

```txt
/dashboard/subjects
```

Changes:

- Create form dipindahkan ke dialog.
- Search/filter tetap berada di atas list.
- Active dan archived count tampil ringkas.
- Subject cards memiliki consistent hierarchy.
- Subject color digunakan sebagai accent kecil, bukan background besar.
- Target hours ditampilkan sebagai secondary metadata.
- Primary action mengarah ke Study Plans yang terkait.

Subject card structure:

```txt
Color indicator + Name + Action menu
Description
Target hours
Study plan count optional jika tersedia
Primary link
```

---

### 24. Improve Study Plans Page

Route:

```txt
/dashboard/plans
```

Changes:

- Create form dipindahkan ke dialog.
- Status dan priority memakai badge konsisten.
- Progress menjadi visual utama card.
- Deadline dan subject ditampilkan sebagai metadata.
- Goal menggunakan line clamp.
- Primary action `View Tasks`.
- Edit/Delete masuk action menu.

Study plan card hierarchy:

```txt
Subject + status
Title
Goal
Progress
Task completion
Deadline
Primary action
```

---

### 25. Improve Tasks Page

Route:

```txt
/dashboard/tasks
```

Changes:

- Create form dipindahkan ke dialog.
- Filter controls tetap mudah digunakan.
- Task dikelompokkan secara visual tanpa membuat kanban.
- Status action dibuat lebih cepat.
- Due status lebih menonjol.
- Completed task dibuat lebih redup tetapi tetap terbaca.
- Secondary action masuk menu.

Optional presentation tabs:

```txt
All
Today
Upcoming
Completed
```

Tabs hanya presentation filter dan tidak menggantikan filter existing.

Jika menambah kompleksitas, pertahankan filter yang sudah ada.

---

### 26. Improve Study Sessions Page

Route:

```txt
/dashboard/sessions
```

Changes:

- Log Session menjadi primary action.
- Form dipindahkan ke dialog.
- Duration menjadi main value card.
- Subject dan timestamp menjadi metadata.
- Mood tetap terlihat.
- Notes memakai line clamp.
- Edit/Delete masuk action menu.

Session card example:

```txt
45 min
Next.js · Authentication Plan
Focused
Monday, 13 July · 08:30
```

---

### 27. Improve Calendar Page

Route:

```txt
/dashboard/calendar
```

Changes:

- Timeline lebih jelas.
- Date group heading sticky optional.
- Overdue group diberi penekanan ringan.
- Event type tidak terlalu mendominasi.
- Due status menjadi primary visual.
- Link `View Task` atau `View Plan` lebih jelas.
- Summary cards dipadatkan.

Tidak membuat full calendar grid pada issue ini.

---

### 28. Improve Analytics Page

Route:

```txt
/dashboard/analytics
```

Changes:

- Page summary menjelaskan periode data.
- Stat cards dipadatkan.
- Chart section memiliki title dan supporting description.
- Chart card memiliki consistent height.
- Legend tidak terlalu ramai.
- Empty data memiliki CTA ke Log Session atau Add Task.
- Primary insight diletakkan di bagian atas.

Recommended order:

```txt
Summary Metrics
Weekly Study Trend
Subject Distribution
Task Completion
Mood Distribution
Recent Performance Insight
```

---

### 29. Improve AI Generator Page

Route:

```txt
/dashboard/ai
```

Changes:

- Form dan preview memiliki visual separation yang jelas.
- Model provider detail tidak perlu terlalu ditonjolkan kepada user.
- `Powered by NVIDIA` dapat ditampilkan sebagai small supporting label.
- Coding-related toggle memiliki description.
- Generate button menjadi primary.
- Preview memiliki header, metadata, dan task list hierarchy.
- Save button sticky pada bagian bawah preview desktop optional.
- Generated result tidak tampak seperti raw JSON.

Flow:

```txt
Input
Generate
Review
Save
```

Tampilkan step indicator kecil bila membantu.

---

### 30. Improve Settings Page

Route:

```txt
/dashboard/settings
```

Changes:

- Pisahkan Profile dan Account Information.
- Email readonly atau editable sesuai business logic.
- Avatar initials memiliki visual yang konsisten.
- Save action tetap jelas.
- Danger zone hanya ditampilkan jika fitur terkait benar-benar tersedia.
- Jangan membuat danger zone palsu.

---

## Status and Badge System

### 31. Standardize Status Indicators

Buat file:

```txt
components/common/status-indicator.tsx
```

Variants:

```txt
Neutral
Info
Success
Warning
Danger
```

Mapping:

```txt
NOT_STARTED → neutral
IN_PROGRESS → info
COMPLETED → success
PAUSED → warning
CANCELLED → danger

TODO → neutral
IN_PROGRESS → info
DONE → success

LOW → neutral
MEDIUM → info
HIGH → warning
URGENT → danger
```

Status harus memiliki:

```txt
Text
Optional dot/icon
Color
```

Jangan hanya mengandalkan warna.

---

### 32. Standardize Date Labels

Gunakan helper untuk:

```txt
Today
Tomorrow
Yesterday
Due in N days
Overdue by N days
```

Buat:

```txt
utils/date-label.ts
```

Functions:

```ts
getRelativeDateLabel();
getDeadlineStatus();
formatCompactDate();
```

Pastikan timezone behavior tetap konsisten dengan implementasi tanggal sebelumnya.

---

## Micro-Interaction

### 33. Add Subtle Interaction Feedback

Gunakan CSS transition untuk:

```txt
Card hover
Button hover
Action menu
Progress bar
Navigation active state
Dialog transition
```

Recommended:

```txt
duration-150 atau duration-200
```

Hindari:

```txt
Large scale animation
Bounce
Continuous card movement
Heavy blur animation
```

Dashboard harus terasa aktif, tetapi tetap fokus pada produktivitas.

---

### 34. Add Skeleton Consistency

Pastikan skeleton mengikuti layout baru:

```txt
Overview metric skeleton
Today focus skeleton
Quick action skeleton
Active plans skeleton
Deadline skeleton
Entity card skeleton
```

Jangan menggunakan skeleton lama yang bentuknya berbeda jauh.

---

## Accessibility Requirements

### 35. Navigation Accessibility

Requirements:

```txt
Active link memiliki aria-current="page"
Sidebar group memiliki heading atau label
Mobile drawer memiliki accessible title
Dropdown trigger memiliki aria-label
Focus state terlihat
```

---

### 36. Dialog Accessibility

Requirements:

```txt
Dialog memiliki title
Dialog memiliki description
Initial focus masuk ke field pertama
Escape menutup dialog
Focus kembali ke trigger
Delete dialog menyebut nama data
```

Delete confirmation example:

```txt
Delete “Learn Next.js”?

This action cannot be undone and may affect related data.
```

---

### 37. Action Menu Accessibility

Requirements:

```txt
Trigger memiliki label
Menu dapat digunakan keyboard
Destructive action memiliki text, bukan icon saja
Disabled item tidak bisa dipilih
```

---

## Responsive Requirements

### 38. Dashboard Overview

Mobile:

```txt
Greeting stack
Metric cards satu kolom atau dua kolom
Today Focus full width
Quick Actions dua kolom
Sections satu kolom
```

Desktop:

```txt
Metric cards empat kolom
Today Focus dan Quick Actions berdampingan
Plans dan Deadlines berdampingan
Analytics dan Activity berdampingan
```

---

### 39. Page Actions

Mobile:

```txt
Create button full width atau compact sticky action
Filters stack
Action menu tetap mudah ditekan
```

Desktop:

```txt
Create button di page header
Filters satu baris jika cukup ruang
```

---

### 40. Dialog Forms

Mobile:

```txt
Width calc(100vw - 1rem)
Maximum height viewport
Scrollable content
Sticky footer optional
```

Desktop:

```txt
Max width sesuai form
Study Plan form dapat menggunakan max-w-2xl
```

---

## Performance Requirements

### 41. Avoid Unnecessary Client Conversion

Jangan mengubah seluruh dashboard page menjadi Client Component jika tidak diperlukan.

Server Components tetap digunakan untuk:

```txt
Layout shell
Session validation
Server-rendered page wrapper
Static headings
```

Client Components digunakan untuk:

```txt
Dialog state
Dropdown state
Filter controls
Mutation forms
Quick status action
```

---

### 42. Avoid Additional Database Queries

UI redesign harus menggunakan data/query yang sudah tersedia.

Query baru hanya boleh ditambahkan jika:

```txt
Data benar-benar dibutuhkan
Query tetap user-scoped
Tidak menduplikasi query existing
```

Jangan menambah query hanya untuk decorative UI.

---

## Acceptance Criteria

- Sidebar memiliki navigation group.
- Workspace, Insights, dan Account group tersedia.
- Desktop dan mobile menggunakan navigation data yang sama.
- Sidebar active state lebih jelas.
- Topbar memiliki breadcrumb.
- Topbar memiliki quick create action.
- User menu lebih ringkas.
- Dashboard overview memiliki greeting.
- Dashboard overview memiliki date context.
- Dashboard overview memiliki actionable metrics.
- Today’s Focus tersedia.
- Quick Actions tersedia.
- Active Study Plans lebih jelas.
- Upcoming Deadlines lebih jelas.
- Recent Activity tersedia menggunakan data existing.
- Page header konsisten di seluruh dashboard.
- Primary action maksimal satu pada setiap page header.
- Secondary card actions menggunakan dropdown menu.
- Entity cards memiliki hierarchy konsisten.
- Status indicator konsisten.
- Priority indicator konsisten.
- Date label lebih mudah dipahami.
- Create Subject menggunakan dialog atau drawer.
- Create Study Plan menggunakan dialog atau drawer.
- Create Task menggunakan dialog atau drawer.
- Log Study Session menggunakan dialog atau drawer.
- Existing form validation tetap digunakan.
- Form hanya reset setelah success.
- Dialog hanya tertutup setelah success.
- Subject page UI diperbaiki.
- Study Plan page UI diperbaiki.
- Task page UI diperbaiki.
- Study Session page UI diperbaiki.
- Calendar page UI diperbaiki.
- Analytics page UI diperbaiki.
- AI Generator page UI diperbaiki.
- Settings page UI diperbaiki.
- Search, filter, dan sort tetap berfungsi.
- Toast notification tetap berfungsi.
- Empty, loading, dan error states tetap berfungsi.
- Responsive behavior tetap berfungsi.
- Keyboard navigation tetap berfungsi.
- Tidak ada horizontal overflow.
- Tidak ada schema database yang diubah.
- Tidak ada API route baru.
- Tidak ada shadcn/ui yang ditambahkan.
- Tidak ada business logic yang diubah.
- Tidak ada folder di dalam `src/`.
- Tidak ada error TypeScript.
- Tidak ada error lint.
- `pnpm format:check` berhasil.
- `pnpm build` berhasil.

## Testing Checklist

### 1. Test Dashboard Sidebar

Buka setiap menu.

Expected:

```txt
Navigation dikelompokkan.
Active menu terlihat.
Sidebar tidak terlalu ramai.
Mobile menu menggunakan group yang sama.
```

---

### 2. Test Topbar

Expected:

```txt
Breadcrumb sesuai route.
Quick create dapat dibuka.
User menu dapat dibuka.
Topbar tetap sticky.
```

---

### 3. Test Dashboard Overview

Buat data:

```txt
Subjects
Study Plans
Tasks dengan deadline
Study Sessions
```

Expected:

```txt
Metric cards menampilkan data real.
Today’s Focus menampilkan task relevan.
Active Plans menampilkan progress.
Deadlines diurutkan dengan benar.
Recent Activity menggunakan data existing.
```

---

### 4. Test Empty Dashboard

Gunakan user baru.

Expected:

```txt
Dashboard tetap menarik.
Quick action tampil.
Empty state menjelaskan langkah berikutnya.
Tidak ada card kosong tanpa penjelasan.
```

---

### 5. Test Create Dialog

Test:

```txt
Create Subject
Create Study Plan
Create Task
Log Study Session
```

Expected:

```txt
Dialog terbuka.
Validation tetap berjalan.
Mutation berjalan.
Toast tampil.
Dialog hanya ditutup jika berhasil.
Form reset setelah berhasil.
```

---

### 6. Test Card Action Menu

Test edit dan delete dari entity card.

Expected:

```txt
Action menu dapat dibuka.
Edit membuka dialog.
Delete membuka confirmation.
Action menu dapat digunakan keyboard.
```

---

### 7. Test Task UX

Aktifkan filter TODO.

Ubah task menjadi DONE.

Expected:

```txt
Status berubah.
Toast tampil.
Task hilang dari filter TODO.
Dashboard progress ikut update.
```

---

### 8. Test AI Generator UX

Generate study plan.

Expected:

```txt
Flow Input → Generate → Review → Save jelas.
Loading toast tampil.
Preview tidak seperti raw JSON.
Save action terlihat jelas.
```

---

### 9. Test Responsive Layout

Viewport:

```txt
320 × 568
375 × 667
768 × 1024
1280 × 720
1440 × 900
```

Expected:

```txt
Sidebar dan topbar tetap usable.
Dialog tidak keluar viewport.
Card tidak overflow.
Quick action tetap mudah ditekan.
```

---

### 10. Test Keyboard Navigation

Expected:

```txt
Sidebar dapat diakses.
Quick create dapat dibuka.
Action menu dapat digunakan.
Dialog dapat ditutup dengan Escape.
Focus state terlihat.
```

---

### 11. Test Existing Features

Pastikan tetap bekerja:

```txt
Authentication
CRUD
Search
Filter
Sort
Toast
Loading state
Error state
Calendar
Analytics
AI generation
```

---

### 12. Test Horizontal Overflow

Jalankan:

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth;
```

Expected:

```txt
false
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

## Notes

- Issue ini berfokus pada UI dan UX, bukan fitur bisnis baru.
- Jangan menambahkan visual hanya untuk memenuhi ruang.
- Setiap section harus memiliki tujuan yang jelas.
- Primary action harus mudah ditemukan.
- Secondary action sebaiknya disembunyikan dalam action menu.
- Jangan membuat dashboard terlalu padat.
- Jangan membuat card terlalu tinggi tanpa alasan.
- Pertahankan clean white SaaS direction.
- Gunakan indigo sebagai accent, bukan sebagai background besar di semua tempat.
- Jangan mengubah seluruh page menjadi Client Component.
- Gunakan Radix UI untuk dialog dan dropdown.
- Existing responsive pattern dari ISSUE-018 harus dipertahankan.
- Existing state components dari ISSUE-017 harus digunakan.
- Existing toast system dari ISSUE-019 harus digunakan.
- Existing search/filter dari ISSUE-020 harus tetap digunakan.

## Suggested Commit Message

```bash
refactor: improve dashboard ui and user experience
```
