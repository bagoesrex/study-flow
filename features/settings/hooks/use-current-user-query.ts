"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUserAction } from "@/actions/settings";

export const currentUserQueryKey = ["current-user"];

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: async () => {
      const result = await getCurrentUserAction();

      if (!result.success || !result.data) {
        throw new Error(result.message);
      }

      return result.data;
    },
  });
}
