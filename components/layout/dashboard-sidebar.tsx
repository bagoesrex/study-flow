import Link from "next/link";

import { dashboardNavItems } from "@/constants/navigation";
import { DashboardNavItem } from "@/components/layout/dashboard-nav-item";

export function DashboardSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="shrink-0 px-4 pt-6 pb-4">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight text-slate-950">
          StudyFlow
        </Link>
        <p className="mt-1 text-sm text-slate-500">Learning dashboard</p>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-4 pb-5">
        <div className="space-y-1">
          {dashboardNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <DashboardNavItem
                key={item.href}
                label={item.label}
                href={item.href}
                icon={<Icon className="h-4 w-4 shrink-0" />}
              />
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
