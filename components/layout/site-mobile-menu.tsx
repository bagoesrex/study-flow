"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { marketingNavItems } from "@/constants/navigation";

export function SiteMobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        aria-label={open ? "Close menu" : "Open menu"}
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed top-0 right-0 flex h-full w-[88vw] max-w-sm flex-col border-l border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="text-lg font-bold tracking-tight text-slate-950">StudyFlow</span>

              <Button
                variant="ghost"
                size="sm"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="space-y-1">
                {marketingNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex min-h-11 items-center rounded-2xl px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-slate-100 px-5 py-6">
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
          </div>
        </div>
      ) : null}
    </>
  );
}
