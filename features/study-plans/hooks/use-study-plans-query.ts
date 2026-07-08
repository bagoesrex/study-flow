"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudyPlansAction } from "@/actions/study-plans";

export const studyPlansQueryKey = ["study-plans"];

export function useStudyPlansQuery() {
  return useQuery({
    queryKey: studyPlansQueryKey,
    queryFn: async () => {
      const result = await getStudyPlansAction();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data ?? [];
    },
  });
}
