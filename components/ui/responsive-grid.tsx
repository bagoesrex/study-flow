import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type ResponsiveGridProps = {
  children: ReactNode;
  className?: string;
};

export function ResponsiveGrid({ children, className }: ResponsiveGridProps) {
  return <div className={cn("grid min-w-0 gap-4 sm:grid-cols-2", className)}>{children}</div>;
}
