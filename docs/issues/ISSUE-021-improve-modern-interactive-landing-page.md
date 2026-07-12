# ISSUE-021 — Improve Modern Interactive Landing Page

## Status

Planned

## Priority

High

## Type

UI/UX Improvement / Marketing Page

## Summary

Meningkatkan tampilan landing page StudyFlow agar lebih modern, menarik, aktif, dan meyakinkan sebagai project portfolio fullstack.

Landing page yang sudah ada tetap digunakan sebagai fondasi. Issue ini tidak membuat landing page dari nol, tetapi memperbaiki visual hierarchy, layout, product showcase, navigation, micro-interaction, dan scroll animation.

Landing page harus terasa seperti produk SaaS modern, bukan sekadar kumpulan section dan card statis.

Route utama:

```txt
/
```

## Current Landing Page

Landing page saat ini memiliki struktur:

```txt
Marketing Header
Hero Section
Global Statistics
Features Section
How It Works
Analytics Preview
Testimonials
Final CTA
Marketing Footer
```

Existing files:

```txt
app/page.tsx

components/layout/
├── marketing-shell.tsx
├── site-header.tsx
└── site-footer.tsx

features/landing/components/
├── analytics-preview-section.tsx
├── dashboard-preview-card.tsx
├── features-section.tsx
├── final-cta-section.tsx
├── global-stats-section.tsx
├── hero-section.tsx
├── how-it-works-section.tsx
└── testimonials-section.tsx
```

Existing server data:

```txt
getLandingStats()
getPublishedTestimonials()
```

Query tersebut tetap digunakan dan tidak boleh diganti dengan dummy data.

## Main Problems

Beberapa bagian landing page masih terasa statis:

```txt
Hero hanya menggunakan teks dan dashboard card statis
Feature cards memiliki ukuran dan visual yang sama
Dashboard preview belum memiliki interaction
Tidak ada scroll reveal animation
Tidak ada product showcase interaktif
Tidak ada active navigation berdasarkan posisi section
Mobile navigation belum tersedia
Statistik belum memiliki count-up animation
How It Works masih berupa informasi statis
Testimonial belum memiliki carousel interaction
Section background terlalu seragam
Visual product belum cukup kuat untuk portfolio
```

## Design Direction

Gunakan gaya:

```txt
Modern white SaaS
Soft gradient
Subtle glass effect
Bento grid
Layered dashboard mockup
Interactive product preview
Smooth scroll reveal
Subtle floating elements
High contrast typography
Rounded cards
Soft shadows
Minimal but active animation
```

Primary visual direction:

```txt
Background: white, slate-50, subtle indigo/cyan tint
Primary accent: indigo
Secondary accent: cyan
Supporting accent: violet
Text: slate-950 and slate-600
Border: slate-200/70
Radius: rounded-2xl to rounded-[2rem]
```

Landing page harus tetap konsisten dengan dashboard StudyFlow.

## Goals

- Memperbaiki visual hierarchy landing page.
- Membuat hero lebih menarik dan product-focused.
- Membuat dashboard preview lebih hidup.
- Menambahkan scroll reveal animation.
- Menambahkan hover dan press interaction.
- Membuat feature section menggunakan bento grid.
- Menambahkan product showcase interaktif.
- Membuat statistik memiliki count-up animation.
- Membuat How It Works lebih aktif.
- Membuat testimonial carousel.
- Membuat header lebih modern.
- Menambahkan mobile navigation.
- Menambahkan active section navigation.
- Memperbaiki final CTA.
- Memperbaiki footer.
- Menambahkan gradient dan decorative background secara terkontrol.
- Mempertahankan server-rendered landing data.
- Mempertahankan performa dan accessibility.
- Menghormati `prefers-reduced-motion`.
- Memastikan landing page responsive mulai viewport 320px.
- Tidak menggunakan statistik atau testimonial palsu.

## Non-Goals

- Tidak membuat ulang dashboard application.
- Tidak mengubah authentication.
- Tidak mengubah schema database.
- Tidak membuat tabel baru.
- Tidak membuat CMS.
- Tidak membuat pricing section.
- Tidak membuat payment integration.
- Tidak membuat blog.
- Tidak membuat video background.
- Tidak membuat efek 3D berat.
- Tidak menggunakan WebGL.
- Tidak membuat animation berlebihan.
- Tidak membuat fake company logo.
- Tidak membuat fake user count.
- Tidak membuat fake testimonial.
- Tidak membuat API route baru.
- Tidak menambahkan shadcn/ui.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Motion for React
- Radix Dialog
- Lucide React
- Server Components
- Client Components hanya untuk bagian interaktif

## Required Package

Install Motion:

```bash
pnpm add motion
```

Import animation dari:

```ts
import { m } from "motion/react";
```

atau:

```ts
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
```

Jangan install:

```bash
framer-motion
```

Gunakan package terbaru:

```txt
motion
```

## Important Architecture Rule

Jangan mengubah seluruh landing page menjadi Client Component.

Tetap pertahankan:

```txt
app/page.tsx = Server Component
```

