"use client";

import { FilteredEmptyState } from "@/components/common/filtered-empty-state";
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
import { ErrorState } from "@/components/common/error-state";
import { StudyPlanCard } from "@/features/study-plans/components/study-plan-card";
import { StudyPlanDataControls } from "@/features/study-plans/components/study-plan-data-controls";
import { StudyPlanEmptyState } from "@/features/study-plans/components/study-plan-empty-state";
import { useStudyPlanFilters } from "@/features/study-plans/hooks/use-study-plan-filters";
import { useStudyPlansQuery } from "@/features/study-plans/hooks/use-study-plans-query";

export function StudyPlanList() {
  const query = useStudyPlansQuery();
  const plans = query.data ?? [];
  const filters = useStudyPlanFilters(plans);

  if (query.isLoading) {
    return <CardGridSkeleton count={4} />;
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  if (plans.length === 0) {
    return <StudyPlanEmptyState />;
  }

  const subjectOptions = Array.from(
    new Map(
      plans.map((plan) => [
        plan.subjectId,
        {
          value: plan.subjectId,
          label: plan.subjectName,
        },
      ])
    ).values()
  );

  if (filters.filteredPlans.length === 0) {
    return (
      <div className="space-y-6">
        <StudyPlanDataControls
          search={filters.search}
          onSearchChange={filters.setSearch}
          subjectId={filters.subjectId}
          onSubjectChange={filters.setSubjectId}
          status={filters.status}
          onStatusChange={filters.setStatus}
          priority={filters.priority}
          onPriorityChange={filters.setPriority}
          sort={filters.sort}
          onSortChange={filters.setSort}
          subjectOptions={subjectOptions}
          filteredCount={filters.filteredPlans.length}
          totalCount={plans.length}
          hasActiveFilters={filters.hasActiveFilters}
          onReset={filters.resetFilters}
        />

        <FilteredEmptyState onReset={filters.resetFilters} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudyPlanDataControls
        search={filters.search}
        onSearchChange={filters.setSearch}
        subjectId={filters.subjectId}
        onSubjectChange={filters.setSubjectId}
        status={filters.status}
        onStatusChange={filters.setStatus}
        priority={filters.priority}
        onPriorityChange={filters.setPriority}
        sort={filters.sort}
        onSortChange={filters.setSort}
        subjectOptions={subjectOptions}
        filteredCount={filters.filteredPlans.length}
        totalCount={plans.length}
        hasActiveFilters={filters.hasActiveFilters}
        onReset={filters.resetFilters}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {filters.filteredPlans.map((plan) => (
          <StudyPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
