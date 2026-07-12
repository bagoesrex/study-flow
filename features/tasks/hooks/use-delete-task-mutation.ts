"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteTaskAction } from "@/actions/tasks";
import type { DeleteTaskInput } from "@/features/tasks/schemas/task-schema";
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks-query";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";
import { analyticsQueryKey } from "@/features/analytics/hooks/use-analytics-query";
import { toastMessages } from "@/lib/toast-messages";

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteTaskInput) => deleteTaskAction(input),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.task.deleteError);
        return;
      }

      toast.success(toastMessages.task.deleteSuccess);

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
