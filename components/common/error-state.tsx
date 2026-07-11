import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ErrorStateProps = {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  message = "Data gagal dimuat. Silakan coba lagi.",
  retryLabel = "Try Again",
  onRetry,
}: ErrorStateProps) {
  return (
    <Card role="alert" className="flex flex-col items-center justify-center p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{message}</p>

      {onRetry ? (
        <Button type="button" variant="outline" className="mt-6" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </Card>
  );
}
