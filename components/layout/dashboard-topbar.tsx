import { LogoutButton } from "@/features/auth/components/logout-button";
import { DashboardMobileSidebar } from "@/components/layout/dashboard-mobile-sidebar";

type DashboardTopbarProps = {
  title: string;
  description?: string;
  user?: {
    name?: string | null;
    email?: string | null;
  };
};

export function DashboardTopbar({ title, description, user }: DashboardTopbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <DashboardMobileSidebar />

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">
              {description ?? "StudyFlow Dashboard"}
            </p>
            <h1 className="truncate text-xl font-semibold tracking-tight text-slate-950">
              {title}
            </h1>
          </div>
        </div>

        <div className="hidden items-center gap-4 sm:flex">
          {user ? (
            <div className="text-right">
              <p className="text-sm font-medium text-slate-950">{user.name ?? "User"}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          ) : null}

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
