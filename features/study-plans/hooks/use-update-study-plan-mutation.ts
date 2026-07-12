"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateStudyPlanAction } from "@/actions/study-plans";
import type { UpdateStudyPlanInput } from "@/features/study-plans/schemas/study-plan-schema";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";
import { toastMessages } from "@/lib/toast-messages";

export function useUpdateStudyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStudyPlanInput) => updateStudyPlanAction(input),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.studyPlan.updateError);
        return;
      }

      toast.success(toastMessages.studyPlan.updateSuccess);

      await queryClient.invalidateQueries({
        queryKey: studyPlansQueryKey,
      });
    },
    onError: () => {
      toast.error(toastMessages.common.unexpectedError);
    },
  });
}
