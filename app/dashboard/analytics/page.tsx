"use client";

import { AnalyticsEmptyState } from "@/features/analytics/components/analytics-empty-state";
import { AnalyticsOverviewCards } from "@/features/analytics/components/analytics-overview-cards";
import { RecentStudySessionsCard } from "@/features/analytics/components/recent-study-sessions-card";
import { StudyHoursBySubjectChart } from "@/features/analytics/components/study-hours-by-subject-chart";
import { TaskStatusChart } from "@/features/analytics/components/task-status-chart";
import { WeeklyStudyHoursChart } from "@/features/analytics/components/weekly-study-hours-chart";
import { useAnalyticsQuery } from "@/features/analytics/hooks/use-analytics-query";
import { Card } from "@/components/ui/card";

export default function AnalyticsPage() {
  const query = useAnalyticsQuery();

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Analytics</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review your study progress and productivity.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-32 animate-pulse bg-slate-100" />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="h-80 animate-pulse bg-slate-100" />
          <Card className="h-80 animate-pulse bg-slate-100" />
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <Card className="p-6">
        <h1 className="text-lg font-semibold text-slate-950">Gagal memuat analytics</h1>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
  }

  const data = query.data!;

  const hasNoData =
    data.overview.totalStudyHours === 0 &&
    data.overview.totalTasks === 0 &&
    data.overview.totalStudySessions === 0;

  if (hasNoData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Analytics</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review your study progress and productivity.
          </p>
        </div>

        <AnalyticsEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Analytics</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review your study progress, task completion, and learning activity.
        </p>
      </div>

      <AnalyticsOverviewCards overview={data.overview} />

      <div className="grid gap-6 xl:grid-cols-2">
        <WeeklyStudyHoursChart data={data.weeklyStudyHours} />
        <StudyHoursBySubjectChart data={data.studyHoursBySubject} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <TaskStatusChart data={data.taskStatusDistribution} />
        <RecentStudySessionsCard sessions={data.recentStudySessions} />
      </div>
    </div>
  );
}
