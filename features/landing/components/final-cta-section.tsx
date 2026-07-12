import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/features/landing/components/reveal";

const trustPoints = ["Free to get started", "No credit card required", "Your data stays private"];

export function FinalCtaSection() {
  return (
    <section className="relative isolate overflow-hidden border-t border-slate-200/70">
      <div className="absolute inset-0 -z-10 bg-slate-950" />

      <div className="absolute top-1/2 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="absolute -top-40 right-0 -z-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute -bottom-40 left-0 -z-10 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Make every study session move you forward.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Turn your goals into structured plans, focused tasks, and progress you can actually
              see.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-white text-slate-950 hover:bg-slate-100">
                <Link href="/register">
                  Create Your Study Plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                asChild
                className="text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">Already have an account? Login</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" aria-hidden="true" />
                  <span className="text-sm text-slate-400">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
