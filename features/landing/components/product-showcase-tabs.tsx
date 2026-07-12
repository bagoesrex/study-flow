"use client";

import { useState } from "react";
import { AnimatePresence, m } from "motion/react";

import { landingProductFeatures } from "@/features/landing/data/landing-content";
import type { LandingProductFeature } from "@/features/landing/types/landing";

const tabLabels: Record<LandingProductFeature, string> = {
  dashboard: "Dashboard",
  "study-plans": "Study Plans",
  tasks: "Tasks",
  calendar: "Calendar",
  analytics: "Analytics",
  "ai-generator": "AI Generator",
};

export function ProductShowcaseTabs() {
  const [activeFeature, setActiveFeature] = useState<LandingProductFeature>("dashboard");

  const activeData = landingProductFeatures.find((f) => f.id === activeFeature)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:pb-0" role="tablist">
        {landingProductFeatures.map((feature) => (
          <button
            key={feature.id}
            role="tab"
            aria-selected={activeFeature === feature.id}
            aria-controls={`panel-${feature.id}`}
            id={`tab-${feature.id}`}
            onClick={() => setActiveFeature(feature.id)}
            className={`shrink-0 rounded-2xl px-4 py-2.5 text-left text-sm font-medium transition lg:w-full ${
              activeFeature === feature.id
                ? "bg-slate-950 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            {tabLabels[feature.id]}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeFeature}`}
        aria-labelledby={`tab-${activeFeature}`}
        className="min-h-[320px]"
      >
        <AnimatePresence mode="wait">
          <m.div
            key={activeFeature}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-2xl font-bold tracking-tight text-slate-950">
                {activeData.title}
              </h3>

              <p className="mt-3 text-base leading-7 text-slate-500">{activeData.description}</p>

              <ul className="mt-6 space-y-3">
                {activeData.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs text-indigo-700">
                      ✓
                    </span>
                    <span className="text-sm text-slate-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
