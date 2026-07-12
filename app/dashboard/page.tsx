import { getDashboardDataAction } from "@/actions/dashboard";
import { getTodayFocusAction, getUpcomingDeadlinesAction } from "@/actions/dashboard-today-focus";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardOverviewCards } from "@/features/dashboard/components/dashboard-overview-cards";
import { DashboardGreeting } from "@/features/dashboard/components/dashboard-greeting";
import { DashboardTodayFocus } from "@/features/dashboard/components/dashboard-today-focus";
import { DashboardQuickActions } from "@/features/dashboard/components/dashboard-quick-actions";
import { ActiveStudyPlansCard } from "@/features/dashboard/components/active-study-plans-card";
import { UpcomingDeadlinesCard } from "@/features/dashboard/components/upcoming-deadlines-card";
import { RecentActivityCard } from "@/features/dashboard/components/recent-activity-card";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const result = await getDashboardDataAction();

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6">
        <DashboardGreeting name={session?.user?.name} />
        <div className="rounded-2xl border border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-500">
            Failed to load dashboard. Please refresh or try again later.
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
        <DashboardGreeting name={session?.user?.name} />
        <DashboardEmptyState />
      </div>
    );
  }

  const [focusResult, deadlinesResult] = await Promise.all([
    getTodayFocusAction(),
    getUpcomingDeadlinesAction(),
  ]);

  const focusTasks = focusResult.success && focusResult.data ? focusResult.data : [];
  const deadlineTasks = deadlinesResult.success && deadlinesResult.data ? deadlinesResult.data : [];

  return (
    <div className="space-y-6 lg:space-y-8">
      <DashboardGreeting name={session?.user?.name} />

      <DashboardOverviewCards overview={data.overview} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardTodayFocus tasks={focusTasks} />
        <DashboardQuickActions />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ActiveStudyPlansCard plans={data.activePlanProgress} />
        <UpcomingDeadlinesCard tasks={deadlineTasks} />
      </div>

      <RecentActivityCard tasks={data.recentTasks} sessions={data.recentSessions} />
    </div>
  );
}
