import { BookOpen, CalendarDays, CheckSquare, Timer } from "lucide-react";

import type { DashboardOverview } from "@/types/dashboard";
import { formatHours, formatPercentage } from "@/features/dashboard/utils/dashboard-format";

type DashboardOverviewCardsProps = {
  overview: DashboardOverview;
};

export function DashboardOverviewCards({ overview }: DashboardOverviewCardsProps) {
  const stats = [
    {
      label: "Subjects",
      value: overview.totalSubjects.toString(),
      description: "Active subjects",
      icon: BookOpen,
    },
    {
      label: "Active Plans",
      value: overview.activeStudyPlans.toString(),
      description: "Currently tracked",
      icon: CalendarDays,
    },
    {
      label: "Task Completion",
      value: `${formatPercentage(overview.taskCompletionRate)}`,
      description: `${overview.completedTasks} of ${overview.totalTasks} tasks done`,
      icon: CheckSquare,
    },
    {
      label: "Study Time",
      value: formatHours(overview.totalStudyHours),
      description: `${overview.totalStudySessions} sessions tracked`,
      icon: Timer,
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>

            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
}
