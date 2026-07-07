# ISSUE-005 — Build Public Landing Page Sections

## Status

Planned

## Priority

High

## Type

Feature / Marketing Page

## Summary

Membangun landing page publik StudyFlow yang lebih lengkap, modern, dan portfolio-ready. Landing page harus menggunakan desain clean white SaaS, typography modern, gradient text, reusable components, serta menampilkan statistik global dari database.

Issue ini melanjutkan setup authentication dan database yang sudah dibuat pada issue sebelumnya.

Landing page akan menjadi halaman utama aplikasi untuk menjelaskan value StudyFlow kepada user sebelum mereka register/login.

## Background

StudyFlow adalah aplikasi fullstack study planner untuk membantu user mengatur subject, study plan, task, study session, deadline, dan analytics.

Saat ini project sudah memiliki:

```txt
Next.js App Router
Tailwind CSS
Custom UI components
Radix UI primitives
Drizzle ORM
PostgreSQL schema
Auth.js
Server Actions
TanStack Query
```

Pada issue ini, fokusnya adalah memperbaiki halaman `/` agar tidak hanya menjadi placeholder, tetapi menjadi landing page lengkap yang menampilkan:

```txt
Hero section
Dashboard preview
Global statistics
Feature section
How it works
Analytics preview
Testimonials
Final CTA
```

Statistik landing page harus diambil dari database, bukan hardcode sepenuhnya.

## Goals

- Membuat landing page publik yang lengkap.
- Membuat section landing page yang reusable.
- Menggunakan clean white SaaS design.
- Menggunakan typography modern dan gradient text.
- Menampilkan statistik global dari database.
- Menampilkan testimonials dari database.
- Membuat dashboard preview visual.
- Membuat section features.
- Membuat section how it works.
- Membuat section analytics preview.
- Membuat final CTA.
- Menjaga halaman tetap responsive.
- Menjaga halaman tetap ringan dan portfolio-ready.
- Memastikan user yang belum login tetap bisa melihat landing page.
- Memastikan CTA mengarah ke `/register` dan `/login`.

## Non-Goals

- Tidak membuat CRUD subject.
- Tidak membuat CRUD study plan.
- Tidak membuat CRUD task.
- Tidak membuat CRUD study session.
- Tidak membuat dashboard data real.
- Tidak membuat admin dashboard.
- Tidak membuat payment/pricing logic.
- Tidak membuat AI feature.
- Tidak membuat animation kompleks.
- Tidak membuat upload image.
- Tidak membuat protected route baru.
- Tidak mengubah schema database kecuali benar-benar diperlukan.
- Tidak mengubah authentication flow.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Custom UI Components
- Lucide React
- Drizzle ORM
- PostgreSQL
- Server Components

## Design Direction

Gunakan style berikut:

```txt
Theme: Clean white SaaS
Background: White / off-white
Text: Slate / navy
Accent: Indigo, violet, cyan
Cards: White with soft border and subtle shadow
Typography: Large, clean, modern
Visual style: Premium but friendly
```

Gunakan gradient text untuk kata penting seperti:

```txt
Study better
Track your progress
Build better study habits
```

Hindari tampilan yang terlalu mirip dashboard bawaan shadcn.

## Public Landing Sections

Landing page harus memiliki section berikut:

```txt
1. Header / Navbar
2. Hero Section
3. Dashboard Preview Section
4. Global Stats Section
5. Features Section
6. How It Works Section
7. Analytics Preview Section
8. Testimonials Section
9. Final CTA Section
10. Footer
```

## Folder Structure

Gunakan struktur tanpa `src/`:

