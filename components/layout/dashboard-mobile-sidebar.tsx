"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { dashboardNavItems } from "@/constants/navigation";
import { DashboardNavItem } from "@/components/layout/dashboard-nav-item";
import { Button } from "@/components/ui/button";

export function DashboardMobileSidebar() {
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
            <div>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-xl font-bold tracking-tight text-slate-950"
              >
                StudyFlow
              </Link>
              <p className="mt-1 text-sm text-slate-500">Learning dashboard</p>
            </div>

            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" aria-label="Close menu">
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Dialog.Close>
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
                    onClick={() => setOpen(false)}
                  />
                );
              })}
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
