"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createStudyPlanAction } from "@/actions/study-plans";
import type { StudyPlanInput } from "@/features/study-plans/schemas/study-plan-schema";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";
import { toastMessages } from "@/lib/toast-messages";

export function useCreateStudyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StudyPlanInput) => createStudyPlanAction(input),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.studyPlan.createError);
        return;
      }

      toast.success(toastMessages.studyPlan.createSuccess);

      await queryClient.invalidateQueries({
        queryKey: studyPlansQueryKey,
      });
    },
    onError: () => {
      toast.error(toastMessages.common.unexpectedError);
    },
  });
}
