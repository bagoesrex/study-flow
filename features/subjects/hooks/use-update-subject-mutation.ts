"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateSubjectAction, toggleArchiveSubjectAction } from "@/actions/subjects";
import type {
  DeleteSubjectInput,
  UpdateSubjectInput,
} from "@/features/subjects/schemas/subject-schema";
import { subjectsQueryKey } from "@/features/subjects/hooks/use-subjects-query";
import { toastMessages } from "@/lib/toast-messages";

export function useUpdateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateSubjectInput) => updateSubjectAction(input),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.subject.updateError);
        return;
      }

      toast.success(toastMessages.subject.updateSuccess);

      await queryClient.invalidateQueries({
        queryKey: subjectsQueryKey,
      });
    },
    onError: () => {
      toast.error(toastMessages.common.unexpectedError);
    },
  });
}

export function useToggleArchiveSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteSubjectInput) => toggleArchiveSubjectAction(input),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.subject.archiveError);
        return;
      }

      toast.success(result.message);

      await queryClient.invalidateQueries({
        queryKey: subjectsQueryKey,
      });
    },
    onError: () => {
      toast.error(toastMessages.common.unexpectedError);
    },
  });
}
