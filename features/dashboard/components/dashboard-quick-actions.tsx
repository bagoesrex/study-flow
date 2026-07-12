import { BookOpen, CalendarDays, CheckSquare, Sparkles, Timer } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    label: "New Subject",
    description: "Add a learning category",
    href: "/dashboard/subjects",
    icon: BookOpen,
  },
  {
    label: "New Study Plan",
    description: "Create a structured plan",
    href: "/dashboard/plans",
    icon: CalendarDays,
  },
  {
    label: "Add Task",
    description: "Break down your plan",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    label: "Log Session",
    description: "Track study time",
    href: "/dashboard/sessions",
    icon: Timer,
  },
  {
    label: "Generate with AI",
    description: "Let AI draft your plan",
    href: "/dashboard/ai",
    icon: Sparkles,
  },
];

export function DashboardQuickActions() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-950">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-slate-950 group-hover:text-white">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>

              <p className="text-sm font-semibold text-slate-950">{action.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{action.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
