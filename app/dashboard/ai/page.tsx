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

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="AI Study Plan Generator"
        description="Generate draft study plans and tasks using NVIDIA Build models."
      />

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
          {generatedPlan && selectedSubjectId ? (
            <AiStudyPlanPreview subjectId={selectedSubjectId} generatedPlan={generatedPlan} />
          ) : (
            <AiStudyPlanEmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
