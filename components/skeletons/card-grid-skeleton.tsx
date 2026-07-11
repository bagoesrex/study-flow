import { Card } from "@/components/ui/card";

type CardGridSkeletonProps = {
  count?: number;
  className?: string;
};

export function CardGridSkeleton({
  count = 4,
  className = "md:grid-cols-2",
}: CardGridSkeletonProps) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="space-y-4 p-5">
          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-100" />
          <div className="h-6 w-3/4 animate-pulse rounded-lg bg-slate-100" />
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100" />
          </div>
          <div className="h-2 w-full animate-pulse rounded-full bg-slate-100" />
        </Card>
      ))}
    </div>
  );
}