Client Component hanya digunakan untuk:

```txt
Motion provider
Mobile menu
Active section navigation
Animated counter
Hero interactive preview
Product showcase tabs
How It Works interaction
Testimonial carousel
```

Server Component tetap digunakan untuk:

```txt
Landing page data fetching
Static section wrapper
Static marketing content
SEO-readable content
```

## New Landing Page Structure

Susunan section yang direkomendasikan:

```txt
1. Site Header
2. Hero Section
3. Product Trust Strip
4. Global Statistics
5. Feature Bento Grid
6. Interactive Product Showcase
7. How StudyFlow Works
8. Analytics Highlight
9. Testimonials
10. Final CTA
11. Site Footer
```

Update `app/page.tsx`:

```tsx
import { MarketingShell } from "@/components/layout/marketing-shell";
import { AnalyticsPreviewSection } from "@/features/landing/components/analytics-preview-section";
import { FeatureBentoSection } from "@/features/landing/components/feature-bento-section";
import { FinalCtaSection } from "@/features/landing/components/final-cta-section";
import { GlobalStatsSection } from "@/features/landing/components/global-stats-section";
import { HeroSection } from "@/features/landing/components/hero-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works-section";
import { ProductShowcaseSection } from "@/features/landing/components/product-showcase-section";
import { ProductTrustStrip } from "@/features/landing/components/product-trust-strip";
import { TestimonialsSection } from "@/features/landing/components/testimonials-section";
import { getLandingStats } from "@/features/landing/queries/get-landing-stats";
import { getPublishedTestimonials } from "@/features/landing/queries/get-published-testimonials";

export default async function HomePage() {
  const [stats, testimonials] = await Promise.all([getLandingStats(), getPublishedTestimonials()]);

  return (
    <MarketingShell>
      <main className="overflow-hidden">
        <HeroSection />
        <ProductTrustStrip />
        <GlobalStatsSection stats={stats} />
        <FeatureBentoSection />
        <ProductShowcaseSection />
        <HowItWorksSection />
        <AnalyticsPreviewSection />
        <TestimonialsSection testimonials={testimonials} />
        <FinalCtaSection />
      </main>
    </MarketingShell>
  );
}
```

## Folder Structure

Gunakan struktur tanpa `src/`.

```txt
components/
├── layout/
│   ├── marketing-shell.tsx
│   ├── site-footer.tsx
│   ├── site-header.tsx
│   └── site-mobile-menu.tsx
└── providers/
    └── landing-motion-provider.tsx

features/
└── landing/
    ├── components/
    │   ├── analytics-preview-section.tsx
    │   ├── animated-counter.tsx
    │   ├── feature-bento-card.tsx
    │   ├── feature-bento-section.tsx
    │   ├── final-cta-section.tsx
    │   ├── floating-activity-card.tsx
    │   ├── global-stats-section.tsx
    │   ├── hero-product-demo.tsx
    │   ├── hero-section.tsx
    │   ├── how-it-works-section.tsx
    │   ├── landing-section.tsx
    │   ├── product-showcase-section.tsx
    │   ├── product-showcase-tabs.tsx
    │   ├── product-trust-strip.tsx
    │   ├── reveal.tsx
    │   ├── testimonial-carousel.tsx
    │   └── testimonials-section.tsx
    ├── data/
    │   └── landing-content.ts
    ├── hooks/
    │   └── use-active-landing-section.ts
    └── types/
        └── landing.ts
```

Existing component yang boleh diganti:

```txt
dashboard-preview-card.tsx
features-section.tsx
```

Replacement:

```txt
dashboard-preview-card.tsx → hero-product-demo.tsx
features-section.tsx → feature-bento-section.tsx
```

File lama boleh dihapus setelah tidak digunakan.

## Implementation Steps

### 1. Install Motion

Jalankan:

```bash
pnpm add motion
```

Kemudian:

```bash
pnpm lint
pnpm format
```

Expected:

```txt
Package motion tersedia.
Tidak ada lint error.
Tidak ada format error.
```

---

### 2. Create Landing Motion Provider

Buat file:

```txt
components/providers/landing-motion-provider.tsx
```

Isi:

```tsx
"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

type LandingMotionProviderProps = {
  children: ReactNode;
};

export function LandingMotionProvider({ children }: LandingMotionProviderProps) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}
```

Tujuan:

```txt
Mengaktifkan Motion hanya pada landing page
Mengurangi animation bundle
Menghormati reduced motion preference
Tidak memengaruhi dashboard application
```

---

### 3. Register Landing Motion Provider

Edit:

```txt
components/layout/marketing-shell.tsx
```

Isi yang direkomendasikan:

```tsx
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LandingMotionProvider } from "@/components/providers/landing-motion-provider";

type MarketingShellProps = {
  children: ReactNode;
};

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <LandingMotionProvider>
      <div className="min-h-screen bg-white text-slate-950">
        <SiteHeader />
        {children}
        <SiteFooter />
      </div>
    </LandingMotionProvider>
  );
}
```

---

### 4. Create Reusable Landing Reveal

Buat file:

