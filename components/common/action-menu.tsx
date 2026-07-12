"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical } from "lucide-react";

import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

export type ActionMenuItem = {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

type ActionMenuProps = {
  label?: string;
  items: ActionMenuItem[];
};

export function ActionMenu({ label = "Actions", items }: ActionMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
        >
          <EllipsisVertical className="h-4 w-4" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="z-50 min-w-36 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg"
        >
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <DropdownMenu.Item
                key={index}
                onSelect={item.onSelect}
                disabled={item.disabled}
                className={cn(
                  "flex cursor-default items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition outline-none",
                  item.destructive
                    ? "text-rose-600 focus:bg-rose-50"
                    : "text-slate-600 focus:bg-slate-100 focus:text-slate-950",
                  item.disabled && "pointer-events-none opacity-40"
                )}
              >
                {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
                {item.label}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
