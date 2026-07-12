import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type DataControlsProps = {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function DataControls({ children, footer, className }: DataControlsProps) {
  return (
    <Card className={cn("p-4 sm:p-5", className)}>
      <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap">{children}</div>

      {footer ? <div className="mt-4 border-t border-slate-100 pt-4">{footer}</div> : null}
    </Card>
  );
}
