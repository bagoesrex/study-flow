"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

type DashboardNavItemProps = {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

export function DashboardNavItem({ label, href, icon, onClick }: DashboardNavItemProps) {
  const pathname = usePathname();

  const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
        isActive
          ? "bg-slate-950 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
