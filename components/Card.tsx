export function Card({
  title,
  children,
  accent,
}: {
  title?: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      className={[
        "animate-fade-in rounded-2xl border border-white/70 bg-white/70 p-5 shadow-xl shadow-violet-100/40 backdrop-blur-sm transition-shadow duration-300",
        accent ? `border-l-4 ${accent}` : "",
      ].join(" ")}
    >
      {title && (
        <h3 className="mb-3 text-sm font-semibold tracking-tight text-slate-700">
          {title}
        </h3>
      )}
      <div className="text-sm leading-6 text-slate-600">{children}</div>
    </div>
  );
}
