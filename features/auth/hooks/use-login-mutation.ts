"use client";

import { useMutation } from "@tanstack/react-query";

import { loginAction } from "@/actions/auth";
import type { LoginInput } from "@/features/auth/schemas/auth-schema";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (input: LoginInput) => loginAction(input),
  });
}
