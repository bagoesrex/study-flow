import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <Card className={cn("flex flex-col items-center justify-center p-10 text-center", className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>

      {action ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{action}</div>
      ) : null}
    </Card>
  );
}
