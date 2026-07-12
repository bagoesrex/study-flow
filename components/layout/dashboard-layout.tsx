import { DashboardContent } from "@/components/layout/dashboard-content";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

type DashboardLayoutProps = {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
  };
};

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <DashboardSidebar user={user} />

      <div className="min-w-0 lg:pl-72">
        <DashboardTopbar user={user} />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </div>
  );
}
