"use client";

import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LandingSection } from "@/features/landing/components/landing-section";
import { FeatureBentoCard } from "@/features/landing/components/feature-bento-card";
import { Reveal } from "@/features/landing/components/reveal";
import { landingFeatures } from "@/features/landing/data/landing-content";

function StudyPlanVisual() {
  return (
    <div className="space-y-3">
      {[
        { label: "Next.js Fullstack", progress: 72 },
        { label: "Database Design", progress: 45 },
        { label: "TypeScript Advanced", progress: 20 },
      ].map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">{item.label}</span>
            <span className="text-xs font-semibold text-slate-800">{item.progress}%</span>
          </div>
          <Progress value={item.progress} />
        </div>
      ))}
    </div>
  );
}

function TaskVisual() {
  return (
    <div className="space-y-2">
      {[
        { label: "Authentication setup", done: true },
        { label: "Database schema", done: true },
        { label: "API routes", done: false },
        { label: "Write tests", done: false },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-2.5">
          <CheckCircle2
            className={`h-4 w-4 shrink-0 ${item.done ? "text-emerald-500" : "text-slate-300"}`}
            aria-hidden="true"
          />
          <span
            className={`text-sm ${item.done ? "text-slate-400 line-through" : "text-slate-700"}`}
          >
            {item.label}
          </span>
          <Badge variant={item.done ? "success" : "default"} className="ml-auto text-xs">
            {item.done ? "Done" : "Todo"}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function SessionVisual() {
  return (
    <div className="space-y-3">
      {[
        { day: "Mon", hours: 1.5 },
        { day: "Tue", hours: 2.5 },
        { day: "Wed", hours: 1 },
        { day: "Thu", hours: 3 },
        { day: "Fri", hours: 2 },
        { day: "Sat", hours: 0.5 },
        { day: "Sun", hours: 1.5 },
      ].map((item) => (
        <div key={item.day} className="flex items-center gap-3">
          <span className="w-8 text-xs font-medium text-slate-500">{item.day}</span>
          <div className="flex-1 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
              style={{ width: `${(item.hours / 3) * 100}%` }}
            />
          </div>
          <span className="w-10 text-right text-xs font-medium text-slate-600">{item.hours}h</span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsVisual() {
  return (
    <div className="flex items-end gap-2">
      {[40, 70, 50, 90, 65, 80, 55].map((height, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-1.5">
          <div
            className="w-full rounded-full bg-gradient-to-t from-indigo-600 to-cyan-400 transition-all"
            style={{ height: `${height * 0.6}px` }}
          />
          <span className="text-[10px] text-slate-400">
            {["M", "T", "W", "T", "F", "S", "S"][index]}
          </span>
        </div>
      ))}
    </div>
  );
}

function AiVisual() {
  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-violet-200 bg-violet-50/80 p-3">
        <p className="text-xs font-medium text-violet-700">AI Suggestion</p>
        <p className="mt-1 text-xs text-violet-600">
          &ldquo;Create a Next.js fullstack study plan with 8 tasks over 14 days&rdquo;
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-600">
          AI
        </span>
        <span className="text-xs text-slate-600">8 tasks generated</span>
      </div>
    </div>
  );
}

const featureVisuals: Record<string, React.ReactNode> = {
  "study-plans": <StudyPlanVisual />,
  tasks: <TaskVisual />,
  calendar: <SessionVisual />,
  analytics: <AnalyticsVisual />,
  "ai-generator": <AiVisual />,
};

export function FeatureBentoSection() {
  return (
    <LandingSection id="features">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-200/60 bg-indigo-50/80 px-4 py-1.5 text-xs font-medium text-indigo-700">
            Features
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Everything you need to stay consistent
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500">
            Manage your learning plan, task, deadline, and session history from one focused
            workspace.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {landingFeatures.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.08}>
            <FeatureBentoCard
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              visual={featureVisuals[feature.feature] ?? null}
              accent={feature.accent}
              className={
                feature.feature === "study-plans"
                  ? "sm:col-span-2 sm:row-span-2"
                  : feature.feature === "ai-generator"
                    ? "sm:col-span-1 sm:row-span-2"
                    : feature.feature === "analytics"
                      ? "sm:col-span-2"
                      : ""
              }
            />
          </Reveal>
        ))}
      </div>
    </LandingSection>
  );
}
