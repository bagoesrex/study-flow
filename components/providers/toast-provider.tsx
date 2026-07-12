"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      closeButton
      richColors
      visibleToasts={4}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-xl",
          title: "font-semibold",
          description: "text-slate-500",
          actionButton: "rounded-xl bg-slate-950 px-3 py-2 text-white",
          cancelButton: "rounded-xl bg-slate-100 px-3 py-2 text-slate-700",
        },
      }}
    />
  );
}
