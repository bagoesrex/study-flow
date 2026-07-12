"use client";

import { FilteredEmptyState } from "@/components/common/filtered-empty-state";
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
import { ErrorState } from "@/components/common/error-state";
import { StudySessionCard } from "@/features/study-sessions/components/study-session-card";
import { StudySessionDataControls } from "@/features/study-sessions/components/study-session-data-controls";
import { StudySessionEmptyState } from "@/features/study-sessions/components/study-session-empty-state";
import { useStudySessionFilters } from "@/features/study-sessions/hooks/use-study-session-filters";
import { useStudySessionsQuery } from "@/features/study-sessions/hooks/use-study-sessions-query";

export function StudySessionList() {
  const query = useStudySessionsQuery();
  const sessions = query.data ?? [];
  const filters = useStudySessionFilters(sessions);

  if (query.isLoading) {
    return <CardGridSkeleton count={4} />;
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  if (sessions.length === 0) {
    return <StudySessionEmptyState />;
  }

  const subjectOptions = Array.from(
    new Map(
      sessions.map((session) => [
        session.subjectId,
        {
          value: session.subjectId,
          label: session.subjectName,
        },
      ])
    ).values()
  );

  const studyPlanOptions = Array.from(
    new Map(
      sessions.map((session) => [
        session.studyPlanId ?? "",
        {
          value: session.studyPlanId ?? "",
          label: session.studyPlanTitle ?? "",
        },
      ])
    ).values()
  ).filter((option) => option.value !== "");

  if (filters.filteredSessions.length === 0) {
    return (
      <div className="space-y-6">
        <StudySessionDataControls
          search={filters.search}
          onSearchChange={filters.setSearch}
          subjectId={filters.subjectId}
          onSubjectChange={filters.setSubjectId}
          studyPlanId={filters.studyPlanId}
          onStudyPlanChange={filters.setStudyPlanId}
          mood={filters.mood}
          onMoodChange={filters.setMood}
          sort={filters.sort}
          onSortChange={filters.setSort}
          subjectOptions={subjectOptions}
          studyPlanOptions={studyPlanOptions}
          filteredCount={filters.filteredSessions.length}
          totalCount={sessions.length}
          hasActiveFilters={filters.hasActiveFilters}
          onReset={filters.resetFilters}
        />

        <FilteredEmptyState onReset={filters.resetFilters} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudySessionDataControls
        search={filters.search}
        onSearchChange={filters.setSearch}
        subjectId={filters.subjectId}
        onSubjectChange={filters.setSubjectId}
        studyPlanId={filters.studyPlanId}
        onStudyPlanChange={filters.setStudyPlanId}
        mood={filters.mood}
        onMoodChange={filters.setMood}
        sort={filters.sort}
        onSortChange={filters.setSort}
        subjectOptions={subjectOptions}
        studyPlanOptions={studyPlanOptions}
        filteredCount={filters.filteredSessions.length}
        totalCount={sessions.length}
        hasActiveFilters={filters.hasActiveFilters}
        onReset={filters.resetFilters}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {filters.filteredSessions.map((session) => (
          <StudySessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}
