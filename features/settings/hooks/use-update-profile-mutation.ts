"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProfileAction } from "@/actions/settings";
import type { UpdateProfileInput } from "@/features/settings/schemas/settings-schema";
import { currentUserQueryKey } from "@/features/settings/hooks/use-current-user-query";
import { toastMessages } from "@/lib/toast-messages";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfileAction(input),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.settings.updateError);
        return;
      }

      toast.success(toastMessages.settings.updateSuccess);

      await queryClient.invalidateQueries({
        queryKey: currentUserQueryKey,
      });
    },
    onError: () => {
      toast.error(toastMessages.common.unexpectedError);
    },
  });
}
