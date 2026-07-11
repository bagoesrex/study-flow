import { Card } from "@/components/ui/card";

type FormSkeletonProps = {
  fields?: number;
};

export function FormSkeleton({ fields = 4 }: FormSkeletonProps) {
  return (
    <Card className="space-y-5 p-6">
      <div className="space-y-2">
        <div className="h-5 w-40 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-64 animate-pulse rounded-full bg-slate-100" />
      </div>

      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
        </div>
      ))}

      <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-100" />
    </Card>
  );
}
