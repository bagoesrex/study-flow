import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type StatusVariant = "neutral" | "info" | "success" | "warning" | "danger";

type StatusIndicatorProps = {
  variant?: StatusVariant;
  children: ReactNode;
  showDot?: boolean;
  className?: string;
};

const dotColors: Record<StatusVariant, string> = {
  neutral: "bg-slate-400",
  info: "bg-indigo-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
};

const textColors: Record<StatusVariant, string> = {
  neutral: "text-slate-600",
  info: "text-indigo-700",
  success: "text-emerald-700",
  warning: "text-amber-700",
  danger: "text-rose-700",
};

const badgeStyles: Record<StatusVariant, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  info: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function StatusIndicator({
  variant = "neutral",
  children,
  showDot = true,
  className,
}: StatusIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        textColors[variant],
        className
      )}
    >
      {showDot ? (
        <span className={cn("h-2 w-2 rounded-full", dotColors[variant])} aria-hidden="true" />
      ) : null}
      {children}
    </span>
  );
}

export function StatusBadge({ variant = "neutral", children, className }: StatusIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        badgeStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function getStatusVariant(value: string): StatusVariant {
  const map: Record<string, StatusVariant> = {
    NOT_STARTED: "neutral",
    IN_PROGRESS: "info",
    COMPLETED: "success",
    PAUSED: "warning",
    CANCELLED: "danger",
    TODO: "neutral",
    DONE: "success",
    LOW: "neutral",
    MEDIUM: "info",
    HIGH: "warning",
    URGENT: "danger",
  };

  return map[value] ?? "neutral";
}
