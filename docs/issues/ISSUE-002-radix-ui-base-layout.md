# ISSUE-002 — Setup Radix UI and Base Layout

## Status

Planned

## Priority

High

## Type

Setup / UI Foundation

## Summary

Setup Radix UI primitives dan base layout untuk project StudyFlow tanpa menggunakan shadcn/ui. Fokus issue ini adalah membuat fondasi UI custom berbasis Tailwind CSS, reusable component dasar, layout marketing page, dan layout dashboard awal.

Project tidak akan menggunakan dashboard template bawaan shadcn. Komponen visual seperti button, card, badge, input, dan layout akan dibuat custom agar tampilan StudyFlow lebih unik, modern, putih, clean, dan portfolio-ready.

## Background

Pada issue sebelumnya, project sudah disiapkan menggunakan Next.js, TypeScript, Tailwind CSS, Prettier, dan Husky.

Pada issue ini, kita mulai membuat fondasi tampilan aplikasi. Karena desain StudyFlow diarahkan ke clean white SaaS dengan typography modern dan gradient text, maka pendekatan yang digunakan adalah:

```txt
Custom Tailwind Components + Radix UI Primitives
```

Radix UI hanya digunakan untuk komponen yang membutuhkan behavior kompleks seperti dialog, dropdown, select, tabs, tooltip, popover, dan progress.

## Goals

- Menginstall Radix UI primitives yang dibutuhkan.
- Menginstall utility pendukung untuk className.
- Menginstall icon library.
- Membuat helper `cn`.
- Membuat komponen UI dasar custom.
- Membuat base layout untuk landing page.
- Membuat base layout untuk dashboard.
- Membuat navigation data di file constants.
- Membuat tampilan awal landing page sederhana.
- Membuat tampilan awal dashboard placeholder.
- Menjaga desain tetap custom, tidak terlihat seperti shadcn template.

## Non-Goals

- Tidak menggunakan shadcn/ui.
- Tidak membuat authentication.
- Tidak setup Prisma.
- Tidak membuat database.
- Tidak membuat CRUD.
- Tidak membuat chart analytics.
- Tidak membuat landing page final.
- Tidak membuat dashboard final.
- Tidak membuat fitur study plan.
- Tidak membuat fitur task.
- Tidak membuat fitur study session.

## Design Direction

Gunakan arah desain berikut:

```txt
Theme: Clean white SaaS
Background: White / off-white
Primary: Indigo / blue
Accent: Cyan / violet
Text: Slate / navy
Card: White with soft border and subtle shadow
Corner: Rounded-2xl / rounded-3xl
Typography: Large, clean, modern, premium
```

Warna awal yang disarankan:

```txt
Background: #FFFFFF
Soft Background: #F8FAFC
Primary Text: #0F172A
Muted Text: #64748B
Border: #E2E8F0
Primary Accent: #4F46E5
Secondary Accent: #06B6D4
Violet Accent: #8B5CF6
```

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Radix UI Primitives
- Lucide React
- clsx
- tailwind-merge

## Required Packages

Install package berikut:

```bash
pnpm add @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tooltip @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-popover @radix-ui/react-progress lucide-react clsx tailwind-merge
```

Penjelasan package:

```txt
@radix-ui/react-slot          = untuk komponen polymorphic seperti Button asChild
@radix-ui/react-dialog        = modal/dialog
@radix-ui/react-dropdown-menu = dropdown menu
@radix-ui/react-tooltip       = tooltip
@radix-ui/react-tabs          = tab navigation
@radix-ui/react-select        = custom select
@radix-ui/react-popover       = popover
@radix-ui/react-progress      = progress indicator
lucide-react                  = icon
clsx                          = conditional className
tailwind-merge                = merge class Tailwind agar tidak konflik
```

## Implementation Steps

### 1. Install Dependencies

Jalankan:

```bash
pnpm add @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tooltip @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-popover @radix-ui/react-progress lucide-react clsx tailwind-merge
```

Setelah install, jalankan:

```bash
pnpm lint
pnpm format
```

Expected:

```txt
Tidak ada error lint dan format.
```