```txt
features/landing/components/reveal.tsx
```

Isi:

```tsx
"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <m.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
```

Rules:

```txt
Animation hanya dijalankan sekali.
Gunakan durasi sekitar 0.4–0.7 detik.
Jangan memberikan reveal animation pada setiap teks kecil.
Gunakan stagger ringan pada card group.
```

---

### 5. Create Landing Section Wrapper

Buat file:

```txt
features/landing/components/landing-section.tsx
```

Isi:

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type LandingSectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function LandingSection({
  id,
  children,
  className,
  containerClassName,
}: LandingSectionProps) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-20 sm:py-24 lg:py-28", className)}>
      <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
```

Gunakan wrapper tersebut untuk memastikan:

```txt
Section spacing konsisten
Anchor tidak tertutup sticky header
Container width konsisten
```

---

## Header Improvement

### 6. Improve Site Header

Edit:

```txt
components/layout/site-header.tsx
```

Requirements:

- Sticky header.
- Background transparan saat berada di atas hero.
- Background lebih solid setelah user scroll.
- Brand memiliki icon sederhana.
- Desktop navigation memiliki hover indicator.
- Active section memiliki visual indicator.
- Login dan Get Started tetap tersedia.
- Mobile memiliki menu button.
- Mobile navigation menggunakan Radix Dialog.
- Header tidak overflow pada viewport 320px.

Recommended desktop navigation:

```txt
Features
How It Works
Analytics
Testimonials
```

Recommended CTA:

```txt
Login
Get Started
```

Brand structure:

```tsx
<Link href="/" className="flex items-center gap-2.5">
  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
    S
  </span>

  <span className="text-lg font-bold tracking-tight">StudyFlow</span>
</Link>
```

Jangan gunakan logo eksternal.

---

### 7. Create Mobile Marketing Menu

Buat file:

```txt
components/layout/site-mobile-menu.tsx
```

Requirements:

- Client Component.
- Menggunakan Radix Dialog.
- Menu button tampil di bawah breakpoint `md`.
- Drawer muncul dari kanan.
- Navigation item menutup drawer.
- Login dan Get Started tersedia.
- Escape menutup drawer.
- Overlay dapat menutup drawer.
- Body scroll terkunci ketika drawer terbuka.

Mobile menu links:

```txt
Features
Product
How It Works
Analytics
Testimonials
Login
Get Started
```

Touch target minimal:

```txt
44px
```

---

### 8. Create Active Section Hook

Buat file:

```txt
features/landing/hooks/use-active-landing-section.ts
```

Sections:

```ts
export const landingSectionIds = [
  "features",
  "product",
  "how-it-works",
  "analytics",
  "testimonials",
] as const;
```

Gunakan `IntersectionObserver` untuk menentukan section aktif.

Expected:

```txt
Saat Features terlihat, link Features aktif.
Saat Analytics terlihat, link Analytics aktif.
Active indicator berpindah dengan animasi ringan.
```

Active navigation bersifat enhancement.

Jika JavaScript tidak tersedia, anchor link tetap berfungsi.

---

## Hero Improvement

### 9. Redesign Hero Section

Edit:

```txt
features/landing/components/hero-section.tsx
```

Gunakan two-column layout:

```txt
Left: copy, CTA, trust points
Right: interactive product demo
```

Recommended copy:

```txt
Eyebrow:
AI-powered study planning

Heading:
Turn ambitious goals into consistent progress.

Description:
Plan what to learn, organize every task, track focused sessions,
and understand your progress from one connected workspace.
```

Primary CTA:

```txt
Start Planning Free
```

Link:

```txt
/register
```

Secondary CTA:

```txt
See How It Works
```

Link:

```txt
#how-it-works
```

Trust points di bawah CTA:

```txt
Structured study plans
Progress analytics
AI-assisted planning
```

Gunakan icon `CheckCircle2`.

Jangan menampilkan klaim seperti:

```txt
Trusted by thousands
10,000+ active users
Best study planner
```

kecuali datanya benar-benar tersedia.

---

### 10. Add Hero Background

Hero background menggunakan:

```txt
Soft radial gradient
Subtle grid pattern
Blurred indigo glow
Blurred cyan glow
Very subtle noise effect optional
```

Recommended structure:

```tsx
<section className="relative isolate overflow-hidden border-b border-slate-200/70">
  <div className="absolute inset-0 -z-20 bg-white" />

  <div className="absolute inset-0 -z-10 bg-[radial-gradient(...)]" />

  <div className="absolute top-0 left-1/2 -z-10 h-[32rem] w-[32rem] rounded-full bg-indigo-300/20 blur-3xl" />

  <div className="absolute top-40 right-0 -z-10 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />

  {/* hero content */}
