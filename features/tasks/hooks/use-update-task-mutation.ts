"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateTaskAction } from "@/actions/tasks";
import type { UpdateTaskInput } from "@/features/tasks/schemas/task-schema";
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks-query";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";
import { analyticsQueryKey } from "@/features/analytics/hooks/use-analytics-query";
import { toastMessages } from "@/lib/toast-messages";

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTaskInput) => updateTaskAction(input),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.task.updateError);
        return;
      }

      toast.success(toastMessages.task.updateSuccess);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
        queryClient.invalidateQueries({ queryKey: studyPlansQueryKey }),
        queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
      ]);
    },
    onError: () => {
      toast.error(toastMessages.common.unexpectedError);
    },
  });
}
