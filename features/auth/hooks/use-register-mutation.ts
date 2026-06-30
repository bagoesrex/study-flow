"use client";

import { useMutation } from "@tanstack/react-query";

import { registerAction } from "@/actions/auth";
import type { RegisterInput } from "@/features/auth/schemas/auth-schema";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (input: RegisterInput) => registerAction(input),
  });
}
