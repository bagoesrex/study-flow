"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateStudySessionAction } from "@/actions/study-sessions";
import type { UpdateStudySessionInput } from "@/features/study-sessions/schemas/study-session-schema";
import { studySessionsQueryKey } from "@/features/study-sessions/hooks/use-study-sessions-query";

export function useUpdateStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStudySessionInput) => updateStudySessionAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: studySessionsQueryKey,
        });
      }
    },
  });
}
