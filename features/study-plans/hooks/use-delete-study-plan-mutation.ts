"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteStudyPlanAction } from "@/actions/study-plans";
import type { DeleteStudyPlanInput } from "@/features/study-plans/schemas/study-plan-schema";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";

export function useDeleteStudyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteStudyPlanInput) => deleteStudyPlanAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: studyPlansQueryKey,
        });
      }
    },
  });
}
