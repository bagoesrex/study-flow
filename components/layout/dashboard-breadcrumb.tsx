"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavItems } from "@/constants/navigation";

const navItemMap = dashboardNavItems.reduce<Record<string, string>>((acc, item) => {
  acc[item.href] = item.label;
  return acc;
}, {});

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  if (pathname === "/dashboard") return null;

  const label = navItemMap[pathname] ?? pathname.split("/").pop()?.replace(/-/g, " ") ?? "";

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:block">
      <ol className="flex items-center gap-2 text-sm text-slate-500">
        <li>
          <Link href="/dashboard" className="transition hover:text-slate-950">
            Dashboard
          </Link>
        </li>
        <li aria-hidden="true" className="text-slate-300">
          /
        </li>
        <li aria-current="page" className="truncate text-slate-950">
          {label}
        </li>
      </ol>
    </nav>
  );
}
