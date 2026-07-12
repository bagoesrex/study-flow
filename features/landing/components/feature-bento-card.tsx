"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { m } from "motion/react";

import { cn } from "@/lib/cn";

type FeatureBentoCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  visual: ReactNode;
  className?: string;
  accent?: "indigo" | "cyan" | "violet" | "slate";
};

const accentBgs: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
  cyan: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white",
  violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
  slate: "bg-slate-100 text-slate-600 group-hover:bg-slate-600 group-hover:text-white",
};

export function FeatureBentoCard({
  title,
  description,
  icon: Icon,
  visual,
  className,
  accent = "slate",
}: FeatureBentoCardProps) {
  return (
    <m.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:border-slate-300/70 hover:shadow-lg sm:p-8",
        className
      )}
    >
      <div className="mb-5 flex items-start justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl transition-colors",
            accentBgs[accent]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

      {visual ? (
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition group-hover:bg-slate-50">
          {visual}
        </div>
      ) : null}
    </m.div>
  );
}
