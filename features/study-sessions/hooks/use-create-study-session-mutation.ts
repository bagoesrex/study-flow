"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createStudySessionAction } from "@/actions/study-sessions";
import type { StudySessionInput } from "@/features/study-sessions/schemas/study-session-schema";
import { studySessionsQueryKey } from "@/features/study-sessions/hooks/use-study-sessions-query";
import { analyticsQueryKey } from "@/features/analytics/hooks/use-analytics-query";

export function useCreateStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StudySessionInput) => createStudySessionAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: studySessionsQueryKey }),
          queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
        ]);
      }
    },
  });
}
