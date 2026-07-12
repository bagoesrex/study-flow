import { getDashboardDataAction } from "@/actions/dashboard";
import { ActivePlanProgressCard } from "@/features/dashboard/components/active-plan-progress-card";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardOverviewCards } from "@/features/dashboard/components/dashboard-overview-cards";
import { RecentSessionsCard } from "@/features/dashboard/components/recent-sessions-card";
import { RecentTasksCard } from "@/features/dashboard/components/recent-tasks-card";
import { PageHeader } from "@/components/common/page-header";

export default async function DashboardPage() {
  const result = await getDashboardDataAction();

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Overview of your study progress, tasks, and recent learning activity."
        />
        <div className="rounded-2xl border border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-500">
            Gagal memuat dashboard. Silakan refresh halaman atau coba lagi nanti.
          </p>
        </div>
      </div>
    );
  }

  const data = result.data;

  const hasNoData =
    data.overview.totalSubjects === 0 &&
    data.overview.totalTasks === 0 &&
    data.overview.totalStudySessions === 0;

  if (hasNoData) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <PageHeader
          title="Dashboard"
          description="Welcome to StudyFlow. Start organizing your learning progress."
        />
        <DashboardEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your study progress, tasks, and recent learning activity."
      />

      <DashboardOverviewCards overview={data.overview} />

      <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <ActivePlanProgressCard plans={data.activePlanProgress} />
        <RecentSessionsCard sessions={data.recentSessions} />
      </div>

      <RecentTasksCard tasks={data.recentTasks} />
    </div>
  );
}
