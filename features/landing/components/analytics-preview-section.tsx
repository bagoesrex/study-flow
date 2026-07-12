"use client";

import { BarChart3, BookOpen, CheckCircle2, TrendingUp } from "lucide-react";
import { m } from "motion/react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LandingSection } from "@/features/landing/components/landing-section";
import { Reveal } from "@/features/landing/components/reveal";

const previewItems = [
  {
    title: "Study Hours This Week",
    value: "24.5h",
    trend: "+12%",
    icon: TrendingUp,
  },
  {
    title: "Tasks Completed",
    value: "45/60",
    percentage: 75,
    icon: CheckCircle2,
  },
  {
    title: "Active Subjects",
    value: "4",
    description: "Next.js, Django, DB Design, English",
    icon: BookOpen,
  },
  {
    title: "Weekly Progress",
    value: "82%",
    percentage: 82,
    icon: BarChart3,
  },
];

const chartData = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2.5 },
  { day: "Wed", hours: 1 },
  { day: "Thu", hours: 3 },
  { day: "Fri", hours: 2 },
  { day: "Sat", hours: 2.5 },
  { day: "Sun", hours: 1.5 },
];

const subjectData = [
  { name: "Next.js", hours: "12h", percentage: 48 },
  { name: "Django", hours: "6.5h", percentage: 26 },
  { name: "DB Design", hours: "4h", percentage: 16 },
  { name: "English", hours: "2h", percentage: 10 },
];

export function AnalyticsPreviewSection() {
  return (
    <LandingSection id="analytics" className="border-t border-slate-200/70 bg-slate-50">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-200/60 bg-indigo-50/80 px-4 py-1.5 text-xs font-medium text-indigo-700">
            See the pattern behind your progress
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Know what is working—and what needs more focus.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500">
            StudyFlow turns sessions, tasks, and completed plans into clear progress insights.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {previewItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <Reveal key={item.title} delay={index * 0.08}>
              <Card className="p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  {"trend" in item && item.trend ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {item.trend}
                    </span>
                  ) : null}
                </div>

                <p className="text-2xl font-bold tracking-tight text-slate-950">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500">{item.title}</p>

                {"percentage" in item && item.percentage !== undefined ? (
                  <div className="mt-4">
                    <Progress value={item.percentage} />
                  </div>
                ) : null}

                {"description" in item && item.description ? (
                  <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                ) : null}
              </Card>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal delay={0.15}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">
              Weekly Study Distribution
            </h3>
            <div className="mt-6 grid h-64 grid-cols-7 items-end gap-3">
              {chartData.map((item, index) => {
                const height = (item.hours / 3) * 100;
                return (
                  <div key={item.day} className="flex flex-col items-center gap-2">
                    <m.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: 0.2 + index * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="w-full rounded-full bg-gradient-to-t from-indigo-600 to-cyan-400"
                      style={{ minHeight: 0 }}
                    />
                    <span className="text-xs text-slate-400">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.2}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">
              Subject Breakdown
            </h3>
            <div className="mt-6 space-y-4">
              {subjectData.map((subject) => (
                <div key={subject.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">{subject.name}</p>
                    <p className="text-sm font-semibold text-slate-950">{subject.hours}</p>
                  </div>
                  <Progress value={subject.percentage} />
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>
    </LandingSection>
  );
}
