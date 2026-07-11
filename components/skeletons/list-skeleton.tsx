import { Card } from "@/components/ui/card";

type ListSkeletonProps = {
  count?: number;
};

export function ListSkeleton({ count = 5 }: ListSkeletonProps) {
  return (
    <Card className="p-5">
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
          >
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-100" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
              <div className="h-3 w-1/3 animate-pulse rounded-full bg-slate-100" />
            </div>

            <div className="h-7 w-20 animate-pulse rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    </Card>
  );
}
