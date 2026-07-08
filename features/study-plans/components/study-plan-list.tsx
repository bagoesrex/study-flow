"use client";

import { StudyPlanCard } from "@/features/study-plans/components/study-plan-card";
import { StudyPlanEmptyState } from "@/features/study-plans/components/study-plan-empty-state";
import { useStudyPlansQuery } from "@/features/study-plans/hooks/use-study-plans-query";
import { Card } from "@/components/ui/card";

export function StudyPlanList() {
  const query = useStudyPlansQuery();

  if (query.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-72 animate-pulse bg-slate-100" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-950">Gagal memuat study plan</h3>
        <p className="mt-2 text-sm text-slate-500">Silakan refresh halaman atau coba lagi nanti.</p>
      </Card>
    );
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
