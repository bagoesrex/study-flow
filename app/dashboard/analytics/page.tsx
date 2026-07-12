"use client";

import { AnalyticsEmptyState } from "@/features/analytics/components/analytics-empty-state";
import { AnalyticsOverviewCards } from "@/features/analytics/components/analytics-overview-cards";
import { RecentStudySessionsCard } from "@/features/analytics/components/recent-study-sessions-card";
import { StudyHoursBySubjectChart } from "@/features/analytics/components/study-hours-by-subject-chart";
import { TaskStatusChart } from "@/features/analytics/components/task-status-chart";
import { WeeklyStudyHoursChart } from "@/features/analytics/components/weekly-study-hours-chart";
import { useAnalyticsQuery } from "@/features/analytics/hooks/use-analytics-query";
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";

export default function AnalyticsPage() {
  const query = useAnalyticsQuery();

  if (query.isLoading) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <PageHeader title="Analytics" description="Review your study progress and productivity." />

        <CardGridSkeleton count={6} className="md:grid-cols-2 xl:grid-cols-3" />

        <CardGridSkeleton count={2} />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <PageHeader title="Analytics" description="Review your study progress and productivity." />
        <ErrorState onRetry={() => query.refetch()} />
      </div>
    );
  }

  const data = query.data!;

  const hasNoData =
    data.overview.totalStudyHours === 0 &&
    data.overview.totalTasks === 0 &&
    data.overview.totalStudySessions === 0;

  if (hasNoData) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <PageHeader title="Analytics" description="Review your study progress and productivity." />

        <AnalyticsEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Analytics"
        description="Review your study progress, task completion, and learning activity."
      />

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
