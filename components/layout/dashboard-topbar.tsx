"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import Link from "next/link";

import { DashboardBreadcrumb } from "@/components/layout/dashboard-breadcrumb";
import { DashboardMobileSidebar } from "@/components/layout/dashboard-mobile-sidebar";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

type DashboardTopbarProps = {
  user?: {
    name?: string | null;
    email?: string | null;
  };
};

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const quickCreateItems = [
  { label: "New Subject", href: "/dashboard/subjects" },
  { label: "New Study Plan", href: "/dashboard/plans" },
  { label: "New Task", href: "/dashboard/tasks" },
  { label: "Log Study Session", href: "/dashboard/sessions" },
  { label: "Generate with AI", href: "/dashboard/ai" },
];

export function DashboardTopbar({ user }: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <DashboardMobileSidebar user={user} />
          <DashboardBreadcrumb />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="primary" size="sm" className="hidden sm:inline-flex">
                <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Create
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={4}
                className="z-50 min-w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg"
              >
                {quickCreateItems.map((item) => (
                  <DropdownMenu.Item key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="flex cursor-default items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition outline-none focus:bg-slate-100 focus:text-slate-950"
                    >
                      {item.label}
                    </Link>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                aria-label="User menu"
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
                  {getInitials(user?.name)}
                </div>
                <ChevronDown
                  className="hidden h-4 w-4 text-slate-400 sm:block"
                  aria-hidden="true"
                />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={4}
                className="z-50 min-w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg"
              >
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="truncate text-sm font-medium text-slate-950">
                    {user?.name ?? "User"}
                  </p>
                  {user?.email ? (
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  ) : null}
                </div>

                <DropdownMenu.Item asChild>
                  <Link
                    href="/dashboard/settings"
                    className="flex cursor-default items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition outline-none focus:bg-slate-100 focus:text-slate-950"
                  >
                    Settings
                  </Link>
                </DropdownMenu.Item>

                <DropdownMenu.Item asChild>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex w-full cursor-default items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition outline-none focus:bg-slate-100 focus:text-slate-950"
                    >
                      Logout
                    </button>
                  </form>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="primary" size="sm" className="sm:hidden">
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={4}
                className="z-50 min-w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg"
              >
                {quickCreateItems.map((item) => (
                  <DropdownMenu.Item key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="flex cursor-default items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition outline-none focus:bg-slate-100 focus:text-slate-950"
                    >
                      {item.label}
                    </Link>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