---

### 2. Create Classname Utility

Buat file:

```txt
lib/cn.ts
```

Isi:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Utility ini dipakai untuk menggabungkan class Tailwind dengan aman.

---

### 3. Create UI Component Folder

Pastikan struktur folder berikut tersedia:

```txt
components/
├── common/
├── layout/
└── ui/
```

Folder `ui` digunakan untuk komponen dasar custom.

```txt
components/ui       = Button, Card, Badge, Input, Progress
components/layout   = SiteHeader, SiteFooter, MarketingShell, DashboardShell
components/common   = StatCard, SectionHeader, EmptyState
```

---

### 4. Create Button Component

Buat file:

```txt
components/ui/button.tsx
```

Isi:

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-slate-950 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-950",
  secondary:
    "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:ring-slate-300",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-slate-300",
  outline:
    "border border-slate-200 bg-white text-slate-950 hover:bg-slate-50 focus-visible:ring-slate-300",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 rounded-xl px-3 text-sm",
  md: "h-10 rounded-2xl px-4 text-sm",
  lg: "h-12 rounded-2xl px-6 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    />
  );
}
```

---

### 5. Create Card Component

Buat file:

```txt
components/ui/card.tsx
```

Isi:

```tsx
import * as React from "react";

import { cn } from "@/lib/cn";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("rounded-3xl border border-slate-200 bg-white shadow-sm", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn("space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight text-slate-950", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-6 text-slate-500", className)} {...props} />;
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: DivProps) {
  return <div className={cn("flex items-center gap-3 p-6 pt-0", className)} {...props} />;
}
```

---

### 6. Create Badge Component

Buat file:

```txt
components/ui/badge.tsx
```

Isi:

```tsx
import * as React from "react";

import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 ring-slate-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-rose-50 text-rose-700 ring-rose-200",
  info: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
```

---

### 7. Create Input Component

Buat file:

```txt
components/ui/input.tsx
```

Isi:

```tsx
import * as React from "react";

import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm transition outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
```

---

### 8. Create Progress Component Using Radix

Buat file:

```txt
components/ui/progress.tsx
```

Isi:

```tsx
"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/cn";

type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  value?: number;
};

export function Progress({ className, value = 0, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn("relative h-3 w-full overflow-hidden rounded-full bg-slate-100", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full rounded-full bg-slate-950 transition-transform"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
```

---

### 9. Create Navigation Constants

Buat file:

```txt
constants/navigation.ts
```

Isi:

```ts
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Home,
  LayoutDashboard,
  Settings,
  Timer,
} from "lucide-react";

export const marketingNavItems = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "Dashboard",
    href: "#dashboard",
  },
  {
    label: "Analytics",
    href: "#analytics",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
];

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

export const mobileDashboardNavItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Plans",
    href: "/dashboard/plans",
    icon: CalendarDays,
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    label: "Stats",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
];
```

---

### 10. Create Site Header

Buat file:

```txt
components/layout/site-header.tsx
```

Isi:

```tsx
import Link from "next/link";

import { marketingNavItems } from "@/constants/navigation";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-950">
          StudyFlow
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {marketingNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
```

---

### 11. Create Site Footer

Buat file:

```txt
components/layout/site-footer.tsx
```

Isi:

```tsx
export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© 2026 StudyFlow. Built for focused learners.</p>
        <p>Plan smarter. Study better. Track your progress.</p>
      </div>
    </footer>
  );
}
```

---

### 12. Create Marketing Shell

Buat file:

```txt
components/layout/marketing-shell.tsx
```

Isi:

```tsx
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type MarketingShellProps = {
  children: React.ReactNode;
};

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
```

---

### 13. Create Dashboard Sidebar

Buat file:

```txt
components/layout/dashboard-sidebar.tsx
```

Isi:

```tsx
import Link from "next/link";

import { dashboardNavItems } from "@/constants/navigation";

