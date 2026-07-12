"use client";

import { useState } from "react";

import { AiStudyPlanEmptyState } from "@/features/ai-study-plan/components/ai-study-plan-empty-state";
import { AiStudyPlanForm } from "@/features/ai-study-plan/components/ai-study-plan-form";
import { AiStudyPlanPreview } from "@/features/ai-study-plan/components/ai-study-plan-preview";
import { PageHeader } from "@/components/common/page-header";
import type { AiGeneratedStudyPlan } from "@/types/ai-study-plan";

export default function AiStudyPlanPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<AiGeneratedStudyPlan | null>(null);

  const hasResult = generatedPlan && selectedSubjectId;

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="AI Study Plan Generator"
        description="Generate draft study plans and tasks using AI."
      />

      {hasResult ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
            1
          </span>
          <span className="font-medium text-slate-950">Input</span>
          <span className="text-slate-300">→</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
            2
          </span>
          <span className="font-medium text-slate-950">Generate</span>
          <span className="text-slate-300">→</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
            3
          </span>
          <span className="font-medium text-slate-950">Review</span>
          <span className="text-slate-300">→</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
            4
          </span>
          <span className="text-slate-500">Save</span>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] xl:items-start">
        <div className="xl:sticky xl:top-24">
          <AiStudyPlanForm
            onGenerated={(subjectId, plan) => {
              setSelectedSubjectId(subjectId);
              setGeneratedPlan(plan);
            }}
          />
        </div>

        <div className="min-w-0">
          {hasResult ? (
            <AiStudyPlanPreview subjectId={selectedSubjectId} generatedPlan={generatedPlan} />
          ) : (
            <AiStudyPlanEmptyState />
          )}
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">Powered by NVIDIA AI</p>
    </div>
  );
}
