"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center p-6">
        <div role="alert" className="flex max-w-md flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Terjadi Kesalahan</h1>

          <p className="mt-2 text-sm text-slate-500">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
          </p>

          <Button type="button" variant="outline" className="mt-6" onClick={reset}>
            Coba Lagi
          </Button>
        </div>
      </body>
    </html>
  );
}
