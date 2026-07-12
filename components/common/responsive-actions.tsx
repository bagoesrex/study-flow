import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type ResponsiveActionsProps = {
  children: ReactNode;
  className?: string;
};

export function ResponsiveActions({ children, className }: ResponsiveActionsProps) {
  return (
    <div className={cn("flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap", className)}>
      {children}
    </div>
  );
}
