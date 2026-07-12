import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type DashboardContentProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardContent({ children, className }: DashboardContentProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8",
        className
      )}
    >
      {children}
    </main>
  );
}