```txt
app/
└── page.tsx

features/
└── landing/
    ├── components/
    │   ├── analytics-preview-section.tsx
    │   ├── dashboard-preview-card.tsx
    │   ├── features-section.tsx
    │   ├── final-cta-section.tsx
    │   ├── global-stats-section.tsx
    │   ├── hero-section.tsx
    │   ├── how-it-works-section.tsx
    │   └── testimonials-section.tsx
    ├── data/
    │   └── landing-content.ts
    └── queries/
        ├── get-landing-stats.ts
        └── get-published-testimonials.ts

components/
├── common/
│   ├── section-header.tsx
│   └── stat-card.tsx
└── layout/
    ├── marketing-shell.tsx
    ├── site-header.tsx
    └── site-footer.tsx
```

## Data Sources

Landing page menggunakan data dari:

```txt
users
study_plans
study_tasks
study_sessions
subjects
testimonials
```

Statistik yang ditampilkan:

```txt
Total Users
Total Study Plans
Total Study Sessions
Total Hours Tracked
Average Task Completion Rate
Published Testimonials
```

## Implementation Steps

### 1. Create Landing Feature Folder

Buat folder:

```txt
features/landing/
```

Dengan struktur:

```txt
features/landing/
├── components/
├── data/
└── queries/
```

Expected:

```txt
Folder landing feature tersedia dan siap digunakan.
```

---

### 2. Create Landing Content File

Buat file:

```txt
features/landing/data/landing-content.ts
```

Isi data statis landing page:

```ts
import { BarChart3, CalendarCheck, CheckCircle2, Clock3, ListTodo, Target } from "lucide-react";

export const landingFeatures = [
  {
    title: "Study Plan Management",
    description:
      "Create structured learning plans with clear goals, deadlines, and progress tracking.",
    icon: CalendarCheck,
  },
  {
    title: "Task Tracking",
    description: "Break large learning goals into smaller tasks and track every step clearly.",
    icon: ListTodo,
  },
  {
    title: "Study Session Tracker",
    description: "Record your learning duration, notes, mood, and daily study activity.",
    icon: Clock3,
  },
  {
    title: "Analytics Dashboard",
    description: "Understand your learning habits through progress charts and useful insights.",
    icon: BarChart3,
  },
  {
    title: "Goal-Oriented Learning",
    description: "Stay focused on your target by connecting subjects, plans, tasks, and sessions.",
    icon: Target,
  },
  {
    title: "Progress Overview",
    description: "Review what you have completed and what needs more attention.",
    icon: CheckCircle2,
  },
];

export const howItWorksSteps = [
  {
    step: "01",
    title: "Create your subject",
    description:
      "Start by creating learning categories such as Next.js, Laravel, Django, or English.",
  },
  {
    step: "02",
    title: "Build your study plan",
    description: "Set your goal, deadline, priority, and estimated study hours.",
  },
  {
    step: "03",
    title: "Track tasks and sessions",
    description: "Complete tasks, record study sessions, and review your learning progress.",
  },
];
```

---

### 3. Create Landing Stats Query

Buat file:

```txt
features/landing/queries/get-landing-stats.ts
```

Isi:

```ts
import { sql } from "drizzle-orm";

import { db } from "@/db";
import { studyPlans, studySessions, studyTasks, testimonials, users } from "@/db/schema";

export type LandingStats = {
  totalUsers: number;
  totalStudyPlans: number;
  totalStudySessions: number;
  totalHoursTracked: number;
  averageCompletionRate: number;
  totalPublishedTestimonials: number;
};

export async function getLandingStats(): Promise<LandingStats> {
  const [result] = await db
    .select({
      totalUsers: sql<number>`count(distinct ${users.id})::int`,
      totalStudyPlans: sql<number>`count(distinct ${studyPlans.id})::int`,
      totalStudySessions: sql<number>`count(distinct ${studySessions.id})::int`,
      totalHoursTracked: sql<number>`coalesce(round(sum(${studySessions.durationMinutes}) / 60.0), 0)::int`,
      completedTasks: sql<number>`count(distinct case when ${studyTasks.status} = 'DONE' then ${studyTasks.id} end)::int`,
      totalTasks: sql<number>`count(distinct ${studyTasks.id})::int`,
      totalPublishedTestimonials: sql<number>`count(distinct case when ${testimonials.isPublished} = true then ${testimonials.id} end)::int`,
    })
    .from(users)
    .leftJoin(studyPlans, sql`${studyPlans.userId} = ${users.id}`)
    .leftJoin(studySessions, sql`${studySessions.userId} = ${users.id}`)
    .leftJoin(studyTasks, sql`${studyTasks.userId} = ${users.id}`)
    .leftJoin(testimonials, sql`${testimonials.isPublished} = true`);

  const completionRate =
    result.totalTasks > 0 ? Math.round((result.completedTasks / result.totalTasks) * 100) : 0;

  return {
    totalUsers: result.totalUsers,
    totalStudyPlans: result.totalStudyPlans,
    totalStudySessions: result.totalStudySessions,
    totalHoursTracked: result.totalHoursTracked,
    averageCompletionRate: completionRate,
    totalPublishedTestimonials: result.totalPublishedTestimonials,
  };
}
```

