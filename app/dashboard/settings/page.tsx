"use client";

import { AccountInfoCard } from "@/features/settings/components/account-info-card";
import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { useCurrentUserQuery } from "@/features/settings/hooks/use-current-user-query";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  const query = useCurrentUserQuery();

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <SettingsPageHeader />

        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <Card className="h-40 animate-pulse bg-slate-100" />
          <Card className="h-72 animate-pulse bg-slate-100" />
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="space-y-6">
        <SettingsPageHeader />

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
    <div className="space-y-6">
      <SettingsPageHeader />

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <AccountInfoCard user={user} />
        <ProfileSettingsForm user={user} />
      </div>
    </div>
  );
}
