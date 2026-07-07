import Link from "next/link";

import { dashboardNavItems } from "@/constants/navigation";
import { DashboardNavItem } from "@/components/layout/dashboard-nav-item";

export function DashboardSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-6 lg:block">
      <div className="mb-8 px-3">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight text-slate-950">
          StudyFlow
        </Link>
        <p className="mt-1 text-sm text-slate-500">Learning dashboard</p>
      </div>

      <nav className="space-y-1">
        {dashboardNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <DashboardNavItem
              key={item.href}
              label={item.label}
              href={item.href}
              icon={<Icon className="h-4 w-4" />}
            />
          );
        })}
      </nav>
    </aside>
  );
}
