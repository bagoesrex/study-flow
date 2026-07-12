import { AlertCircle, CalendarDays, type LucideIcon } from "lucide-react";

import type { TodayFocusTask } from "@/actions/dashboard-today-focus";
import { SurfaceCard } from "@/components/common/surface-card";
import {
  StatusIndicator,
  StatusBadge,
  getStatusVariant,
} from "@/components/common/status-indicator";
import { EntityMeta } from "@/components/common/entity-meta";
import { SectionHeader } from "@/components/common/section-header";
import { getRelativeDateLabel, getDeadlineStatus } from "@/utils/date-label";

type DashboardTodayFocusProps = {
  tasks: TodayFocusTask[];
};

function getDeadlineColor(status: "overdue" | "today" | "soon" | "upcoming"): string {
  if (status === "overdue") return "text-rose-600";
  if (status === "today") return "text-amber-600";
  if (status === "soon") return "text-indigo-600";
  return "text-slate-500";
}

export function DashboardTodayFocus({ tasks }: DashboardTodayFocusProps) {
  return (
    <section>
      <SectionHeader title="Today's Focus" description="Priority tasks that need your attention." />

      <div className="mt-4">
        <SurfaceCard className="p-5 sm:p-6">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-slate-950">You&apos;re all caught up.</p>
              <p className="mt-1 text-xs text-slate-500">
                Create a new task or start a study session.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                const deadlineStatus = task.dueDate ? getDeadlineStatus(task.dueDate) : null;
                const deadlineLabel = task.dueDate ? getRelativeDateLabel(task.dueDate) : null;

                return (
                  <div
                    key={task.id}
                    className="rounded-xl border border-slate-100 p-4 transition hover:border-slate-200"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-950">
                          {task.title}
                        </h3>
                      </div>
                      <StatusBadge variant={getStatusVariant(task.priority)}>
                        {task.priority}
                      </StatusBadge>
                    </div>

                    <EntityMeta
                      items={
                        [
                          task.subjectName ? { label: task.subjectName } : null,
                          task.studyPlanTitle ? { label: task.studyPlanTitle } : null,
                          deadlineLabel ? { icon: CalendarDays, label: deadlineLabel } : null,
                        ].filter(Boolean) as { label: string; icon?: LucideIcon }[]
                      }
                      className="mb-3"
                    />

                    <div className="flex items-center gap-3">
                      <StatusIndicator variant={getStatusVariant(task.status)} showDot>
                        {task.status === "TODO"
                          ? "To Do"
                          : task.status === "IN_PROGRESS"
                            ? "In Progress"
                            : task.status}
                      </StatusIndicator>

                      {deadlineStatus ? (
                        <span className={`text-xs font-medium ${getDeadlineColor(deadlineStatus)}`}>
                          {deadlineLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SurfaceCard>
      </div>
    </section>
  );
}
