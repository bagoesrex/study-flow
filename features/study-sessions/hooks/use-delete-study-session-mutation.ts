"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteStudySessionAction } from "@/actions/study-sessions";
import type { DeleteStudySessionInput } from "@/features/study-sessions/schemas/study-session-schema";
import { studySessionsQueryKey } from "@/features/study-sessions/hooks/use-study-sessions-query";
import { analyticsQueryKey } from "@/features/analytics/hooks/use-analytics-query";

export function useDeleteStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteStudySessionInput) => deleteStudySessionAction(input),
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
