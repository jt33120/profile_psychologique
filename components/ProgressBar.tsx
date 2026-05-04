export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-violet-100/70">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 transition-all duration-700 ease-in-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
