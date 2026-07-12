"use client";

import { AccountInfoCard } from "@/features/settings/components/account-info-card";
import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { useCurrentUserQuery } from "@/features/settings/hooks/use-current-user-query";
import { SurfaceCard } from "@/components/common/surface-card";
import { PageHeader } from "@/components/common/page-header";
import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";

export default function SettingsPage() {
  const query = useCurrentUserQuery();

  if (query.isLoading) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <PageHeader
          title="Settings"
          description="Manage your StudyFlow account and profile information."
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
          description="Manage your StudyFlow account and profile information."
        />

        <SurfaceCard className="p-6">
          <h2 className="text-lg font-semibold text-slate-950">Failed to load settings</h2>
          <p className="mt-2 text-sm text-slate-500">Please refresh the page or try again later.</p>
        </SurfaceCard>
      </div>
    );
  }

  const user = query.data!;

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your StudyFlow account and profile information."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] xl:items-start">
        <AccountInfoCard user={user} />
        <div className="min-w-0">
          <ProfileSettingsForm user={user} />
        </div>
      </div>
    </div>
  );
}
