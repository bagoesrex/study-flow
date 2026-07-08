"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSubjectAction } from "@/actions/subjects";
import type { SubjectInput } from "@/features/subjects/schemas/subject-schema";
import { subjectsQueryKey } from "@/features/subjects/hooks/use-subjects-query";

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SubjectInput) => createSubjectAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: subjectsQueryKey,
        });
      }
    },
  });
}
