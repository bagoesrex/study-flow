"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteSubjectAction } from "@/actions/subjects";
import type { DeleteSubjectInput } from "@/features/subjects/schemas/subject-schema";
import { subjectsQueryKey } from "@/features/subjects/hooks/use-subjects-query";

export function useDeleteSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteSubjectInput) => deleteSubjectAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: subjectsQueryKey,
        });
      }
    },
  });
}
