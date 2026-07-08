"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createStudyPlanAction } from "@/actions/study-plans";
import type { StudyPlanInput } from "@/features/study-plans/schemas/study-plan-schema";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";

export function useCreateStudyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StudyPlanInput) => createStudyPlanAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: studyPlansQueryKey,
        });
      }
    },
  });
}
