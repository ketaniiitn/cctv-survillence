export default function MetricCard({ label, value, helper, accent = "cyan", loading }) {
  const accentClasses = {
    cyan: "from-cyan-400 to-blue-500 shadow-cyan-500/20",
    emerald: "from-emerald-400 to-teal-500 shadow-emerald-500/20",
    amber: "from-amber-300 to-orange-500 shadow-amber-500/20",
    rose: "from-rose-400 to-red-500 shadow-rose-500/20",
  };

  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/70 p-5 shadow-xl shadow-black/20 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          {loading ? (
            <div className="mt-4 h-9 w-28 animate-pulse rounded bg-slate-800" />
          ) : (
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
          )}
        </div>
        <div className={`h-11 w-2 rounded-full bg-gradient-to-b ${accentClasses[accent]}`} />
      </div>
      <p className="mt-4 text-sm text-slate-500">{helper}</p>
    </section>
  );
}
