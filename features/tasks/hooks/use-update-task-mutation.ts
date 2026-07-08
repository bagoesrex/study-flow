"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTaskAction } from "@/actions/tasks";
import type { UpdateTaskInput } from "@/features/tasks/schemas/task-schema";
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks-query";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTaskInput) => updateTaskAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
          queryClient.invalidateQueries({ queryKey: studyPlansQueryKey }),
        ]);
      }
    },
  });
}
