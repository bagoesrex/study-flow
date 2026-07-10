"use client";

import { useState } from "react";

import { AiStudyPlanEmptyState } from "@/features/ai-study-plan/components/ai-study-plan-empty-state";
import { AiStudyPlanForm } from "@/features/ai-study-plan/components/ai-study-plan-form";
import { AiStudyPlanPreview } from "@/features/ai-study-plan/components/ai-study-plan-preview";
import type { AiGeneratedStudyPlan } from "@/types/ai-study-plan";

export default function AiStudyPlanPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<AiGeneratedStudyPlan | null>(null);

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <AiStudyPlanForm
        onGenerated={(subjectId, plan) => {
          setSelectedSubjectId(subjectId);
          setGeneratedPlan(plan);
        }}
      />

      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            AI Study Plan Generator
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Generate draft study plans and tasks using NVIDIA Build models.
          </p>
        </div>

        {generatedPlan && selectedSubjectId ? (
          <AiStudyPlanPreview subjectId={selectedSubjectId} generatedPlan={generatedPlan} />
        ) : (
          <AiStudyPlanEmptyState />
        )}
      </div>
    </div>
  );
}
