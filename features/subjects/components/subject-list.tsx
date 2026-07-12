"use client";

import { FilteredEmptyState } from "@/components/common/filtered-empty-state";
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
import { ErrorState } from "@/components/common/error-state";
import { SubjectCard } from "@/features/subjects/components/subject-card";
import { SubjectDataControls } from "@/features/subjects/components/subject-data-controls";
import { SubjectEmptyState } from "@/features/subjects/components/subject-empty-state";
import { useSubjectFilters } from "@/features/subjects/hooks/use-subject-filters";
import { useSubjectsQuery } from "@/features/subjects/hooks/use-subjects-query";

export function SubjectList() {
  const query = useSubjectsQuery();
  const subjects = query.data ?? [];
  const filters = useSubjectFilters(subjects);

  if (query.isLoading) {
    return <CardGridSkeleton count={4} />;
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  if (subjects.length === 0) {
    return <SubjectEmptyState />;
  }

  if (filters.filteredSubjects.length === 0) {
    return (
      <div className="space-y-6">
        <SubjectDataControls
          search={filters.search}
          onSearchChange={filters.setSearch}
          archive={filters.archive}
          onArchiveChange={filters.setArchive}
          sort={filters.sort}
          onSortChange={filters.setSort}
          filteredCount={filters.filteredSubjects.length}
          totalCount={subjects.length}
          hasActiveFilters={filters.hasActiveFilters}
          onReset={filters.resetFilters}
        />

        <FilteredEmptyState onReset={filters.resetFilters} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubjectDataControls
        search={filters.search}
        onSearchChange={filters.setSearch}
        archive={filters.archive}
        onArchiveChange={filters.setArchive}
        sort={filters.sort}
        onSortChange={filters.setSort}
        filteredCount={filters.filteredSubjects.length}
        totalCount={subjects.length}
        hasActiveFilters={filters.hasActiveFilters}
        onReset={filters.resetFilters}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {filters.filteredSubjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
}