Catatan:

- Statistik ini boleh disederhanakan jika query terlalu kompleks.
- Jika query join menyebabkan data count tidak akurat, pecah menjadi beberapa query kecil.
- Prioritaskan akurasi data daripada query yang terlalu singkat.

---

### 4. Create Published Testimonials Query

Buat file:

```txt
features/landing/queries/get-published-testimonials.ts
```

Isi:

```ts
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { testimonials } from "@/db/schema";

export async function getPublishedTestimonials() {
  return db
    .select({
      id: testimonials.id,
      name: testimonials.name,
      role: testimonials.role,
      message: testimonials.message,
      rating: testimonials.rating,
      createdAt: testimonials.createdAt,
    })
    .from(testimonials)
    .where(eq(testimonials.isPublished, true))
    .orderBy(desc(testimonials.createdAt))
    .limit(6);
}
```

---

### 5. Create Hero Section

Buat file:

```txt
features/landing/components/hero-section.tsx
```

Requirements:

- Headline besar.
- Gradient text.
- Subheadline jelas.
- CTA ke `/register`.
- Secondary CTA ke `/login` atau `/dashboard`.
- Badge kecil seperti `Fullstack Study Planner`.

Copy yang digunakan:

```txt
Plan smarter. Study better. Track your progress.
```

Subcopy:

```txt
StudyFlow helps students and developers organize study goals, manage tasks, track learning sessions, and review progress in one clean dashboard.
```

CTA:

```txt
Start Planning
Login
```

---

### 6. Create Dashboard Preview Card

Buat file:

```txt
features/landing/components/dashboard-preview-card.tsx
```

Requirements:

- Menampilkan visual dashboard dummy.
- Gunakan white cards.
- Gunakan progress bar.
- Gunakan mini bar chart visual.
- Tidak perlu data real.
- Harus responsive.

Isi preview:

```txt
Weekly Study Hours: 8.5h
Tasks Done: 12/18
Study Streak: 4 days
Active Plans: 3
```

---

### 7. Create Global Stats Section

Buat file:

```txt
features/landing/components/global-stats-section.tsx
```

Props:

```ts
import type { LandingStats } from "@/features/landing/queries/get-landing-stats";

type GlobalStatsSectionProps = {
  stats: LandingStats;
};
```

Stat cards:

```txt
Total Users
Study Plans Created
Study Sessions Completed
Hours Tracked
Average Completion Rate
Published Testimonials
```

Format angka:

```txt
1240 → 1,240+
92 → 92%
```

Gunakan helper kecil jika perlu:

```ts
function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
```

---

### 8. Create Features Section

Buat file:

```txt
features/landing/components/features-section.tsx
```

Requirements:

- Menggunakan data dari `landingFeatures`.
- Layout grid responsive.
- Setiap card punya icon, title, description.
- Gunakan custom `Card`.
- Gunakan `SectionHeader`.

---

### 9. Create How It Works Section

