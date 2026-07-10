"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveGeneratedStudyPlanAction } from "@/actions/ai-study-plan";
import type { SaveGeneratedStudyPlanInput } from "@/features/ai-study-plan/schemas/ai-study-plan-schema";
import { analyticsQueryKey } from "@/features/analytics/hooks/use-analytics-query";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks-query";

export function useSaveGeneratedStudyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveGeneratedStudyPlanInput) => saveGeneratedStudyPlanAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: studyPlansQueryKey }),
          queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
          queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
        ]);
      }
    },
  });
}
