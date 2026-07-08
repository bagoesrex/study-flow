"use client";

import { StudySessionCard } from "@/features/study-sessions/components/study-session-card";
import { StudySessionEmptyState } from "@/features/study-sessions/components/study-session-empty-state";
import { useStudySessionsQuery } from "@/features/study-sessions/hooks/use-study-sessions-query";
import { Card } from "@/components/ui/card";

export function StudySessionList() {
  const query = useStudySessionsQuery();

  if (query.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-56 animate-pulse bg-slate-100" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-950">Gagal memuat study session</h3>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
  }

  const sessions = query.data ?? [];

  if (sessions.length === 0) {
    return <StudySessionEmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sessions.map((session) => (
        <StudySessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}
