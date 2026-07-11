"use client";

import { StudyPlanCard } from "@/features/study-plans/components/study-plan-card";
import { StudyPlanEmptyState } from "@/features/study-plans/components/study-plan-empty-state";
import { useStudyPlansQuery } from "@/features/study-plans/hooks/use-study-plans-query";
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
import { ErrorState } from "@/components/common/error-state";

export function StudyPlanList() {
  const query = useStudyPlansQuery();

  if (query.isLoading) {
    return <CardGridSkeleton count={4} />;
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  const plans = query.data ?? [];

  if (plans.length === 0) {
    return <StudyPlanEmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {plans.map((plan) => (
        <StudyPlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
