import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Sparkles,
  Timer,
} from "lucide-react";

import { SurfaceCard } from "@/components/common/surface-card";

const quickLinks = [
  {
    label: "Create Subject",
    href: "/dashboard/subjects",
    icon: BookOpen,
    desc: "Set up a learning category",
  },
  {
    label: "Create Study Plan",
    href: "/dashboard/plans",
    icon: CalendarDays,
    desc: "Structure your goals",
  },
  { label: "Add Task", href: "/dashboard/tasks", icon: CheckSquare, desc: "Break down your plan" },
  { label: "Log Session", href: "/dashboard/sessions", icon: Timer, desc: "Track your study time" },
  {
    label: "Generate with AI",
    href: "/dashboard/ai",
    icon: Sparkles,
    desc: "Let AI draft your plan",
  },
];

export function DashboardEmptyState() {
  return (
    <SurfaceCard className="p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <LayoutDashboard className="h-6 w-6" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950">Welcome to StudyFlow</h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Start by creating your first subject, then build study plans, add tasks, and track your
        learning sessions.
      </p>

      <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">{link.label}</p>
                <p className="text-xs text-slate-500">{link.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
