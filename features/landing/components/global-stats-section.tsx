import { BookOpen, CheckCircle2, Clock3, LayoutList, Target, Users } from "lucide-react";

import type { LandingStats } from "@/features/landing/queries/get-landing-stats";
import { AnimatedCounter } from "@/features/landing/components/animated-counter";
import { LandingSection } from "@/features/landing/components/landing-section";
import { Reveal } from "@/features/landing/components/reveal";

type GlobalStatsSectionProps = {
  stats: LandingStats;
};

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
    <LandingSection className="border-b border-slate-200/70 bg-slate-50">
      <Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statItems.map((item) => {
            const Icon = item.icon;
            const value = stats[item.key];

            return (
              <div
                key={item.key}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300/70 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white transition group-hover:bg-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-bold tracking-tight text-slate-950">
                  <AnimatedCounter value={value} suffix={item.suffix ?? ""} />
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.label}</p>
              </div>
            );
          })}
        </div>
      </Reveal>
    </LandingSection>
  );
}
