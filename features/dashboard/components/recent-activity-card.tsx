import { CheckSquare, Timer } from "lucide-react";

import { SurfaceCard } from "@/components/common/surface-card";
import { SectionHeader } from "@/components/common/section-header";
import type { DashboardRecentTask, DashboardRecentSession } from "@/types/dashboard";
import { formatMinutes } from "@/features/dashboard/utils/dashboard-format";

type RecentActivityCardProps = {
  tasks: DashboardRecentTask[];
  sessions: DashboardRecentSession[];
};

function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

type Activity = {
  id: string;
  type: "task_done" | "session_logged";
  primary: string;
  secondary: string;
  time: string;
  subjectColor: string;
};

export function RecentActivityCard({ tasks, sessions }: RecentActivityCardProps) {
  const activities: Activity[] = [
    ...tasks
      .filter((t) => t.status === "DONE")
      .map((t) => ({
        id: `task-${t.id}`,
        type: "task_done" as const,
        primary: t.title,
        secondary: t.studyPlanTitle,
        time: getRelativeTime(new Date()),
        subjectColor: t.subjectColor,
      })),
    ...sessions.map((s) => ({
      id: `session-${s.id}`,
      type: "session_logged" as const,
      primary: `Logged a ${formatMinutes(s.durationMinutes)} session`,
      secondary: s.studyPlanTitle ?? "General Study",
      time: getRelativeTime(s.startedAt),
      subjectColor: s.subjectColor,
    })),
  ].sort((a, b) => {
    const aMinutes = parseInt(a.time);
    const bMinutes = parseInt(b.time);
    return aMinutes - bMinutes;
  });

  return (
    <section>
      <SectionHeader title="Recent Activity" description="Your latest learning activity." />

      <div className="mt-4">
        <SurfaceCard className="p-5 sm:p-6">
          {activities.length === 0 ? (
            <p className="text-sm text-slate-500">
              No recent activity. Start learning to see your progress here.
            </p>
          ) : (
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${activity.subjectColor}1A` }}
                  >
                    {activity.type === "task_done" ? (
                      <CheckSquare
                        className="h-3.5 w-3.5"
                        style={{ color: activity.subjectColor }}
                      />
                    ) : (
                      <Timer className="h-3.5 w-3.5" style={{ color: activity.subjectColor }} />
                    )}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-950">
                      {activity.primary}
                    </p>
                    <p className="truncate text-xs text-slate-500">{activity.secondary}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SurfaceCard>
      </div>
    </section>
  );
}
