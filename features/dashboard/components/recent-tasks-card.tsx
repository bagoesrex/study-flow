import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardRecentTask } from "@/types/dashboard";
import { formatDate } from "@/features/dashboard/utils/dashboard-format";

type RecentTasksCardProps = {
  tasks: DashboardRecentTask[];
};

function getStatusVariant(status: DashboardRecentTask["status"]) {
  if (status === "DONE") return "success";
  if (status === "IN_PROGRESS") return "info";
  return "default";
}

function getPriorityVariant(priority: DashboardRecentTask["priority"]) {
  if (priority === "URGENT") return "danger";
  if (priority === "HIGH") return "warning";
  if (priority === "MEDIUM") return "info";
  return "default";
}

export function RecentTasksCard({ tasks }: RecentTasksCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Recent Tasks</CardTitle>
        <Link
          href="/dashboard/tasks"
          className="text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500">
            Belum ada task. Buat task pertama untuk mulai melacak progres.
          </p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: task.subjectColor }}
                      />
                      <p className="text-xs font-medium text-slate-500">{task.subjectName}</p>
                    </div>

                    <h3 className="truncate text-sm font-semibold text-slate-950">{task.title}</h3>

                    <p className="mt-1 truncate text-xs text-slate-500">{task.studyPlanTitle}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
                  <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                  {task.dueDate ? (
                    <span className="text-xs text-slate-500">Due {formatDate(task.dueDate)}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
