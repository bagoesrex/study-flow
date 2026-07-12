import { dashboardNavigationGroups } from "@/constants/navigation";
import { DashboardSidebarGroup } from "@/components/layout/dashboard-sidebar-group";
import { LogoutButton } from "@/features/auth/components/logout-button";

type DashboardSidebarProps = {
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

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white">
          S
        </div>

        <div className="min-w-0">
          <p className="truncate font-bold text-slate-950">StudyFlow</p>
          <p className="truncate text-xs text-slate-500">Learning workspace</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4" aria-label="Sidebar navigation">
        <div className="space-y-6">
          {dashboardNavigationGroups.map((group) => (
            <DashboardSidebarGroup key={group.label} label={group.label} items={group.items} />
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
              <p className="truncate text-sm font-medium text-slate-950">{user.name ?? "User"}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          <LogoutButton />
        </div>
      ) : null}
    </aside>
  );
}
