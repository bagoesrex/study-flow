import { LoadingSpinner } from "@/components/common/loading-spinner";

type PageLoadingStateProps = {
  title?: string;
  description?: string;
};

export function PageLoadingState({
  title = "Loading",
  description = "Please wait while we prepare your data.",
}: PageLoadingStateProps) {
  return (
    <div
      role="status"
      className="flex min-h-[320px] flex-col items-center justify-center text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-600">
        <LoadingSpinner className="h-6 w-6" />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
