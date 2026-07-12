import Link from "next/link";

import { SurfaceCard } from "@/components/common/surface-card";
import { Progress } from "@/components/ui/progress";
import { SectionHeader } from "@/components/common/section-header";
import type { DashboardActivePlanProgress } from "@/types/dashboard";

type ActiveStudyPlansCardProps = {
  plans: DashboardActivePlanProgress[];
};

export function ActiveStudyPlansCard({ plans }: ActiveStudyPlansCardProps) {
  return (
    <section>
      <SectionHeader
        title="Active Study Plans"
        description="Track your ongoing plans and progress."
        action={
          <Link
            href="/dashboard/plans"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-950"
          >
            View all
          </Link>
        }
      />

      <div className="mt-4">
        <SurfaceCard className="p-5 sm:p-6">
          {plans.length === 0 ? (
            <p className="text-sm text-slate-500">
              No active study plans.{" "}
              <Link
                href="/dashboard/plans"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Create your first study plan.
              </Link>
            </p>
          ) : (
            <div className="space-y-5">
              {plans.slice(0, 4).map((plan) => (
                <div key={plan.id}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: plan.subjectColor }}
                        />
                        <p className="text-xs font-medium text-slate-500">{plan.subjectName}</p>
                      </div>

                      <p className="truncate text-sm font-medium text-slate-950">{plan.title}</p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-slate-950">
                      {plan.progress}%
                    </p>
                  </div>

                  <Progress value={plan.progress} />

                  <p className="mt-2 text-xs text-slate-500">
                    {plan.completedTasks}/{plan.totalTasks} tasks completed
                  </p>
                </div>
              ))}
            </div>
          )}
        </SurfaceCard>
      </div>
    </section>
  );
}
