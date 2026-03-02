import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  className?: string;
  label?: string;
};

export function Progress({ value, className, label }: ProgressProps) {
  const safe = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p> : null}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safe}
      >
        <div
          className="h-full rounded-full bg-indigo-600 transition-all dark:bg-indigo-500"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}
