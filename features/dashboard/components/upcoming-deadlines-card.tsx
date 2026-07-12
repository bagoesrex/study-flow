import type { TodayFocusTask } from "@/actions/dashboard-today-focus";
import { SurfaceCard } from "@/components/common/surface-card";
import { StatusBadge, getStatusVariant } from "@/components/common/status-indicator";
import { EntityMeta } from "@/components/common/entity-meta";
import { SectionHeader } from "@/components/common/section-header";
import { getRelativeDateLabel, getDeadlineStatus } from "@/utils/date-label";

type UpcomingDeadlinesCardProps = {
  tasks: TodayFocusTask[];
};

function getDeadlineColor(status: "overdue" | "today" | "soon" | "upcoming"): string {
  if (status === "overdue") return "text-rose-600";
  if (status === "today") return "text-amber-600";
  if (status === "soon") return "text-indigo-600";
  return "text-slate-500";
}

export function UpcomingDeadlinesCard({ tasks }: UpcomingDeadlinesCardProps) {
  const hasData = tasks.length > 0;

  return (
    <section>
      <SectionHeader title="Upcoming Deadlines" description="Tasks sorted by due date." />

      <div className="mt-4">
        <SurfaceCard className="p-5 sm:p-6">
          {!hasData ? (
            <p className="text-sm text-slate-500">
              No upcoming deadlines. Create a task with a due date to see it here.
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const deadlineStatus = task.dueDate ? getDeadlineStatus(task.dueDate) : null;
                const deadlineLabel = task.dueDate ? getRelativeDateLabel(task.dueDate) : null;

                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-3 transition hover:border-slate-200"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-950">{task.title}</p>
                      <EntityMeta
                        items={
                          [task.subjectName ? { label: task.subjectName } : null].filter(
                            Boolean
                          ) as { label: string }[]
                        }
                        className="mt-0.5"
                      />
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge variant={getStatusVariant(task.priority)}>
                        {task.priority}
                      </StatusBadge>

                      {deadlineStatus && deadlineLabel ? (
                        <span
                          className={`text-xs font-medium whitespace-nowrap ${getDeadlineColor(deadlineStatus)}`}
                        >
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