</section>
```

Rules:

```txt
Background tidak boleh mengganggu keterbacaan.
Tidak boleh menyebabkan horizontal overflow.
Tidak boleh menggunakan animation blur berat terus-menerus.
```

---

### 11. Create Interactive Hero Product Demo

Buat file:

```txt
features/landing/components/hero-product-demo.tsx
```

Komponen ini menggantikan dashboard preview card statis.

Demo harus menyerupai mini StudyFlow dashboard:

```txt
Sidebar mini
Dashboard header
Statistics cards
Study plan progress
Weekly study bars
Recent task
AI suggestion badge
```

Interactivity:

```txt
Hover card memberikan slight lift
Progress bar animate ketika masuk viewport
Chart bars animate dari bawah
Floating activity cards bergerak ringan
Task checkbox dapat berubah secara visual
Active tab dapat berpindah
```

Demo tidak perlu terhubung ke database.

Data demo harus jelas merupakan preview UI, bukan statistik real user.

Recommended container:

```tsx
<div className="relative mx-auto w-full max-w-2xl">
  <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-r from-indigo-200/50 via-violet-200/40 to-cyan-200/50 blur-3xl" />

  <m.div
    initial={{ opacity: 0, y: 32, rotateX: 4 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: 0.8 }}
    className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-3 shadow-2xl shadow-slate-950/10 backdrop-blur"
  >
    {/* product demo */}
  </m.div>
</div>
```

Gunakan perspective ringan, tetapi jangan membuat teks sulit dibaca.

---

### 12. Create Floating Activity Cards

Buat file:

```txt
features/landing/components/floating-activity-card.tsx
```

Contoh floating cards:

```txt
Study session completed · 45 min
Task completed · Authentication setup
AI plan generated · 8 tasks
Weekly goal · 82%
```

Rules:

```txt
Maksimal 2–3 floating cards.
Disembunyikan pada layar sangat kecil.
Tidak menutupi CTA.
Gerakan sangat ringan.
Reduced motion harus menonaktifkan gerakan berulang.
```

Recommended breakpoint:

```txt
hidden sm:flex
```

---

## Trust Strip

### 13. Create Product Trust Strip

Buat file:

```txt
features/landing/components/product-trust-strip.tsx
```

Karena belum ada partner atau company logo, jangan membuat logo palsu.

Gunakan capability strip:

```txt
Plan
Organize
Focus
Track
Improve
```

Atau technology/value strip:

```txt
Study Plans
Task Tracking
Session History
Progress Analytics
AI Assistance
```

Tambahkan icon kecil dan marquee opsional.

Jika menggunakan marquee:

- Harus lambat.
- Harus berhenti saat hover.
- Harus nonaktif saat reduced motion.
- Konten tetap dapat dibaca tanpa animation.

---

## Global Statistics

### 14. Create Animated Counter

Buat file:

```txt
features/landing/components/animated-counter.tsx
```

Requirements:

- Client Component.
- Menerima nilai number.
- Count-up berjalan ketika masuk viewport.
- Hanya berjalan sekali.
- Nilai akhir harus sama dengan data server.
- Jangan mengganti 0 dengan angka palsu.
- Reduced motion langsung menampilkan nilai akhir.

Props:

```ts
type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
};
```

Example:

```tsx
<AnimatedCounter value={stats.totalUsers} suffix="+" />
```

Suffix `+` hanya boleh digunakan jika sesuai dengan makna statistik.

---

### 15. Improve Global Stats Section

Edit:

```txt
features/landing/components/global-stats-section.tsx
```

Requirements:

- Gunakan actual `stats`.
- Tambahkan animated counter.
- Gunakan four-column layout desktop.
- Gunakan two-column layout mobile/tablet.
- Tambahkan icon kecil.
- Tambahkan subtle hover effect.
- Gunakan background berbeda dari Hero.

Jika seluruh statistik bernilai 0:

```txt
Tetap tampilkan angka 0
atau
Sembunyikan section secara terkontrol
```

Jangan mengganti dengan dummy number.

---

## Feature Bento Grid

### 16. Create Feature Bento Section

Ganti:

```txt
features/landing/components/features-section.tsx
```

Dengan:

```txt
features/landing/components/feature-bento-section.tsx
```

Features:

```txt
Smart Study Plans
Task Management
Study Session Tracking
Progress Analytics
Deadline Calendar
AI Study Plan Generator
```

Gunakan bento grid dengan ukuran berbeda.

Recommended desktop layout:

```txt
Smart Study Plans: col-span-2 row-span-2
AI Generator: col-span-1 row-span-2
Task Tracking: col-span-1
Study Sessions: col-span-1
Analytics: col-span-2
Calendar: col-span-1
```

Setiap card memiliki:

```txt
Icon
Eyebrow optional
Title
Short description
Mini visual UI
Hover interaction
Subtle gradient
```

Jangan hanya menampilkan icon dan paragraph.

---

### 17. Create Feature Bento Card

Buat file:

```txt
features/landing/components/feature-bento-card.tsx
```

Props:

```ts
type FeatureBentoCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  visual: ReactNode;
  className?: string;
  accent?: "indigo" | "cyan" | "violet" | "slate";
};
```

Hover behavior:

```txt
Card naik 4px
Border lebih jelas
Shadow bertambah ringan
Mini visual bergerak sedikit
Icon background berubah
```

Jangan gunakan hover animation pada touch-only interaction sebagai satu-satunya cara melihat informasi.

---

### 18. Add Mini UI Visuals

Contoh visual per feature:

```txt
Study Plan:
Progress bar + milestone list

