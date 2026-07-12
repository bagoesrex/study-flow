"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import type { StudySessionItem } from "@/types/study-session";
import { formatDuration, formatSessionDate } from "@/features/study-sessions/utils/session-format";
import { SurfaceCard } from "@/components/common/surface-card";
import { ActionMenu } from "@/components/common/action-menu";
import { StatusBadge, getStatusVariant } from "@/components/common/status-indicator";
import { StudySessionUpdateDialog } from "@/features/study-sessions/components/study-session-update-dialog";
import { StudySessionDeleteDialog } from "@/features/study-sessions/components/study-session-delete-dialog";

type StudySessionCardProps = {
  session: StudySessionItem;
};

const moodLabel: Record<string, string> = {
  FOCUSED: "Focused",
  NORMAL: "Normal",
  TIRED: "Tired",
  DISTRACTED: "Distracted",
};

export function StudySessionCard({ session }: StudySessionCardProps) {
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
                style={{ backgroundColor: session.subjectColor }}
              />
              <span className="truncate text-sm font-medium text-slate-500">
                {session.subjectName}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold tracking-tight text-slate-950">
                {formatDuration(session.durationMinutes)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge variant={getStatusVariant(session.mood)}>
              {moodLabel[session.mood] ?? session.mood}
            </StatusBadge>

            <ActionMenu
              label="Session actions"
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

        {session.studyPlanTitle ? (
          <p className="mb-1 truncate text-sm text-slate-500">
            <span className="font-medium text-slate-700">Study Plan:</span> {session.studyPlanTitle}
          </p>
        ) : null}

        {session.taskTitle ? (
          <p className="mb-1 truncate text-sm text-slate-500">
            <span className="font-medium text-slate-700">Task:</span> {session.taskTitle}
          </p>
        ) : null}

        <div className="mb-3 flex flex-wrap gap-4 text-sm text-slate-500">
          <span>{formatSessionDate(session.startedAt)}</span>

          {session.endedAt ? <span>{formatSessionDate(session.endedAt)}</span> : null}
        </div>

        {session.note ? (
          <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-500 italic">
            &ldquo;{session.note}&rdquo;
          </p>
        ) : null}
      </SurfaceCard>

      <StudySessionUpdateDialog session={session} open={updateOpen} onOpenChange={setUpdateOpen} />
      <StudySessionDeleteDialog session={session} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}
