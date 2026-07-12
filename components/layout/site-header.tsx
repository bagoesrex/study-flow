"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { marketingNavItems } from "@/constants/navigation";
import { SiteMobileMenu } from "@/components/layout/site-mobile-menu";
import { useActiveLandingSection } from "@/features/landing/hooks/use-active-landing-section";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const activeSection = useActiveLandingSection();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
            S
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-950">StudyFlow</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {marketingNavItems.map((item) => {
            const isActive = item.href.startsWith("#") && activeSection === item.href.slice(1);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-2xl px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link href="/login">Login</Link>
          </Button>

          <Button asChild className="hidden md:inline-flex">
            <Link href="/register">Get Started</Link>
          </Button>

          <SiteMobileMenu />
        </div>
      </div>
    </header>
  );
}
