"use client";

import { StudySessionCard } from "@/features/study-sessions/components/study-session-card";
import { StudySessionEmptyState } from "@/features/study-sessions/components/study-session-empty-state";
import { useStudySessionsQuery } from "@/features/study-sessions/hooks/use-study-sessions-query";
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
import { ErrorState } from "@/components/common/error-state";

export function StudySessionList() {
  const query = useStudySessionsQuery();

  if (query.isLoading) {
    return <CardGridSkeleton count={4} />;
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />;
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
