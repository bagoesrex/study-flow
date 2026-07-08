import { BookOpen, CalendarDays, CheckSquare, Timer } from "lucide-react";

import { StatCard } from "@/components/common/stat-card";
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
      description: "Learning categories",
      icon: BookOpen,
    },
    {
      label: "Active Plans",
      value: overview.activeStudyPlans.toString(),
      description: "Currently tracked",
      icon: CalendarDays,
    },
    {
      label: "Completed Tasks",
      value: `${overview.completedTasks}/${overview.totalTasks}`,
      description: `${formatPercentage(overview.taskCompletionRate)} completion rate`,
      icon: CheckSquare,
    },
    {
      label: "Study Hours",
      value: formatHours(overview.totalStudyHours),
      description: `${overview.totalStudySessions} sessions tracked`,
      icon: Timer,
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          description={stat.description}
        />
      ))}
    </div>
  );
}
