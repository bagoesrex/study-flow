import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
};

export function SurfaceCard({ children, className, interactive }: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-sm",
        interactive && "transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
