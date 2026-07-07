import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { requireUser } from "@/lib/auth-guard";

type DashboardRouteLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardRouteLayout({ children }: DashboardRouteLayoutProps) {
  const user = await requireUser();

  return (
    <DashboardLayout
      user={{
        name: user.name,
        email: user.email,
      }}
    >
      {children}
    </DashboardLayout>
  );
}
