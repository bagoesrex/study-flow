"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteSubjectAction } from "@/actions/subjects";
import type { DeleteSubjectInput } from "@/features/subjects/schemas/subject-schema";
import { subjectsQueryKey } from "@/features/subjects/hooks/use-subjects-query";
import { toastMessages } from "@/lib/toast-messages";

export function useDeleteSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteSubjectInput) => deleteSubjectAction(input),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.subject.deleteError);
        return;
      }

      toast.success(toastMessages.subject.deleteSuccess);

      await queryClient.invalidateQueries({
        queryKey: subjectsQueryKey,
      });
    },
    onError: () => {
      toast.error(toastMessages.common.unexpectedError);
    },
  });
}
