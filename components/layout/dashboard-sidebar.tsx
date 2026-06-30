import Link from "next/link";

import { dashboardNavItems } from "@/constants/navigation";

export function DashboardSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white px-4 py-6 lg:block">
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
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
