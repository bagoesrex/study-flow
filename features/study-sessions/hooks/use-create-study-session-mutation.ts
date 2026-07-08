"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createStudySessionAction } from "@/actions/study-sessions";
import type { StudySessionInput } from "@/features/study-sessions/schemas/study-session-schema";
import { studySessionsQueryKey } from "@/features/study-sessions/hooks/use-study-sessions-query";

export function useCreateStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StudySessionInput) => createStudySessionAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: studySessionsQueryKey,
        });
      }
    },
  });
}
