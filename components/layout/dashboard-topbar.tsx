import { LogoutButton } from "@/features/auth/components/logout-button";
import { DashboardMobileSidebar } from "@/components/layout/dashboard-mobile-sidebar";

type DashboardTopbarProps = {
  user?: {
    name?: string | null;
    email?: string | null;
  };
};

export function DashboardTopbar({ user }: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <DashboardMobileSidebar />
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {user ? (
            <div className="hidden min-w-0 text-right sm:block">
              <p className="truncate text-sm font-medium text-slate-950">{user.name ?? "User"}</p>
              <p className="hidden truncate text-xs text-slate-500 md:block">{user.email}</p>
            </div>
          ) : null}

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
