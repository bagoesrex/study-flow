"use client";

import { BookOpen, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { StudyPlanItem } from "@/types/study-plan";
import { Progress } from "@/components/ui/progress";
import { SurfaceCard } from "@/components/common/surface-card";
import { ActionMenu } from "@/components/common/action-menu";
import { StatusBadge, getStatusVariant } from "@/components/common/status-indicator";
import { StudyPlanDeleteDialog } from "@/features/study-plans/components/study-plan-delete-dialog";
import { StudyPlanUpdateDialog } from "@/features/study-plans/components/study-plan-update-dialog";
import {
  getProgressDescription,
  getProgressLabel,
} from "@/features/study-plans/utils/study-plan-progress";
import { Button } from "@/components/ui/button";

type StudyPlanCardProps = {
  plan: StudyPlanItem;
};

const statusLabel: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  PAUSED: "Paused",
  CANCELLED: "Cancelled",
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
                style={{ backgroundColor: plan.subjectColor }}
              />
              <span className="text-sm font-medium text-slate-500">{plan.subjectName}</span>
            </div>

            <h3 className="truncate text-lg font-semibold tracking-tight text-slate-950">
              {plan.title}
            </h3>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <StatusBadge variant={getStatusVariant(plan.status)}>
              {statusLabel[plan.status] ?? plan.status}
            </StatusBadge>

            <StatusBadge variant={getStatusVariant(plan.priority)}>{plan.priority}</StatusBadge>

            <ActionMenu
              label="Study plan actions"
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
              {formatDate(plan.startDate) ?? "—"} → {formatDate(plan.endDate) ?? "—"}
            </span>
          ) : null}

          {plan.estimatedHours ? <span>{plan.estimatedHours}h estimated</span> : null}
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

        <div className="flex border-t border-slate-100 pt-4 sm:justify-end">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/tasks?studyPlanId=${plan.id}`}>
              <BookOpen className="mr-1.5 h-4 w-4" />
              View Tasks
            </Link>
          </Button>
        </div>
      </SurfaceCard>

      <StudyPlanUpdateDialog plan={plan} open={updateOpen} onOpenChange={setUpdateOpen} />
      <StudyPlanDeleteDialog plan={plan} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}
