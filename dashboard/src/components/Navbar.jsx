export default function Navbar({ lastUpdated, loading, error }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Purplle Tech Challenge 2026
          </p>
          <h1 className="text-lg font-semibold text-white sm:text-xl">Store Intelligence Dashboard</h1>
        </div>
        <div className="flex items-center gap-3 text-right">
          <span
            className={`hidden h-2.5 w-2.5 rounded-full sm:block ${
              error ? "bg-rose-400" : loading ? "bg-amber-300" : "bg-emerald-400"
            }`}
          />
          <div>
            <p className="text-sm font-medium text-slate-200">
              {error ? "API Degraded" : loading ? "Syncing" : "Live"}
            </p>
            <p className="text-xs text-slate-500">{lastUpdated || "Waiting for first refresh"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
