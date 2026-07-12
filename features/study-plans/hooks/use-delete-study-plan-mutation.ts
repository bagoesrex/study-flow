"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteStudyPlanAction } from "@/actions/study-plans";
import type { DeleteStudyPlanInput } from "@/features/study-plans/schemas/study-plan-schema";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";
import { toastMessages } from "@/lib/toast-messages";

export function useDeleteStudyPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteStudyPlanInput) => deleteStudyPlanAction(input),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.studyPlan.deleteError);
        return;
      }

      toast.success(toastMessages.studyPlan.deleteSuccess);

      await queryClient.invalidateQueries({
        queryKey: studyPlansQueryKey,
      });
    },
    onError: () => {
      toast.error(toastMessages.common.unexpectedError);
    },
  });
}
