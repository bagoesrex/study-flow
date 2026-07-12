import Link from "next/link";

import { landingFooterGroups } from "@/features/landing/data/landing-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                S
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-950">StudyFlow</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              Plan what to learn, organize every task, track focused sessions, and understand your
              progress from one connected workspace.
            </p>
          </div>

          {landingFooterGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-slate-950">{group.title}</h3>

              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-slate-500 transition hover:text-slate-950"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-500 transition hover:text-slate-950"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} StudyFlow. Built for focused learners.
          </p>
        </div>
      </div>
    </footer>
  );
}
