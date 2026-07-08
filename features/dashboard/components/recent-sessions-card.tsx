import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardRecentSession } from "@/types/dashboard";
import { formatDateTime, formatMinutes } from "@/features/dashboard/utils/dashboard-format";

type RecentSessionsCardProps = {
  sessions: DashboardRecentSession[];
};

function getMoodVariant(mood: DashboardRecentSession["mood"]) {
  if (mood === "FOCUSED") return "success";
  if (mood === "NORMAL") return "info";
  if (mood === "TIRED") return "warning";
  return "danger";
}

export function RecentSessionsCard({ sessions }: RecentSessionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Recent Sessions</CardTitle>
        <Link
          href="/dashboard/sessions"
          className="text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-500">
            Belum ada study session. Catat sesi belajar pertama kamu.
          </p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: session.subjectColor }}
                      />
                      <p className="text-xs font-medium text-slate-500">{session.subjectName}</p>
                    </div>

                    <h3 className="truncate text-sm font-semibold text-slate-950">
                      {session.studyPlanTitle ?? "General Study Session"}
                    </h3>

                    {session.taskTitle ? (
                      <p className="mt-1 truncate text-xs text-slate-500">
                        Task: {session.taskTitle}
                      </p>
                    ) : null}
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-slate-950">
                    {formatMinutes(session.durationMinutes)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getMoodVariant(session.mood)}>{session.mood}</Badge>
                  <span className="text-xs text-slate-500">
                    {formatDateTime(session.startedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
