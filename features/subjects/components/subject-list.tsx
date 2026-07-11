"use client";

import { SubjectCard } from "@/features/subjects/components/subject-card";
import { SubjectEmptyState } from "@/features/subjects/components/subject-empty-state";
import { useSubjectsQuery } from "@/features/subjects/hooks/use-subjects-query";
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
import { ErrorState } from "@/components/common/error-state";

export function SubjectList() {
  const query = useSubjectsQuery();

  if (query.isLoading) {
    return <CardGridSkeleton count={4} />;
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  const subjects = query.data ?? [];

  if (subjects.length === 0) {
    return <SubjectEmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {subjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
}
