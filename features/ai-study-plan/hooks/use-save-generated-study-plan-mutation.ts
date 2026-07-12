"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { saveGeneratedStudyPlanAction } from "@/actions/ai-study-plan";
import type { SaveGeneratedStudyPlanInput } from "@/features/ai-study-plan/schemas/ai-study-plan-schema";
import { analyticsQueryKey } from "@/features/analytics/hooks/use-analytics-query";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks-query";
import { toastMessages } from "@/lib/toast-messages";

const AI_SAVE_TOAST_ID = "ai-study-plan-save";

export function useSaveGeneratedStudyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveGeneratedStudyPlanInput) => saveGeneratedStudyPlanAction(input),

    onMutate: () => {
      toast.loading(toastMessages.ai.saveLoading, {
        id: AI_SAVE_TOAST_ID,
      });
    },

    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.ai.saveError, {
          id: AI_SAVE_TOAST_ID,
        });
        return;
      }

      toast.success(toastMessages.ai.saveSuccess, {
        id: AI_SAVE_TOAST_ID,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: studyPlansQueryKey }),
        queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
        queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
      ]);
    },

    onError: () => {
      toast.error(toastMessages.ai.saveError, {
        id: AI_SAVE_TOAST_ID,
      });
    },
  });
}
