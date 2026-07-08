"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateStudyPlanAction } from "@/actions/study-plans";
import type { UpdateStudyPlanInput } from "@/features/study-plans/schemas/study-plan-schema";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";

export function useUpdateStudyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStudyPlanInput) => updateStudyPlanAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: studyPlansQueryKey,
        });
      }
    },
  });
}