Tasks:
Three task rows dengan status badge

Sessions:
Timer card + duration history

Analytics:
Mini bar chart atau line chart

Calendar:
Mini date grid + deadline indicators

AI:
Prompt card + generated task animation
```

Visual hanya menggunakan HTML, Tailwind, dan icon.

Tidak perlu screenshot eksternal.

---

## Interactive Product Showcase

### 19. Create Product Showcase Section

Buat file:

```txt
features/landing/components/product-showcase-section.tsx
```

Section ID:

```txt
product
```

Purpose:

```txt
Menampilkan lebih jelas bagaimana aplikasi bekerja,
bukan hanya menjelaskan fitur melalui card.
```

Tabs:

```txt
Dashboard
Study Plans
Tasks
Calendar
Analytics
AI Generator
```

Setiap tab memiliki:

```txt
Title
Description
Three benefit points
Interactive UI preview
```

Desktop layout:

```txt
Left: product navigation
Right: preview
```

Mobile layout:

```txt
Horizontal scrollable tabs
Preview di bawah tabs
```

---

### 20. Create Product Showcase Tabs

Buat file:

```txt
features/landing/components/product-showcase-tabs.tsx
```

Requirements:

- Client Component.
- Menggunakan button semantic.
- Active preview berubah menggunakan `AnimatePresence`.
- Active indicator menggunakan layout animation.
- Keyboard accessible.
- Tidak autoplay.
- Default tab `Dashboard`.

Example state:

```ts
const [activeFeature, setActiveFeature] = useState<LandingProductFeature>("dashboard");
```

Animation:

```tsx
<AnimatePresence mode="wait">
  <m.div
    key={activeFeature}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
  >
    {/* active preview */}
  </m.div>
</AnimatePresence>
```

---

## How It Works

### 21. Improve How It Works Section

Edit:

```txt
features/landing/components/how-it-works-section.tsx
```

Section ID:

```txt
how-it-works
```

Core flow:

```txt
1. Create a Subject
2. Build a Study Plan
3. Break It into Tasks
4. Track Study Sessions
5. Review Your Progress
```

Design:

```txt
Vertical timeline mobile
Horizontal connected steps desktop
Active step indicator
Mini UI preview
Scroll reveal per step
```

Interaction:

- Hover atau focus menyorot step.
- Active step mengubah preview.
- Connector line animate ringan.
- Content tetap terbaca tanpa JavaScript.

---

## Analytics Highlight

### 22. Improve Analytics Preview

Edit:

```txt
features/landing/components/analytics-preview-section.tsx
```

Section ID:

```txt
analytics
```

Requirements:

- Gunakan layout tidak simetris agar lebih menarik.
- Chart preview lebih besar.
- Tambahkan progress insight cards.
- Tambahkan weekly activity bar chart.
- Tambahkan subject distribution.
- Tambahkan task completion insight.
- Gunakan reveal animation.
- Chart bars animate ketika masuk viewport.
- Tidak menggunakan Recharts jika visual statis dapat dibuat dengan CSS.

Recommended copy:

```txt
Eyebrow:
See the pattern behind your progress

Title:
Know what is working—and what needs more focus.

Description:
StudyFlow turns sessions, tasks, and completed plans into
clear progress insights.
```

---

## Testimonials

### 23. Improve Testimonials Section

Edit:

```txt
features/landing/components/testimonials-section.tsx
```

Section ID:

```txt
testimonials
```

Gunakan data:

```txt
getPublishedTestimonials()
```

Jangan membuat testimonial fallback palsu.

Jika tidak ada testimonial:

```txt
Sembunyikan section
```

atau tampilkan invitation netral:

```txt
Testimonials will appear here as learners share their experience.
```

Rekomendasi:

```txt
Sembunyikan section jika data kosong.
```

---

### 24. Create Testimonial Carousel

Buat file:

```txt
features/landing/components/testimonial-carousel.tsx
```

Requirements:

- Client Component.
- Manual previous/next controls.
- Indicator dots.
- Swipe gesture optional.
- Keyboard accessible.
- `aria-label` untuk controls.
- Active testimonial menggunakan AnimatePresence.
- Jangan autoplay untuk MVP.

Jika autoplay ditambahkan:

```txt
Pause saat hover
Pause saat focus
Pause saat tab browser tidak aktif
Nonaktif untuk reduced motion
```

Carousel card:

```txt
Quote
User name
User role
Optional avatar initials
Rating only if rating exists in database
```

Jangan hardcode five-star rating.

---

## Final CTA

### 25. Improve Final CTA Section

Edit:

```txt
features/landing/components/final-cta-section.tsx
```

Gunakan high-impact CTA card:

```txt
Dark slate surface
Indigo/cyan glow
Large heading
Primary button
Secondary login link
Mini trust points
```

Recommended copy:

```txt
Heading:
Make every study session move you forward.

