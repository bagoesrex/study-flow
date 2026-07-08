"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudySessionsAction } from "@/actions/study-sessions";

export const studySessionsQueryKey = ["study-sessions"];

export function useStudySessionsQuery() {
  return useQuery({
    queryKey: studySessionsQueryKey,
    queryFn: async () => {
      const result = await getStudySessionsAction();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data ?? [];
    },
  });
}
