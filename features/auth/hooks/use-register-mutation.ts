"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { registerAction } from "@/actions/auth";
import type { RegisterInput } from "@/features/auth/schemas/auth-schema";
import { toastMessages } from "@/lib/toast-messages";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (input: RegisterInput) => registerAction(input),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.auth.registerError);
        return;
      }

      toast.success(toastMessages.auth.registerSuccess);
    },
    onError: () => {
      toast.error(toastMessages.common.unexpectedError);
    },
  });
}
