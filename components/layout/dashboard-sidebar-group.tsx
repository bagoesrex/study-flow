import type { LucideIcon } from "lucide-react";

import { DashboardNavItem } from "@/components/layout/dashboard-nav-item";

type DashboardSidebarGroupItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type DashboardSidebarGroupProps = {
  label: string;
  items: readonly DashboardSidebarGroupItem[];
  onItemClick?: () => void;
};

export function DashboardSidebarGroup({ label, items, onItemClick }: DashboardSidebarGroupProps) {
  return (
    <div>
      <p className="mb-1 px-3 text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
        {label}
      </p>

      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <DashboardNavItem
              key={item.href}
              label={item.label}
              href={item.href}
              icon={<Icon className="h-4 w-4 shrink-0" />}
              onClick={onItemClick}
            />
          );
        })}
      </div>
    </div>
  );
}
