"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTaskStatusAction } from "@/actions/tasks";
import type { UpdateTaskStatusInput } from "@/features/tasks/schemas/task-schema";
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks-query";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";
import { analyticsQueryKey } from "@/features/analytics/hooks/use-analytics-query";

export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTaskStatusInput) => updateTaskStatusAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
          queryClient.invalidateQueries({ queryKey: studyPlansQueryKey }),
          queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
        ]);
      }
    },
  });
}
