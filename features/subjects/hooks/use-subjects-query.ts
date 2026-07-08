"use client";

import { useQuery } from "@tanstack/react-query";

import { getSubjectsAction } from "@/actions/subjects";

export const subjectsQueryKey = ["subjects"];

export function useSubjectsQuery() {
  return useQuery({
    queryKey: subjectsQueryKey,
    queryFn: async () => {
      const result = await getSubjectsAction();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data ?? [];
    },
  });
}
