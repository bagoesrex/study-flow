import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "mx-auto text-center sm:flex-col"
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
        {eyebrow ? (
          <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-indigo-600 uppercase">
            {eyebrow}
          </p>
        ) : null}

        <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>

        {description ? (
          <p className="mt-4 text-base leading-8 text-slate-600">{description}</p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
