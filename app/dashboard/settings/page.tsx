"use client";

import { AccountInfoCard } from "@/features/settings/components/account-info-card";
import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { useCurrentUserQuery } from "@/features/settings/hooks/use-current-user-query";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";

export default function SettingsPage() {
  const query = useCurrentUserQuery();

  if (query.isLoading) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <PageHeader
          title="Settings"
          description="Kelola informasi akun dan profil StudyFlow kamu."
        />

        <CardGridSkeleton count={2} className="xl:grid-cols-[360px_1fr]" />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <PageHeader
          title="Settings"
          description="Kelola informasi akun dan profil StudyFlow kamu."
        />

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-950">Gagal memuat settings</h2>
          <p className="mt-2 text-sm text-slate-500">
            Silakan refresh halaman atau coba lagi nanti.
          </p>
        </Card>
      </div>
    );
  }

  const user = query.data!;

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader title="Settings" description="Kelola informasi akun dan profil StudyFlow kamu." />

      <div className="grid gap-6 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] xl:items-start">
        <AccountInfoCard user={user} />
        <div className="min-w-0">
          <ProfileSettingsForm user={user} />
        </div>
      </div>
    </div>
  );
}
