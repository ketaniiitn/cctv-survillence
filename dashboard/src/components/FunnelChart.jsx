import {
  Funnel,
  FunnelChart as RechartsFunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm shadow-xl">
      <p className="font-medium text-white">{item.name}</p>
      <p className="text-slate-400">{item.value.toLocaleString()} visitors</p>
      <p className="text-cyan-300">{item.conversion}% of entries</p>
    </div>
  );
}

export default function FunnelChart({ data, loading }) {
  if (loading) {
    return <div className="h-72 animate-pulse rounded-md bg-slate-900" />;
  }

  const entryValue = Math.max(data?.entry || 0, 1);
  const chartData = [
    { name: "Entry", value: data?.entry || 0, fill: "#22d3ee" },
    { name: "Zone Visit", value: data?.zone_visit || 0, fill: "#38bdf8" },
    { name: "Billing Queue", value: data?.billing_queue || 0, fill: "#818cf8" },
    { name: "Purchase", value: data?.purchase || 0, fill: "#34d399" },
  ].map((item) => ({
    ...item,
    conversion: Math.round((item.value / entryValue) * 100),
  }));

  return (
    <ResponsiveContainer width="100%" height={292}>
      <RechartsFunnelChart margin={{ top: 12, right: 24, bottom: 12, left: 24 }}>
        <Tooltip content={<CustomTooltip />} />
        <Funnel dataKey="value" data={chartData} isAnimationActive>
          <LabelList
            position="right"
            fill="#e2e8f0"
            stroke="none"
            dataKey={(entry) => `${entry.name}  ${entry.value.toLocaleString()}`}
          />
        </Funnel>
      </RechartsFunnelChart>
    </ResponsiveContainer>
  );
}
