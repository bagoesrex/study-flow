import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HeroProductDemo } from "@/features/landing/components/hero-product-demo";
import { FloatingActivityCards } from "@/features/landing/components/floating-activity-card";

const trustPoints = ["Structured study plans", "Progress analytics", "AI-assisted planning"];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-slate-200/70">
      <div className="absolute inset-0 -z-20 bg-white" />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />

      <div className="absolute top-0 left-1/2 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="absolute top-40 right-0 -z-10 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="landing-grid-background absolute inset-0 -z-10 opacity-50" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-16 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <div>
          <span className="inline-flex items-center rounded-full border border-indigo-200/60 bg-indigo-50/80 px-4 py-1.5 text-xs font-medium text-indigo-700">
            AI-powered study planning
          </span>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
            Turn ambitious goals into{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              consistent progress.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Plan what to learn, organize every task, track focused sessions, and understand your
            progress from one connected workspace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register">
                Start Planning Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="secondary" size="lg" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                <span className="text-sm text-slate-500">{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <HeroProductDemo />
          <FloatingActivityCards />
        </div>
      </div>
    </section>
  );
}
