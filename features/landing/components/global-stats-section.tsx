import { BookOpen, CheckCircle2, Clock3, LayoutList, Users, Target } from "lucide-react";

import type { LandingStats } from "@/features/landing/queries/get-landing-stats";

type GlobalStatsSectionProps = {
  stats: LandingStats;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

const statItems = [
  {
    label: "Total Users",
    key: "totalUsers" as const,
    icon: Users,
  },
  {
    label: "Study Plans Created",
    key: "totalStudyPlans" as const,
    icon: LayoutList,
  },
  {
    label: "Sessions Completed",
    key: "totalStudySessions" as const,
    icon: Clock3,
  },
  {
    label: "Hours Tracked",
    key: "totalHoursTracked" as const,
    icon: Target,
  },
  {
    label: "Completion Rate",
    key: "averageCompletionRate" as const,
    icon: CheckCircle2,
    suffix: "%",
  },
  {
    label: "Testimonials",
    key: "totalPublishedTestimonials" as const,
    icon: BookOpen,
  },
];

export function GlobalStatsSection({ stats }: GlobalStatsSectionProps) {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statItems.map((item) => {
            const Icon = item.icon;
            const value = stats[item.key];
            const displayValue = `${formatNumber(value)}${item.suffix ?? ""}+`;

            return (
              <div
                key={item.key}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-bold tracking-tight text-slate-950">{displayValue}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
