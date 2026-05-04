export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <div className="text-sm leading-6 text-slate-700">{children}</div>
    </div>
  );
}
