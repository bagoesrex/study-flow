type ResultCountProps = {
  filteredCount: number;
  totalCount: number;
  label: string;
};

export function ResultCount({ filteredCount, totalCount, label }: ResultCountProps) {
  return (
    <p className="text-sm text-slate-500" aria-live="polite">
      Showing <span className="font-medium text-slate-950">{filteredCount}</span> of{" "}
      <span className="font-medium text-slate-950">{totalCount}</span> {label}
    </p>
  );
}
