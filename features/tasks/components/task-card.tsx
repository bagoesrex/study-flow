"use client";

import type { TaskItem } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TaskStatusButton } from "@/features/tasks/components/task-status-button";
import { TaskUpdateDialog } from "@/features/tasks/components/task-update-dialog";
import { TaskDeleteDialog } from "@/features/tasks/components/task-delete-dialog";

type TaskCardProps = {
  task: TaskItem;
};

const statusVariant: Record<string, "default" | "success" | "info"> = {
  TODO: "default",
  IN_PROGRESS: "info",
  DONE: "success",
};

const statusLabel: Record<string, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const priorityVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  LOW: "default",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "danger",
};

function formatDate(date: string | null) {
  if (!date) return null;

  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: Date | null) {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: task.subjectColor }}
            />
            <span className="text-sm font-medium text-slate-500">{task.studyPlanTitle}</span>
          </div>

          <h3 className="truncate text-lg font-semibold tracking-tight text-slate-950">
            {task.title}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={statusVariant[task.status] ?? "default"}>
            {statusLabel[task.status] ?? task.status}
          </Badge>

          <Badge variant={priorityVariant[task.priority] ?? "default"}>{task.priority}</Badge>
        </div>
      </div>

      {task.description ? (
        <p className="mb-3 text-sm leading-6 text-slate-500">{task.description}</p>
      ) : null}

      <div className="mb-5 flex flex-wrap gap-4 text-sm text-slate-500">
        <span>📚 {task.subjectName}</span>

        {task.dueDate ? <span>📅 Due {formatDate(task.dueDate)}</span> : null}

        {task.completedAt ? <span>✅ Done {formatDateTime(task.completedAt)}</span> : null}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <TaskStatusButton taskId={task.id} currentStatus={task.status} />
        <TaskUpdateDialog task={task} />
        <TaskDeleteDialog task={task} />
      </div>
    </Card>
  );
}
