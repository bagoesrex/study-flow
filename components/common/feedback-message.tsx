import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import { cn } from "@/lib/cn";

type FeedbackMessageVariant = "success" | "error" | "info";

type FeedbackMessageProps = {
  variant: FeedbackMessageVariant;
  message: string;
  className?: string;
};

const variants: Record<FeedbackMessageVariant, { icon: typeof CheckCircle2; className: string }> = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  error: {
    icon: AlertCircle,
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
};

export function FeedbackMessage({ variant, message, className }: FeedbackMessageProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
        config.className,
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
