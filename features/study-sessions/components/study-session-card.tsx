"use client";

import type { StudySessionItem } from "@/types/study-session";
import { formatDuration, formatSessionDate } from "@/features/study-sessions/utils/session-format";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StudySessionUpdateDialog } from "@/features/study-sessions/components/study-session-update-dialog";
import { StudySessionDeleteDialog } from "@/features/study-sessions/components/study-session-delete-dialog";

type StudySessionCardProps = {
  session: StudySessionItem;
};

const moodVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  FOCUSED: "success",
  NORMAL: "info",
  TIRED: "warning",
  DISTRACTED: "danger",
};

const moodLabel: Record<string, string> = {
  FOCUSED: "Focused",
  NORMAL: "Normal",
  TIRED: "Tired",
  DISTRACTED: "Distracted",
};

export function StudySessionCard({ session }: StudySessionCardProps) {
  return (
    <Card className="p-5 sm:p-6">
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

        <Badge variant={moodVariant[session.mood] ?? "default"}>
          {moodLabel[session.mood] ?? session.mood}
        </Badge>
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
        <span>▶ {formatSessionDate(session.startedAt)}</span>

        {session.endedAt ? <span>⏹ {formatSessionDate(session.endedAt)}</span> : null}
      </div>

      {session.note ? (
        <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-500 italic">
          &ldquo;{session.note}&rdquo;
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 sm:flex sm:justify-end">
        <StudySessionUpdateDialog session={session} />
        <StudySessionDeleteDialog session={session} />
      </div>
    </Card>
  );
}
