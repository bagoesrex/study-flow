"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateStudySessionAction } from "@/actions/study-sessions";
import type { UpdateStudySessionInput } from "@/features/study-sessions/schemas/study-session-schema";
import { studySessionsQueryKey } from "@/features/study-sessions/hooks/use-study-sessions-query";
import { analyticsQueryKey } from "@/features/analytics/hooks/use-analytics-query";
import { toastMessages } from "@/lib/toast-messages";

export function useUpdateStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStudySessionInput) => updateStudySessionAction(input),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.studySession.updateError);
        return;
      }

      toast.success(toastMessages.studySession.updateSuccess);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: studySessionsQueryKey }),
        queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
      ]);
    },
    onError: () => {
      toast.error(toastMessages.common.unexpectedError);
    },
  });
}
