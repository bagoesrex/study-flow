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
        <Button variant="outline" size="sm" className="lg:hidden">
          <Menu className="h-4 w-4" />
          Menu
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" />

        <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] border-r border-slate-200 bg-white p-5 shadow-xl">
          <div className="mb-8 flex items-center justify-between">
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
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
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
                  onClick={() => setOpen(false)}
                />
              );
            })}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
