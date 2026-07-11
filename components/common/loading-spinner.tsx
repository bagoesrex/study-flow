import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/cn";

type LoadingSpinnerProps = {
  className?: string;
  label?: string;
};

export function LoadingSpinner({ className, label = "Loading" }: LoadingSpinnerProps) {
  return (
    <span role="status" aria-label={label} className="inline-flex items-center justify-center">
      <LoaderCircle className={cn("h-4 w-4 animate-spin", className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
