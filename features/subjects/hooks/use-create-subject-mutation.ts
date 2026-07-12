"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createSubjectAction } from "@/actions/subjects";
import type { SubjectInput } from "@/features/subjects/schemas/subject-schema";
import { subjectsQueryKey } from "@/features/subjects/hooks/use-subjects-query";
import { toastMessages } from "@/lib/toast-messages";

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SubjectInput) => createSubjectAction(input),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.subject.createError);
        return;
      }

      toast.success(toastMessages.subject.createSuccess);

      await queryClient.invalidateQueries({
        queryKey: subjectsQueryKey,
      });
    },
    onError: () => {
      toast.error(toastMessages.common.unexpectedError);
    },
  });
}
