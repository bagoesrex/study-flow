"use client";

import { useState } from "react";
import { m, AnimatePresence } from "motion/react";

import { LandingSection } from "@/features/landing/components/landing-section";
import { Reveal } from "@/features/landing/components/reveal";
import { landingWorkflowSteps } from "@/features/landing/data/landing-content";
import { cn } from "@/lib/cn";

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const currentStep = landingWorkflowSteps.find((s) => s.step === activeStep)!;

  return (
    <LandingSection id="how-it-works" className="border-t border-slate-200/70 bg-white">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-200/60 bg-indigo-50/80 px-4 py-1.5 text-xs font-medium text-indigo-700">
            How It Works
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            From goal to progress in five steps
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500">
            Getting started with StudyFlow is simple. Follow these steps to build your learning
            system.
          </p>
        </div>
      </Reveal>

      <div className="mt-16 lg:grid lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-16">
        <div className="relative">
          <div className="hidden lg:absolute lg:top-6 lg:left-6 lg:-z-10 lg:block lg:h-[calc(100%-3rem)] lg:w-0.5 lg:bg-slate-200" />

          <div className="space-y-4">
            {landingWorkflowSteps.map((step) => {
              const isActive = activeStep === step.step;
              const isPast = activeStep > step.step;

              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setActiveStep(step.step)}
                  className={cn(
                    "relative flex w-full items-start gap-5 rounded-2xl p-4 text-left transition lg:p-5",
                    isActive ? "bg-indigo-50 shadow-sm" : "hover:bg-slate-50"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition",
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : isPast
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {isPast ? "✓" : step.step}
                  </span>

                  <div className="min-w-0">
                    <h3
                      className={cn(
                        "text-base font-semibold transition",
                        isActive ? "text-slate-950" : "text-slate-700"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{step.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 lg:sticky lg:top-28 lg:mt-0">
          <AnimatePresence mode="wait">
            <m.div
              key={activeStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-sm">
                {currentStep.step}
              </span>

              <h3 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
                {currentStep.title}
              </h3>

              <p className="mt-4 text-base leading-7 text-slate-600">{currentStep.description}</p>

              <p className="mt-4 text-sm leading-6 text-slate-500">{currentStep.detail}</p>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </LandingSection>
  );
}
