"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTaskAction } from "@/actions/tasks";
import type { TaskInput } from "@/features/tasks/schemas/task-schema";
import { tasksQueryKey } from "@/features/tasks/hooks/use-tasks-query";
import { studyPlansQueryKey } from "@/features/study-plans/hooks/use-study-plans-query";

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TaskInput) => createTaskAction(input),
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
