export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div className="h-full bg-indigo-600 transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
