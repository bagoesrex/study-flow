"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { marketingNavItems } from "@/constants/navigation";

export function SiteMobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Open menu"
          aria-expanded={open}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/50 opacity-100 backdrop-blur-sm transition-opacity duration-200" />

        <Dialog.Content className="fixed top-0 right-0 z-50 flex h-dvh max-h-dvh w-[88vw] max-w-sm translate-x-0 flex-col overflow-hidden border-l border-slate-200 bg-white shadow-xl transition-transform duration-200 data-[state=closed]:translate-x-full">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
            <Dialog.Title className="text-lg font-bold tracking-tight text-slate-950">
              StudyFlow
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Navigate through the StudyFlow landing page.
            </Dialog.Description>

            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" aria-label="Close menu">
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Dialog.Close>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile navigation">
            <ul className="space-y-1">
              {marketingNavItems.map((item) => (
                <li key={item.href}>
                  <Dialog.Close asChild>
                    <Link
                      href={item.href}
                      className="flex min-h-11 items-center rounded-2xl px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                    >
                      {item.label}
                    </Link>
                  </Dialog.Close>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-slate-100 px-5 py-6">
            <div className="flex flex-col gap-3">
              <Button variant="outline" asChild className="w-full">
                <Link href="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </Button>

              <Button asChild className="w-full">
                <Link href="/register" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
