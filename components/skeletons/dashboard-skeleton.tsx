import { CardGridSkeleton } from "@/components/skeletons/card-grid-skeleton";
import { ListSkeleton } from "@/components/skeletons/list-skeleton";
import { StatCardSkeleton } from "@/components/skeletons/stat-card-skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-4 w-80 animate-pulse rounded-full bg-slate-100" />
      </div>

      <StatCardSkeleton />

      <CardGridSkeleton count={2} />

      <ListSkeleton />
    </div>
  );
}