Description:
Turn your goals into structured plans, focused tasks,
and progress you can actually see.

Primary CTA:
Create Your Study Plan

Secondary CTA:
Already have an account? Login
```

Background harus berbeda dari section lain, tetapi tetap konsisten.

---

## Footer

### 26. Improve Site Footer

Edit:

```txt
components/layout/site-footer.tsx
```

Footer saat ini perlu dikembangkan menjadi:

```txt
Brand description
Product navigation
Account navigation
Project/GitHub link
Technology attribution optional
Copyright
```

Recommended columns:

```txt
Brand
Product
Account
Project
```

Product links:

```txt
Features
How It Works
Analytics
Testimonials
```

Account links:

```txt
Login
Register
```

Project links:

```txt
GitHub Repository
```

External link harus memiliki:

```tsx
target = "_blank";
rel = "noreferrer";
```

Tambahkan accessible label jika menggunakan icon-only link.

---

## Landing Data

### 27. Update Landing Content Data

Edit:

```txt
features/landing/data/landing-content.ts
```

Pisahkan data:

```ts
export const landingFeatures = [];
export const landingProductFeatures = [];
export const landingWorkflowSteps = [];
export const landingTrustItems = [];
export const landingFooterGroups = [];
```

Tujuan:

```txt
Menghindari hardcoded array di banyak component.
Mempermudah perubahan copy.
Menjaga component tetap ringkas.
```

---

## Animation Guidelines

### 28. Motion Timing

Gunakan timing konsisten:

```txt
Micro interaction: 150–250ms
Card reveal: 400–600ms
Hero reveal: 600–900ms
Tab transition: 250–400ms
Floating animation: 4–8 seconds
```

Recommended easing:

```ts
[0.22, 1, 0.36, 1];
```

Hindari:

```txt
Animation lebih dari 1 detik untuk interaction
Bounce berlebihan
Semua element bergerak bersamaan
Parallax berat
Continuous animation pada banyak element
```

---

### 29. Hover and Tap Interaction

Gunakan:

```tsx
whileHover={{ y: -4 }}
whileTap={{ scale: 0.98 }}
```

Untuk:

```txt
Feature cards
CTA buttons optional
Product preview cards
Testimonial controls
```

Jangan menggunakan scale terlalu besar.

Recommended maximum:

```txt
1.01–1.03
```

---

### 30. Reduced Motion

Semua animation harus menghormati:

```css
@media (prefers-reduced-motion: reduce);
```

Motion provider menggunakan:

```tsx
<MotionConfig reducedMotion="user">
```

Untuk CSS animation tambahkan:

```css
@media (prefers-reduced-motion: reduce) {
  .landing-marquee,
  .landing-float,
  .landing-pulse {
    animation: none !important;
  }

  html {
    scroll-behavior: auto;
  }
}
```

Landing page harus tetap terlihat lengkap tanpa animation.

---

## Styling

### 31. Add Landing Utility Classes

Edit:

```txt
app/globals.css
```

Tambahkan utility seperlunya:

```css
.landing-grid-background {
  background-image:
    linear-gradient(to right, rgb(148 163 184 / 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(148 163 184 / 0.08) 1px, transparent 1px);
  background-size: 32px 32px;
}

.landing-mask-fade {
  mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
}

.landing-card-glow {
  box-shadow:
    0 24px 80px rgb(15 23 42 / 0.08),
    0 8px 32px rgb(79 70 229 / 0.08);
}
```

Rules:

```txt
Jangan membuat terlalu banyak global utility.
Gunakan Tailwind class terlebih dahulu.
Gunakan global CSS hanya untuk pattern yang sulit dibaca sebagai arbitrary class.
```

---

## Responsive Requirements

### 32. Hero Responsive

Mobile:

```txt
Copy berada di atas product demo
Heading 40–48px
CTA stack
Floating cards disembunyikan atau diperkecil
Product demo tidak memiliki rotation besar
```

Desktop:

```txt
Two-column layout
Heading 64–76px
Product demo memiliki layered depth
Floating activity cards tampil
```

Recommended heading:

```tsx
className = "text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl xl:text-7xl";
```

---

### 33. Feature Bento Responsive

Mobile:

```txt
Semua card satu kolom
Tidak ada forced row span
Mini visual tetap terlihat
```

Tablet:

```txt
Dua kolom
Featured card boleh span dua kolom
```

Desktop:

```txt
Complex bento layout
```

---

### 34. Showcase Responsive

Mobile:

```txt
Tabs horizontal scroll
Preview full width
Content di atas preview
Tidak ada overflow
```

Desktop:

```txt
Navigation di kiri
Preview di kanan
```

---

### 35. Test Viewports

Test minimal:

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

Expected:

```txt
Tidak ada horizontal overflow.
CTA selalu terlihat.
Header tidak terpotong.
Product preview tetap terbaca.
Text tidak terlalu kecil.
```

---

## Performance Requirements

### 36. Limit Client Components

Jangan menambahkan `"use client"` pada:

```txt
app/page.tsx
features/landing/components/landing-section.tsx
Static section wrapper
Static content components
```

Client boundaries hanya untuk interaction.

---

### 37. Avoid Layout Shift

Requirements:

```txt
Berikan ukuran tetap untuk product preview.
Berikan minimum height untuk testimonial carousel.
Jangan menunggu JavaScript untuk menentukan layout utama.
Animated counter memiliki width stabil.
```

---

### 38. Avoid Heavy Assets

Jangan menambahkan:

```txt
Large video
Large GIF
Unoptimized PNG screenshot
External animation embed
3D model
```

Jika nanti menambahkan image:

```txt
Gunakan next/image
Gunakan local public asset
Gunakan proper width dan height
Gunakan WebP/AVIF jika memungkinkan
```

Untuk issue ini, prioritaskan HTML/CSS product mockup.

---

### 39. SEO Content Safety

Landing copy harus menjelaskan dengan jelas:

```txt
Apa itu StudyFlow
Siapa target user
Masalah yang diselesaikan
Fitur utama
Bagaimana cara kerja
CTA
```

Jangan menyembunyikan seluruh content di dalam interactive tab.

Konten utama tetap harus tersedia pada HTML awal.

---

## Accessibility Requirements

### 40. Semantic Structure

Gunakan:

```txt
Satu h1
Setiap section memiliki h2
Card title menggunakan h3
Nav menggunakan nav
CTA menggunakan link
Interactive tabs menggunakan button
Carousel controls menggunakan button
```

---

### 41. Keyboard Support

Pastikan:

```txt
Mobile menu bisa dibuka keyboard
Product tabs dapat digunakan keyboard
Testimonial carousel dapat digunakan keyboard
Anchor navigation bekerja
Focus state terlihat
CTA dapat diakses dengan Tab
```

---

### 42. Decorative Elements

Decorative elements harus menggunakan:

```tsx
aria-hidden="true"
```

Floating card yang hanya dekoratif tidak boleh mengganggu screen reader.

Jika floating card menyampaikan informasi penting, informasi tersebut harus tersedia dalam content utama.

---

### 43. Contrast

Pastikan:

```txt
Body text minimal slate-600 di atas white
Jangan menggunakan cyan terang untuk text panjang
Gradient text hanya untuk sebagian heading
CTA text memiliki contrast tinggi
Muted card tetap terbaca
```

---

## Update App Page

### 44. Replace Existing Section Imports

Edit:

```txt
app/page.tsx
```

Replace:

```txt
FeaturesSection
DashboardPreviewCard direct usage
```

With:

```txt
FeatureBentoSection
ProductShowcaseSection
ProductTrustStrip
```

Pastikan:

```txt
getLandingStats tetap dipanggil.
getPublishedTestimonials tetap dipanggil.
Data fetching tetap paralel.
```

---

## Acceptance Criteria

- Landing page `/` tetap tersedia.
- Landing page tetap menggunakan Server Component.
- Motion package terpasang.
- Landing Motion Provider tersedia.
- Reduced motion preference dihormati.
- Hero memiliki visual hierarchy baru.
- Hero memiliki modern gradient background.
- Hero memiliki primary dan secondary CTA.
- Hero product demo lebih hidup.
- Dashboard preview statis diganti interactive product demo.
- Product demo responsive.
- Floating activity cards tersedia.
- Floating cards tidak mengganggu mobile.
- Product trust strip tersedia.
- Statistik tetap menggunakan data real.
- Statistik memiliki count-up animation.
- Statistik 0 tidak diganti dummy data.
- Features menggunakan bento grid.
- Feature cards memiliki mini UI visual.
- Feature cards memiliki hover interaction.
- Product showcase section tersedia.
- Product showcase memiliki beberapa tabs.
- Product tabs keyboard accessible.
- Product preview memiliki transition.
- How It Works memiliki lima langkah.
- How It Works lebih interaktif.
- Analytics preview diperbaiki.
- Chart preview memiliki reveal animation.
- Testimonials menggunakan data database.
- Testimonial kosong tidak diganti data palsu.
- Testimonial carousel tersedia jika data lebih dari satu.
- Carousel memiliki previous/next controls.
- Final CTA memiliki visual yang lebih kuat.
- Footer memiliki navigation groups.
- Header memiliki mobile menu.
- Header tidak overflow di mobile.
- Desktop header tetap sticky.
- Active section navigation tersedia.
- Anchor link memiliki scroll offset.
- Landing page responsive mulai 320px.
- Tidak ada horizontal overflow.
- Animation tidak berlebihan.
- Tidak ada video atau 3D asset berat.
- Tidak ada schema database yang diubah.
- Tidak ada API route baru.
- Tidak ada shadcn/ui yang ditambahkan.
- Tidak ada fake statistic.
- Tidak ada fake testimonial.
- Tidak ada folder di dalam `src/`.
- Tidak ada error TypeScript.
- Tidak ada error lint.
- `pnpm format:check` berhasil.
- `pnpm build` berhasil.

## Testing Checklist

### 1. Test Landing Page

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
Landing page tampil lengkap.
Tidak ada runtime error.
Server statistics dan testimonials tetap dimuat.
```

---

### 2. Test Hero Animation

Refresh page.

Expected:

```txt
Hero copy muncul dengan smooth reveal.
Product demo muncul setelah copy.
Chart bars dan progress animate.
Tidak ada animation yang terasa lambat.
```

---

### 3. Test Hero CTA

Klik:

```txt
Start Planning Free
```

Expected:

```txt
User diarahkan ke /register.
```

Klik:

```txt
See How It Works
```

Expected:

```txt
Page scroll ke #how-it-works.
Heading tidak tertutup sticky header.
```

---

### 4. Test Mobile Header

Viewport:

```txt
320 × 568
375 × 667
```

Expected:

```txt
Desktop navigation tersembunyi.
Menu button tampil.
Drawer dapat dibuka.
Drawer dapat ditutup.
Klik link menutup drawer.
Tidak ada horizontal overflow.
```

---

### 5. Test Active Navigation

Scroll melalui landing page.

Expected:

```txt
Navigation aktif mengikuti section yang terlihat.
Indicator berpindah dengan smooth.
Anchor link tetap bekerja.
```

---

### 6. Test Feature Bento

Expected:

```txt
Desktop memiliki bento layout.
Tablet memiliki dua kolom.
Mobile memiliki satu kolom.
Mini UI visual terlihat.
Hover tidak menggeser layout.
```

---

### 7. Test Product Showcase

Klik setiap tab:

```txt
Dashboard
Study Plans
Tasks
Calendar
Analytics
AI Generator
```

Expected:

```txt
Active preview berubah.
Transition berjalan.
Tidak ada blank state saat transition.
Keyboard dapat mengganti tab.
```

---

### 8. Test Animated Statistics

Scroll ke statistics section.

Expected:

```txt
Counter berjalan menuju nilai server.
Counter hanya berjalan sekali.
Nilai akhir akurat.
Tidak ada angka dummy.
```

---

### 9. Test Testimonial Data

Dengan testimonial tersedia:

```txt
Carousel tampil.
Nama dan content sesuai database.
Navigation controls bekerja.
```

Tanpa testimonial:

```txt
Section disembunyikan atau menggunakan empty behavior yang netral.
Tidak ada testimonial palsu.
```

---

### 10. Test Reduced Motion

Aktifkan:

```txt
Operating System → Reduce Motion
```

Expected:

```txt
Continuous floating animation berhenti.
Reveal animation disederhanakan.
Content tetap tampil.
Tidak ada informasi yang hilang.
```

---

### 11. Test Mobile Product Preview

Viewport:

```txt
320 × 568
390 × 844
```

Expected:

```txt
Product demo tidak terpotong.
Tabs dapat di-scroll horizontal.
Text tetap terbaca.
Floating card tidak menutupi CTA.
```

---

### 12. Test Desktop Landing Page

Viewport:

```txt
1440 × 900
1920 × 1080
```

Expected:

```txt
Content tidak terlalu melebar.
Section memiliki visual rhythm.
Hero product demo memiliki depth.
Bento grid menggunakan ruang dengan baik.
```

---

### 13. Test Horizontal Overflow

Jalankan:

```js
document.documentElement.scrollWidth > document.documentElement.clientWidth;
```

Expected:

```txt
false
```

---

### 14. Test Keyboard Navigation

Gunakan keyboard.

Expected:

```txt
Header navigation dapat diakses.
Mobile menu dapat digunakan.
Product showcase tabs dapat digunakan.
Carousel controls dapat digunakan.
Focus indicator terlihat.
```

---

### 15. Test Statistics Failure

Simulasikan query statistics gagal.

Expected:

```txt
Landing page tetap tampil.
Section statistik menggunakan fallback aman.
Halaman tidak crash.
```

---

### 16. Test Performance

Periksa browser performance.

Expected:

```txt
Tidak ada continuous animation yang memakai CPU berlebihan.
Scroll tetap smooth.
Tidak ada image besar.
Tidak ada layout shift besar.
```

---

### 17. Run Checks

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

- Landing page sudah memiliki struktur yang baik, sehingga lakukan refactor bertahap.
- Jangan mengubah seluruh landing menjadi Client Component.
- Utamakan product UI preview dibanding decorative illustration umum.
- Landing harus memperlihatkan aplikasi yang sebenarnya.
- Animation harus mendukung visual hierarchy, bukan sekadar dekorasi.
- Gunakan Motion untuk scroll reveal dan interaction kompleks.
- Gunakan CSS transition untuk hover sederhana.
- Jangan membuat klaim yang belum didukung data.
- Jangan membuat fake logo, fake user, atau fake testimonial.
- Pertahankan `getLandingStats()` dan `getPublishedTestimonials()`.
- Gunakan data demo hanya untuk preview interface, bukan sebagai klaim statistik.
- Landing page harus tetap terlihat bagus ketika JavaScript atau animation tidak berjalan.
- Product showcase merupakan bagian utama untuk menunjukkan kualitas portfolio fullstack.

## Suggested Commit Message

```bash
feat: improve modern interactive landing page
```
