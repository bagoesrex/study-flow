"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateSubjectAction, toggleArchiveSubjectAction } from "@/actions/subjects";
import type {
  DeleteSubjectInput,
  UpdateSubjectInput,
} from "@/features/subjects/schemas/subject-schema";
import { subjectsQueryKey } from "@/features/subjects/hooks/use-subjects-query";

export function useUpdateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateSubjectInput) => updateSubjectAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: subjectsQueryKey,
        });
      }
    },
  });
}

export function useToggleArchiveSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteSubjectInput) => toggleArchiveSubjectAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: subjectsQueryKey,
        });
      }
    },
  });
}