Buat file:

```txt
features/landing/components/how-it-works-section.tsx
```

Requirements:

- 3 steps.
- Data dari `howItWorksSteps`.
- Layout responsive.
- Gunakan nomor step besar.
- Tetap clean dan white.

---

### 10. Create Analytics Preview Section

Buat file:

```txt
features/landing/components/analytics-preview-section.tsx
```

Requirements:

- Menampilkan preview analytics.
- Tidak perlu Recharts dulu.
- Boleh pakai dummy visual dengan Tailwind.
- Isi preview:

  - Study hours chart
  - Task completion overview
  - Subject distribution
  - Weekly progress

Catatan:

- Recharts akan digunakan nanti di dashboard analytics real.
- Untuk landing page, visual dummy cukup.

---

### 11. Create Testimonials Section

Buat file:

```txt
features/landing/components/testimonials-section.tsx
```

Props:

```ts
type TestimonialItem = {
  id: string;
  name: string;
  role: string | null;
  message: string;
  rating: number;
};

type TestimonialsSectionProps = {
  testimonials: TestimonialItem[];
};
```

Requirements:

- Tampilkan maksimal 6 testimonials.
- Jika tidak ada testimonial, tampilkan empty fallback sederhana.
- Rating bisa ditampilkan dengan angka atau star icon.
- Hanya testimonial dengan `isPublished = true` yang muncul.

Fallback copy:

```txt
No testimonials yet. Be the first focused learner.
```

---

### 12. Create Final CTA Section

Buat file:

```txt
features/landing/components/final-cta-section.tsx
```

Requirements:

- Heading kuat.
- Gradient accent.
- CTA ke `/register`.
- Secondary link ke `/login`.

Copy:

```txt
Ready to build better study habits?
```

Subcopy:

```txt
Start organizing your learning goals, tasks, and study sessions with StudyFlow.
```

---

### 13. Update Home Page

Edit file:

```txt
app/page.tsx
```

Gunakan query dan section components:

```tsx
import { MarketingShell } from "@/components/layout/marketing-shell";
import { AnalyticsPreviewSection } from "@/features/landing/components/analytics-preview-section";
import { FeaturesSection } from "@/features/landing/components/features-section";
import { FinalCtaSection } from "@/features/landing/components/final-cta-section";
import { GlobalStatsSection } from "@/features/landing/components/global-stats-section";
import { HeroSection } from "@/features/landing/components/hero-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works-section";
import { TestimonialsSection } from "@/features/landing/components/testimonials-section";
import { getLandingStats } from "@/features/landing/queries/get-landing-stats";
import { getPublishedTestimonials } from "@/features/landing/queries/get-published-testimonials";

export default async function HomePage() {
  const [stats, testimonials] = await Promise.all([getLandingStats(), getPublishedTestimonials()]);

  return (
    <MarketingShell>
      <main>
        <HeroSection />
        <GlobalStatsSection stats={stats} />
        <FeaturesSection />
        <HowItWorksSection />
        <AnalyticsPreviewSection />
        <TestimonialsSection testimonials={testimonials} />
        <FinalCtaSection />
      </main>
    </MarketingShell>
  );
}
```

---

### 14. Update Header Navigation

Cek file:

```txt
components/layout/site-header.tsx
```

Pastikan navigation mengarah ke section yang benar:

```txt
#features
#how-it-works
#analytics
#testimonials
```

Update constants jika perlu:

```txt
constants/navigation.ts
```

Marketing nav:

```ts
export const marketingNavItems = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "How It Works",
    href: "#how-it-works",
  },
  {
    label: "Analytics",
    href: "#analytics",
  },
  {
    label: "Testimonials",
    href: "#testimonials",
  },
];
```

---

### 15. Add Empty State Handling

Landing page tidak boleh error jika database kosong.

Pastikan:

