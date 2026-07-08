import { AlertCircle, CalendarCheck, CalendarDays, CheckCircle2 } from "lucide-react";

import { StatCard } from "@/components/common/stat-card";
import type { CalendarSummary } from "@/types/calendar";

type CalendarSummaryCardsProps = {
  summary: CalendarSummary;
};

export function CalendarSummaryCards({ summary }: CalendarSummaryCardsProps) {
  const stats = [
    {
      label: "Total Events",
      value: summary.totalEvents.toString(),
      description: "Plans and task deadlines",
      icon: CalendarDays,
    },
    {
      label: "Overdue Tasks",
      value: summary.overdueTasks.toString(),
      description: "Need your attention",
      icon: AlertCircle,
    },
    {
      label: "Due Today",
      value: summary.dueTodayTasks.toString(),
      description: "Tasks due today",
      icon: CalendarCheck,
    },
    {
      label: "Completed",
      value: summary.completedTasks.toString(),
      description: "Completed deadlines",
      icon: CheckCircle2,
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
