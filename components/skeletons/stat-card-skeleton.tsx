import { Card } from "@/components/ui/card";

type StatCardSkeletonProps = {
  count?: number;
};

export function StatCardSkeleton({ count = 4 }: StatCardSkeletonProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="space-y-4 p-5">
          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-100" />
          <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-3 w-32 animate-pulse rounded-full bg-slate-100" />
        </Card>
      ))}
    </div>
  );
}
