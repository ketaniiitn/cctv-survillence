const severityClasses = {
  WARN: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  CRITICAL: "border-rose-400/30 bg-rose-400/10 text-rose-100",
  INFO: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
};

export default function AnomalyPanel({ anomalies, loading, formatDuration }) {
  if (loading) {
    return <div className="h-72 animate-pulse rounded-md bg-slate-900" />;
  }

  if (!anomalies?.length) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-white/10 bg-slate-900/40 p-8 text-center">
        <div>
          <p className="text-lg font-semibold text-white">No Active Anomalies</p>
          <p className="mt-2 text-sm text-slate-500">Store operations are within expected thresholds.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {anomalies.map((anomaly, index) => (
        <article
          key={`${anomaly.type}-${anomaly.visitor_id}-${index}`}
          className={`rounded-lg border p-4 ${severityClasses[anomaly.severity] || severityClasses.INFO}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{anomaly.type?.replaceAll("_", " ")}</p>
              <p className="mt-1 text-xs opacity-80">Visitor {anomaly.visitor_id}</p>
            </div>
            <span className="rounded-full bg-black/20 px-2.5 py-1 text-xs font-semibold">
              {anomaly.severity || "INFO"}
            </span>
          </div>
          <p className="mt-4 text-sm opacity-90">
            Dwell time: {formatDuration(anomaly.dwell_ms)}
          </p>
          <p className="mt-2 text-sm font-medium">{anomaly.suggested_action}</p>
        </article>
      ))}
    </div>
  );
}
