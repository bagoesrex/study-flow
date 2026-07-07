import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardPreviewCard } from "@/features/landing/components/dashboard-preview-card";

export function HeroSection() {
  return (
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
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>

        <DashboardPreviewCard />
      </div>
    </section>
  );
}
