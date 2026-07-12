import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

type EntityMetaItem = {
  icon?: LucideIcon;
  label: string;
};

type EntityMetaProps = {
  items: EntityMetaItem[];
  className?: string;
};

export function EntityMeta({ items, className }: EntityMetaProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1", className)}>
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <span key={index} className="inline-flex items-center gap-1.5 text-sm text-slate-500">
            {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
            <span className="truncate">{item.label}</span>
          </span>
        );
      })}
    </div>
  );
}
