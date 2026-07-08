"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateStudySessionAction } from "@/actions/study-sessions";
import type { UpdateStudySessionInput } from "@/features/study-sessions/schemas/study-session-schema";
import { studySessionsQueryKey } from "@/features/study-sessions/hooks/use-study-sessions-query";
import { analyticsQueryKey } from "@/features/analytics/hooks/use-analytics-query";

export function useUpdateStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStudySessionInput) => updateStudySessionAction(input),
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
