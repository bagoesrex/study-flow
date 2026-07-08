"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProfileAction } from "@/actions/settings";
import type { UpdateProfileInput } from "@/features/settings/schemas/settings-schema";
import { currentUserQueryKey } from "@/features/settings/hooks/use-current-user-query";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfileAction(input),
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: currentUserQueryKey,
        });
      }
    },
  });
}
