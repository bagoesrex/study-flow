import Link from "next/link";
import { ArrowRight, BarChart3, CalendarDays, CheckSquare, Timer } from "lucide-react";

import { SectionHeader } from "@/components/common/section-header";
import { StatCard } from "@/components/common/stat-card";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    label: "Study Plans Created",
    value: "1,240+",
    description: "Plans organized by focused learners.",
  },
  {
    label: "Sessions Completed",
    value: "8,900+",
    description: "Study sessions tracked over time.",
  },
  {
    label: "Hours Tracked",
    value: "3,500+",
    description: "Learning hours recorded in dashboards.",
  },
  {
    label: "Completion Rate",
    value: "92%",
    description: "Average task completion across plans.",
  },
];

const features = [
  {
    title: "Study Plan Management",
    description: "Create structured learning plans with goals, deadlines, and progress.",
    icon: CalendarDays,
  },
  {
    title: "Task Tracking",
    description: "Break big goals into small tasks and track every step clearly.",
    icon: CheckSquare,
  },
  {
    title: "Session Tracker",
    description: "Record study duration, mood, notes, and daily learning activity.",
    icon: Timer,
  },
  {
    title: "Analytics Dashboard",
    description: "Understand your learning habits with charts and useful insights.",
    icon: BarChart3,
  },
];

export default function HomePage() {
  return (
    <MarketingShell>
      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-indigo-50 via-cyan-50/60 to-white" />

          <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
            <div>
              <Badge variant="info">Fullstack Study Planner</Badge>

              <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Plan smarter.{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                  Study better.
                </span>{" "}
                Track your progress.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                StudyFlow helps students and developers organize study goals, manage tasks, track
                learning sessions, and review progress in one clean dashboard.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Start Planning
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button variant="secondary" size="lg" asChild>
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>

            <Card className="relative overflow-hidden p-5">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">This Week</p>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                    Learning Overview
                  </h2>
                </div>
                <Badge variant="success">On Track</Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <StatCard label="Study Hours" value="8.5h" description="+2.1h from last week" />
                <StatCard label="Tasks Done" value="12/18" description="66% completion rate" />
              </div>

              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">Next.js Fullstack</p>
                  <p className="text-sm font-semibold text-slate-950">72%</p>
                </div>
                <Progress value={72} />
              </div>

              <div className="mt-5 grid grid-cols-5 items-end gap-2 rounded-3xl border border-slate-200 bg-white p-5">
                {[35, 70, 45, 90, 60].map((height, index) => (
                  <div
                    key={index}
                    className="rounded-full bg-gradient-to-t from-indigo-600 to-cyan-400"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="bg-white py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Features"
              title="Everything you need to stay consistent"
              description="Manage your learning plan, task, deadline, and session history from one focused workspace."
              align="center"
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Card key={feature.title} className="p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
