"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteStudySessionAction } from "@/actions/study-sessions";
import type { DeleteStudySessionInput } from "@/features/study-sessions/schemas/study-session-schema";
import { studySessionsQueryKey } from "@/features/study-sessions/hooks/use-study-sessions-query";

export function useDeleteStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteStudySessionInput) => deleteStudySessionAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: studySessionsQueryKey,
        });
      }
    },
  });
}
