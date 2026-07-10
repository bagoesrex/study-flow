"use client";

import { useMutation } from "@tanstack/react-query";

import { generateStudyPlanAction } from "@/actions/ai-study-plan";
import type { GenerateStudyPlanInput } from "@/features/ai-study-plan/schemas/ai-study-plan-schema";

export function useGenerateStudyPlanMutation() {
  return useMutation({
    mutationFn: (input: GenerateStudyPlanInput) => generateStudyPlanAction(input),
  });
}