export function DashboardSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white px-4 py-6 lg:block">
      <div className="mb-8 px-3">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight text-slate-950">
          StudyFlow
        </Link>
        <p className="mt-1 text-sm text-slate-500">Learning dashboard</p>
      </div>

      <nav className="space-y-1">
        {dashboardNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

Catatan:

Active state belum wajib di issue ini. Nanti bisa dibuat di issue terpisah menggunakan `usePathname`.

---

### 14. Create Dashboard Shell

Buat file:

```txt
components/layout/dashboard-shell.tsx
```

Isi:

```tsx
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <main className="min-w-0 flex-1">
          <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Dashboard</p>
                <h1 className="text-xl font-semibold tracking-tight text-slate-950">
                  Your learning overview
                </h1>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
```

---

### 15. Create Common Section Header

Buat file:

```txt
components/common/section-header.tsx
```

Isi:

```tsx
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({ eyebrow, title, description, align = "left" }: SectionHeaderProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-indigo-600 uppercase">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>

      {description ? (
        <p className="mt-4 text-base leading-8 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
```

---

### 16. Create Common Stat Card

Buat file:

```txt
components/common/stat-card.tsx
```

Isi:

```tsx
import { Card } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  description?: string;
};

export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <Card className="p-6">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
    </Card>
  );
}
```

---

### 17. Update Home Page with Marketing Shell

Edit file:

```txt
app/page.tsx
```

Isi:

```tsx
import Link from "next/link";
import { ArrowRight, BarChart3, CalendarDays, CheckSquare, Timer } from "lucide-react";

import { SectionHeader } from "@/components/common/section-header";
import { StatCard } from "@/components/common/stat-card";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    label: "Study Plans Created",
    value: "1,240+",
    description: "Plans organized by focused learners.",
  },
  {
    label: "Sessions Completed",
    value: "8,900+",
    description: "Study sessions tracked over time.",
  },
  {
    label: "Hours Tracked",
    value: "3,500+",
    description: "Learning hours recorded in dashboards.",
  },
  {
    label: "Completion Rate",
    value: "92%",
    description: "Average task completion across plans.",
  },
];

const features = [
  {
    title: "Study Plan Management",
    description: "Create structured learning plans with goals, deadlines, and progress.",
    icon: CalendarDays,
  },
  {
    title: "Task Tracking",
    description: "Break big goals into small tasks and track every step clearly.",
    icon: CheckSquare,
  },
  {
    title: "Session Tracker",
    description: "Record study duration, mood, notes, and daily learning activity.",
    icon: Timer,
  },
  {
    title: "Analytics Dashboard",
    description: "Understand your learning habits with charts and useful insights.",
    icon: BarChart3,
  },
];

export default function HomePage() {
  return (
    <MarketingShell>
      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-indigo-50 via-cyan-50/60 to-white" />

          <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
            <div>
              <Badge variant="info">Fullstack Study Planner</Badge>

              <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Plan smarter.{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  Study better.
                </span>{" "}
                Track your progress.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                StudyFlow helps students and developers organize study goals, manage tasks, track
                learning sessions, and review progress in one clean dashboard.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Start Planning
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button variant="secondary" size="lg" asChild>
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>

            <Card className="relative overflow-hidden p-5">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">This Week</p>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                    Learning Overview
                  </h2>
                </div>
                <Badge variant="success">On Track</Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <StatCard label="Study Hours" value="8.5h" description="+2.1h from last week" />
                <StatCard label="Tasks Done" value="12/18" description="66% completion rate" />
              </div>

              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">Next.js Fullstack</p>
                  <p className="text-sm font-semibold text-slate-950">72%</p>
                </div>
                <Progress value={72} />
              </div>

              <div className="mt-5 grid grid-cols-5 items-end gap-2 rounded-3xl border border-slate-200 bg-white p-5">
                {[35, 70, 45, 90, 60].map((height, index) => (
                  <div
                    key={index}
                    className="rounded-full bg-gradient-to-t from-indigo-600 to-cyan-400"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="bg-white py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Features"
              title="Everything you need to stay consistent"
              description="Manage your learning plan, task, deadline, and session history from one focused workspace."
              align="center"
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card key={feature.title} className="p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
```

---

### 18. Create Dashboard Route Group

Buat struktur folder:

```txt
app/dashboard/
└── page.tsx
```

Buat file:

```txt
app/dashboard/page.tsx
```

Isi:

```tsx
import { BookOpen, CalendarDays, CheckSquare, Timer } from "lucide-react";

import { StatCard } from "@/components/common/stat-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
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
    <DashboardShell>
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
    </DashboardShell>
  );
}
```

---

### 19. Update Global CSS

Cek file:

```txt
app/globals.css
```

Pastikan minimal memiliki base Tailwind dan style dasar yang clean.

Contoh:

```css
@import "tailwindcss";

:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  background: #ffffff;
  color: #0f172a;
}
```

Catatan:

Jika struktur Tailwind dari project kamu berbeda, sesuaikan dengan setup Tailwind yang dibuat oleh `create-next-app`.

---

### 20. Run Checks

Jalankan:

```bash
pnpm format
pnpm lint
pnpm dev
```

Buka:

```txt
http://localhost:3000
http://localhost:3000/dashboard
```

Expected:

```txt
Landing page awal tampil.
Dashboard placeholder tampil.
Tidak ada error TypeScript.
Tidak ada error lint.
Tidak ada error hydration.
```

## Expected Folder Structure

Setelah issue selesai:

```txt
app/
├── dashboard/
│   └── page.tsx
├── globals.css
├── layout.tsx
└── page.tsx
components/
├── common/
│   ├── section-header.tsx
│   └── stat-card.tsx
├── layout/
│   ├── dashboard-shell.tsx
│   ├── dashboard-sidebar.tsx
│   ├── marketing-shell.tsx
│   ├── site-footer.tsx
│   └── site-header.tsx
└── ui/
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── progress.tsx
constants/
└── navigation.ts
lib/
└── cn.ts
```

## Acceptance Criteria

- Radix UI primitives berhasil diinstall.
- Lucide React berhasil diinstall.
- `clsx` dan `tailwind-merge` berhasil diinstall.
- File `lib/cn.ts` tersedia.
- Komponen `Button` custom tersedia.
- Komponen `Card` custom tersedia.
- Komponen `Badge` custom tersedia.
- Komponen `Input` custom tersedia.
- Komponen `Progress` berbasis Radix tersedia.
- File navigation constants tersedia.
- Marketing layout tersedia.
- Dashboard layout tersedia.
- Site header tersedia.
- Site footer tersedia.
- Dashboard sidebar tersedia.
- Landing page awal sudah menggunakan base components.
- Dashboard placeholder tersedia di `/dashboard`.
- Desain menggunakan white theme.
- Tidak menggunakan shadcn/ui.
- Tidak ada import dari `@/components/ui` hasil generate shadcn.
- Tidak ada fitur database/auth yang dibuat di issue ini.
- `pnpm lint` berhasil.
- `pnpm format` berhasil.
- `pnpm dev` berhasil.

## Testing Checklist

Jalankan:

```bash
pnpm dev
```

Cek halaman:

```txt
/
```

Expected:

```txt
Landing page StudyFlow tampil dengan hero, dashboard preview, stats, dan features.
```

Cek halaman:

```txt
/dashboard
```

Expected:

```txt
Dashboard placeholder tampil dengan sidebar, stat cards, progress card, dan chart dummy.
```

Jalankan:

```bash
pnpm lint
```

Expected:

```txt
Tidak ada lint error.
```

Jalankan:

```bash
pnpm format:check
```

Expected:

```txt
Semua file sudah sesuai format Prettier.
```

## Notes

- Jangan install shadcn/ui.
- Jangan generate component dari shadcn.
- Jangan membuat auth di issue ini.
- Jangan membuat database di issue ini.
- Jangan membuat Prisma schema di issue ini.
- Gunakan Radix hanya untuk behavior kompleks.
- Komponen visual sederhana tetap dibuat manual dengan Tailwind.
- Fokus issue ini adalah fondasi UI dan layout.
- Active sidebar state bisa dibuat di issue berikutnya.
- Mobile sidebar bisa dibuat di issue berikutnya.

## Suggested Commit Message

```bash
feat: setup radix ui and base layout
```
