import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type LandingSectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function LandingSection({
  id,
  children,
  className,
  containerClassName,
}: LandingSectionProps) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-20 sm:py-24 lg:py-28", className)}>
      <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
