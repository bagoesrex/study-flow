"use client";

import { useQuery } from "@tanstack/react-query";

import { getAnalyticsAction } from "@/actions/analytics";

export const analyticsQueryKey = ["analytics"];

export function useAnalyticsQuery() {
  return useQuery({
    queryKey: analyticsQueryKey,
    queryFn: async () => {
      const result = await getAnalyticsAction();

      if (!result.success || !result.data) {
        throw new Error(result.message);
      }

      return result.data;
    },
  });
}
