"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { dashboardNavigationGroups } from "@/constants/navigation";
import { DashboardSidebarGroup } from "@/components/layout/dashboard-sidebar-group";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/features/auth/components/logout-button";

type DashboardMobileSidebarProps = {
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

export function DashboardMobileSidebar({ user }: DashboardMobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm" aria-label="Open menu" className="lg:hidden">
          <Menu className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only sm:ml-2">Menu</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm" />

        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-sm flex-col border-r border-slate-200 bg-white shadow-2xl">
          <div className="flex shrink-0 items-center justify-between px-4 pt-6 pb-4">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white">
                S
              </div>

              <div className="min-w-0">
                <p className="truncate font-bold text-slate-950">StudyFlow</p>
                <p className="truncate text-xs text-slate-500">Learning workspace</p>
              </div>
            </Link>

            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" aria-label="Close menu">
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Dialog.Close>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4" aria-label="Mobile navigation">
            <div className="space-y-6">
              {dashboardNavigationGroups.map((group) => (
                <DashboardSidebarGroup
                  key={group.label}
                  label={group.label}
                  items={group.items}
                  onItemClick={() => setOpen(false)}
                />
              ))}
            </div>
          </nav>

          {user ? (
            <div className="shrink-0 border-t border-slate-100 px-4 py-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-950">
                    {user.name ?? "User"}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                </div>
              </div>

              <LogoutButton />
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
