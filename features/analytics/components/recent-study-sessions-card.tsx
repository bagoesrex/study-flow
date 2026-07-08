import { Clock, Timer } from "lucide-react";

import type { RecentStudySessionItem } from "@/types/analytics";
import { formatDateTime } from "@/features/analytics/utils/analytics-format";
import { formatDuration } from "@/features/study-sessions/utils/session-format";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type RecentStudySessionsCardProps = {
  sessions: RecentStudySessionItem[];
};

const moodVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  FOCUSED: "success",
  NORMAL: "info",
  TIRED: "warning",
  DISTRACTED: "danger",
};

export function RecentStudySessionsCard({ sessions }: RecentStudySessionsCardProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-1 text-lg font-semibold tracking-tight text-slate-950">
        Recent Study Sessions
      </h3>
      <p className="mb-6 text-sm text-slate-500">Your latest study activity.</p>

      {sessions.length === 0 ? (
        <div className="flex h-48 items-center justify-center">
          <div className="text-center">
            <Timer className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-400">No study sessions yet.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: session.subjectColor }}
                  />
                  <span className="text-sm font-medium text-slate-700">{session.subjectName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={moodVariant[session.mood] ?? "default"}>{session.mood}</Badge>
                  <span className="text-sm font-semibold whitespace-nowrap text-slate-900">
                    {formatDuration(session.durationMinutes)}
                  </span>
                </div>
              </div>

              {session.studyPlanTitle ? (
                <p className="mb-1 text-xs text-slate-500">
                  <span className="font-medium text-slate-600">Plan:</span> {session.studyPlanTitle}
                </p>
              ) : null}

              {session.taskTitle ? (
                <p className="mb-1 text-xs text-slate-500">
                  <span className="font-medium text-slate-600">Task:</span> {session.taskTitle}
                </p>
              ) : null}

              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{formatDateTime(session.startedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
