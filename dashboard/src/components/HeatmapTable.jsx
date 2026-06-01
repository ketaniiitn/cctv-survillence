function heatClass(count, max) {
  if (!max) return "bg-slate-900";
  const intensity = count / max;
  if (intensity > 0.75) return "bg-cyan-400/25 text-cyan-100";
  if (intensity > 0.45) return "bg-blue-400/20 text-blue-100";
  if (intensity > 0.2) return "bg-indigo-400/15 text-indigo-100";
  return "bg-slate-900 text-slate-300";
}

export default function HeatmapTable({ rows, loading, formatDuration }) {
  if (loading) {
    return <div className="h-72 animate-pulse rounded-md bg-slate-900" />;
  }

  const maxVisits = Math.max(...(rows || []).map((row) => row.visit_count), 0);

  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <thead className="bg-slate-900/90 text-xs uppercase tracking-[0.18em] text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Zone</th>
            <th className="px-4 py-3 font-semibold">Visit Count</th>
            <th className="px-4 py-3 font-semibold">Average Dwell Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {(rows || []).map((row) => (
            <tr key={row.zone_id} className="transition hover:bg-white/[0.03]">
              <td className="px-4 py-4 font-medium text-white">{row.zone_id}</td>
              <td className="px-4 py-4">
                <span className={`inline-flex min-w-20 rounded-md px-3 py-1.5 font-semibold ${heatClass(row.visit_count, maxVisits)}`}>
                  {row.visit_count.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-4 text-slate-300">{formatDuration(row.avg_dwell_time)}</td>
            </tr>
          ))}
          {!rows?.length && (
            <tr>
              <td className="px-4 py-8 text-center text-slate-500" colSpan="3">
                No heatmap activity available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
