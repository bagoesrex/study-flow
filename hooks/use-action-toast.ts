"use client";

import { toast } from "sonner";

import type { ActionResponse } from "@/types/action-response";

type ShowActionToastOptions = {
  successMessage?: string;
  errorMessage?: string;
};

export function useActionToast() {
  function showResult<T>(result: ActionResponse<T>, options?: ShowActionToastOptions) {
    if (result.success) {
      toast.success(options?.successMessage ?? result.message);
      return true;
    }

    toast.error(options?.errorMessage ?? result.message);
    return false;
  }

  function showUnexpectedError(message?: string) {
    toast.error(message ?? "Terjadi kesalahan. Silakan coba kembali.");
  }

  return {
    showResult,
    showUnexpectedError,
  };
}
