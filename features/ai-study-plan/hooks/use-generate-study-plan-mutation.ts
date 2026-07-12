"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { generateStudyPlanAction } from "@/actions/ai-study-plan";
import type { GenerateStudyPlanInput } from "@/features/ai-study-plan/schemas/ai-study-plan-schema";
import { toastMessages } from "@/lib/toast-messages";

const AI_GENERATE_TOAST_ID = "ai-study-plan-generate";

export function useGenerateStudyPlanMutation() {
  return useMutation({
    mutationFn: (input: GenerateStudyPlanInput) => generateStudyPlanAction(input),

    onMutate: () => {
      toast.loading(toastMessages.ai.generateLoading, {
        id: AI_GENERATE_TOAST_ID,
      });
    },

    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.ai.generateError, {
          id: AI_GENERATE_TOAST_ID,
        });
        return;
      }

      toast.success(toastMessages.ai.generateSuccess, {
        id: AI_GENERATE_TOAST_ID,
      });
    },

    onError: () => {
      toast.error(toastMessages.ai.generateError, {
        id: AI_GENERATE_TOAST_ID,
      });
    },
  });
}
