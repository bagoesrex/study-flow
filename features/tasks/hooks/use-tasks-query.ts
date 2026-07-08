"use client";

import { useQuery } from "@tanstack/react-query";

import { getTasksAction } from "@/actions/tasks";

export const tasksQueryKey = ["tasks"];

export function useTasksQuery() {
  return useQuery({
    queryKey: tasksQueryKey,
    queryFn: async () => {
      const result = await getTasksAction();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data ?? [];
    },
  });
}
