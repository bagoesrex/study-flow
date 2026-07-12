"use client";

import { m } from "motion/react";

import { landingTrustItems } from "@/features/landing/data/landing-content";

export function ProductTrustStrip() {
  return (
    <div className="border-b border-slate-200/70 bg-slate-50/80 py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-center text-xs font-medium tracking-widest text-slate-400 uppercase">
          Everything you need to stay on track
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {landingTrustItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <m.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-center gap-2.5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                  <Icon className="h-4 w-4 text-slate-600" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-slate-600">{item.label}</span>
              </m.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
