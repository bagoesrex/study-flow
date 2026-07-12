"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import type { TaskItem } from "@/types/task";
import { SurfaceCard } from "@/components/common/surface-card";
import { ActionMenu } from "@/components/common/action-menu";
import { StatusBadge, getStatusVariant } from "@/components/common/status-indicator";
import { TaskStatusButton } from "@/features/tasks/components/task-status-button";
import { TaskUpdateDialog } from "@/features/tasks/components/task-update-dialog";
import { TaskDeleteDialog } from "@/features/tasks/components/task-delete-dialog";

type TaskCardProps = {
  task: TaskItem;
};

const statusLabel: Record<string, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
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
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <SurfaceCard className="p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: task.subjectColor }}
              />
              <span className="truncate text-sm font-medium text-slate-500">
                {task.studyPlanTitle}
              </span>
            </div>

            <h3 className="truncate text-lg font-semibold tracking-tight text-slate-950">
              {task.title}
            </h3>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <StatusBadge variant={getStatusVariant(task.status)}>
              {statusLabel[task.status] ?? task.status}
            </StatusBadge>

            <StatusBadge variant={getStatusVariant(task.priority)}>{task.priority}</StatusBadge>

            <ActionMenu
              label="Task actions"
              items={[
                {
                  label: "Edit",
                  icon: Pencil,
                  onSelect: () => setUpdateOpen(true),
                },
                {
                  label: "Delete",
                  icon: Trash2,
                  onSelect: () => setDeleteOpen(true),
                  destructive: true,
                },
              ]}
            />
          </div>
        </div>

        {task.description ? (
          <p className="mb-3 line-clamp-2 text-sm leading-6 text-slate-500">{task.description}</p>
        ) : null}

        <div className="mb-5 flex flex-wrap gap-4 text-sm text-slate-500">
          <span>{task.subjectName}</span>

          {task.dueDate ? <span>Due {formatDate(task.dueDate)}</span> : null}

          {task.completedAt ? <span>Done {formatDateTime(task.completedAt)}</span> : null}
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 sm:justify-end">
          <TaskStatusButton taskId={task.id} currentStatus={task.status} />
        </div>
      </SurfaceCard>

      <TaskUpdateDialog task={task} open={updateOpen} onOpenChange={setUpdateOpen} />
      <TaskDeleteDialog task={task} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}
