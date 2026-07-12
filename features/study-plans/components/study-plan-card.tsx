"use client";

import type { StudyPlanItem } from "@/types/study-plan";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudyPlanDeleteDialog } from "@/features/study-plans/components/study-plan-delete-dialog";
import { StudyPlanUpdateDialog } from "@/features/study-plans/components/study-plan-update-dialog";
import {
  getProgressDescription,
  getProgressLabel,
} from "@/features/study-plans/utils/study-plan-progress";

type StudyPlanCardProps = {
  plan: StudyPlanItem;
};

const statusVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  NOT_STARTED: "default",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  PAUSED: "warning",
  CANCELLED: "danger",
};

const statusLabel: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  PAUSED: "Paused",
  CANCELLED: "Cancelled",
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

export function StudyPlanCard({ plan }: StudyPlanCardProps) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: plan.subjectColor }}
            />
            <span className="text-sm font-medium text-slate-500">{plan.subjectName}</span>
          </div>

          <h3 className="truncate text-lg font-semibold tracking-tight text-slate-950">
            {plan.title}
          </h3>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge variant={statusVariant[plan.status] ?? "default"}>
            {statusLabel[plan.status] ?? plan.status}
          </Badge>

          <Badge variant={priorityVariant[plan.priority] ?? "default"}>{plan.priority}</Badge>
        </div>
      </div>

      {plan.description ? (
        <p className="mb-3 line-clamp-2 text-sm leading-6 text-slate-500">{plan.description}</p>
      ) : null}

      {plan.goal ? (
        <p className="mb-3 line-clamp-3 text-sm text-slate-500">
          <span className="font-medium text-slate-700">Goal:</span> {plan.goal}
        </p>
      ) : null}

      <div className="mb-5 flex flex-wrap gap-4 text-sm text-slate-500">
        {plan.startDate || plan.endDate ? (
          <span>
            📅 {formatDate(plan.startDate) ?? "—"} → {formatDate(plan.endDate) ?? "—"}
          </span>
        ) : null}

        {plan.estimatedHours ? <span>⏱ {plan.estimatedHours}h estimated</span> : null}
      </div>

      <div className="my-5">
        <div className="mb-2 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-950">
              {getProgressLabel(plan.progress)}
            </p>
            <p className="text-xs text-slate-500">
              {getProgressDescription({
                completedTasks: plan.completedTasks,
                totalTasks: plan.totalTasks,
              })}
            </p>
          </div>

          <p className="shrink-0 text-sm font-semibold text-slate-950">{plan.progress}%</p>
        </div>

        <Progress value={plan.progress} />
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 sm:flex sm:justify-end">
        <StudyPlanUpdateDialog plan={plan} />
        <StudyPlanDeleteDialog plan={plan} />
      </div>
    </Card>
  );
}
