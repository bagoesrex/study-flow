"use client";

type FilterOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: FilterOption[];
  className?: string;
};

export function FilterSelect({ value, onChange, label, options, className }: FilterSelectProps) {
  return (
    <label className={className}>
      <span className="sr-only">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
