import Link from "next/link";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardActivePlanProgress } from "@/types/dashboard";

type ActivePlanProgressCardProps = {
  plans: DashboardActivePlanProgress[];
};

export function ActivePlanProgressCard({ plans }: ActivePlanProgressCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Active Plan Progress</CardTitle>
        <Link
          href="/dashboard/plans"
          className="text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent>
        {plans.length === 0 ? (
          <p className="text-sm text-slate-500">
            Belum ada active study plan. Buat study plan untuk mulai melacak progres.
          </p>
        ) : (
          <div className="space-y-5">
            {plans.map((plan) => (
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

                  <p className="shrink-0 text-sm font-semibold text-slate-950">{plan.progress}%</p>
                </div>

                <Progress value={plan.progress} />

                <p className="mt-2 text-xs text-slate-500">
                  {plan.completedTasks}/{plan.totalTasks} tasks completed
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
