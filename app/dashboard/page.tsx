import { getDashboardDataAction } from "@/actions/dashboard";
import { ActivePlanProgressCard } from "@/features/dashboard/components/active-plan-progress-card";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardOverviewCards } from "@/features/dashboard/components/dashboard-overview-cards";
import { RecentSessionsCard } from "@/features/dashboard/components/recent-sessions-card";
import { RecentTasksCard } from "@/features/dashboard/components/recent-tasks-card";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const result = await getDashboardDataAction();

  if (!result.success || !result.data) {
    return (
      <Card className="p-6">
        <h1 className="text-lg font-semibold text-slate-950">Gagal memuat dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
  }

  const data = result.data;

  const hasNoData =
    data.overview.totalSubjects === 0 &&
    data.overview.totalTasks === 0 &&
    data.overview.totalStudySessions === 0;

  if (hasNoData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            Welcome to StudyFlow. Start organizing your learning progress.
          </p>
        </div>

        <DashboardEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Overview of your study progress, tasks, and recent learning activity.
        </p>
      </div>

      <DashboardOverviewCards overview={data.overview} />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <ActivePlanProgressCard plans={data.activePlanProgress} />
        <RecentSessionsCard sessions={data.recentSessions} />
      </div>

      <RecentTasksCard tasks={data.recentTasks} />
    </div>
  );
}
