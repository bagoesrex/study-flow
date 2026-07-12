"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { loginAction } from "@/actions/auth";
import type { LoginInput } from "@/features/auth/schemas/auth-schema";
import { toastMessages } from "@/lib/toast-messages";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (input: LoginInput) => loginAction(input),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message || toastMessages.auth.loginError);
      }
    },
    onError: () => {
      toast.error(toastMessages.common.unexpectedError);
    },
  });
}