```txt
Jika total users = 0, tampilkan 0
Jika total plans = 0, tampilkan 0
Jika total sessions = 0, tampilkan 0
Jika total tasks = 0, completion rate = 0%
Jika testimonials kosong, tampilkan fallback
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

---

## Expected Folder Structure

Setelah issue selesai:

```txt
app/
└── page.tsx

features/
└── landing/
    ├── components/
    │   ├── analytics-preview-section.tsx
    │   ├── dashboard-preview-card.tsx
    │   ├── features-section.tsx
    │   ├── final-cta-section.tsx
    │   ├── global-stats-section.tsx
    │   ├── hero-section.tsx
    │   ├── how-it-works-section.tsx
    │   └── testimonials-section.tsx
    ├── data/
    │   └── landing-content.ts
    └── queries/
        ├── get-landing-stats.ts
        └── get-published-testimonials.ts
```

## Acceptance Criteria

- Landing page tersedia di `/`.
- Landing page menggunakan `MarketingShell`.
- Hero section tersedia.
- Dashboard preview card tersedia.
- Global stats section tersedia.
- Features section tersedia.
- How it works section tersedia.
- Analytics preview section tersedia.
- Testimonials section tersedia.
- Final CTA section tersedia.
- Statistik global diambil dari database.
- Testimonials diambil dari database.
- Landing page tetap aman saat database kosong.
- CTA register mengarah ke `/register`.
- CTA login mengarah ke `/login`.
- Header navigation mengarah ke section landing yang benar.
- Desain menggunakan clean white SaaS style.
- Typography terlihat modern dan rapi.
- Gradient text digunakan pada hero atau CTA.
- Layout responsive untuk mobile, tablet, dan desktop.
- Tidak ada CRUD yang dibuat pada issue ini.
- Tidak ada perubahan authentication flow.
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
http://localhost:3000
```

Expected:

```txt
Landing page tampil dengan semua section.
```

---

### 2. Test Landing Sections

Pastikan section berikut tampil:

```txt
Hero
Stats
Features
How It Works
Analytics Preview
Testimonials
Final CTA
Footer
```

Expected:

```txt
Semua section tampil rapi dan tidak overflow.
```

---

### 3. Test Public Access

Saat belum login, buka:

```txt
http://localhost:3000
```

Expected:

```txt
Landing page tetap bisa diakses tanpa login.
```

---

### 4. Test CTA Links

Klik:

```txt
Start Planning
Login
```

Expected:

```txt
Start Planning mengarah ke /register.
Login mengarah ke /login.
```

---

### 5. Test Header Anchor Links

Klik nav:

```txt
Features
How It Works
Analytics
Testimonials
```

Expected:

```txt
Halaman scroll ke section yang sesuai.
```

---

### 6. Test Database Stats

Pastikan database sudah memiliki seed data.

Jalankan:

```bash
pnpm db:seed
```

Lalu buka landing page.

Expected:

```txt
Statistik global tampil berdasarkan data database.
```

---

### 7. Test Empty Database Fallback

Jika database kosong, landing page tidak boleh error.

Expected:

```txt
Statistik tampil 0.
Testimonials menampilkan fallback.
Halaman tetap render normal.
```

---

### 8. Run Checks

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

- Jangan membuat fitur CRUD di issue ini.
- Jangan mengubah authentication flow.
- Jangan membuat dashboard real data di issue ini.
- Jangan menambahkan AI feature di issue ini.
- Jangan menggunakan shadcn/ui.
- Gunakan custom Tailwind components yang sudah ada.
- Gunakan query helper untuk read-only database logic.
- Jangan expose data sensitif user.
- Landing stats hanya boleh menampilkan data agregat.
- Testimonials yang tampil hanya `isPublished = true`.
- Jika query stats terlalu kompleks, pecah menjadi beberapa query kecil agar lebih mudah dibaca.
- Prioritaskan visual yang clean, responsive, dan portfolio-ready.

## Suggested Commit Message

```bash
feat: build public landing page sections
```
