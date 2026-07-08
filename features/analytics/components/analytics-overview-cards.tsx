import { BookOpen, CheckCircle2, Clock, ListTodo, Target, TrendingUp } from "lucide-react";

import type { AnalyticsOverview } from "@/types/analytics";
import { formatHours, formatPercentage } from "@/features/analytics/utils/analytics-format";
import { Card } from "@/components/ui/card";

type AnalyticsOverviewCardsProps = {
  overview: AnalyticsOverview;
};

export function AnalyticsOverviewCards({ overview }: AnalyticsOverviewCardsProps) {
  const items = [
    {
      label: "Total Study Hours",
      value: formatHours(overview.totalStudyHours),
      icon: Clock,
    },
    {
      label: "Study Sessions",
      value: `${overview.totalStudySessions} sessions`,
      icon: TrendingUp,
    },
    {
      label: "Completed Tasks",
      value: `${overview.totalCompletedTasks}/${overview.totalTasks} tasks`,
      icon: CheckCircle2,
    },
    {
      label: "Task Completion Rate",
      value: formatPercentage(overview.taskCompletionRate),
      icon: Target,
    },
    {
      label: "Active Study Plans",
      value: `${overview.activeStudyPlans} plans`,
      icon: BookOpen,
    },
    {
      label: "Most Studied Subject",
      value: overview.mostStudiedSubject ?? "—",
      icon: ListTodo,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <item.icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-slate-500">{item.label}</span>
          </div>

          <p className="text-2xl font-bold tracking-tight text-slate-950">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
