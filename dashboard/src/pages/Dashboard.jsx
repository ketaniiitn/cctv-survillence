import { useCallback, useEffect, useMemo, useState } from "react";

import AnomalyPanel from "../components/AnomalyPanel.jsx";
import FunnelChart from "../components/FunnelChart.jsx";
import HeatmapTable from "../components/HeatmapTable.jsx";
import MetricCard from "../components/MetricCard.jsx";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { fetchDashboardData } from "../services/api.js";

function formatDuration(milliseconds = 0) {
  const totalSeconds = Math.round(Number(milliseconds || 0) / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

function formatPercent(value = 0) {
  return `${Number(value || 0).toFixed(1)}%`;
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    metrics: null,
    funnel: null,
    heatmap: [],
    anomalies: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const loadDashboard = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    else setRefreshing(true);

    try {
      const data = await fetchDashboardData();
      setDashboard(data);
      setError("");
      setLastUpdated(new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date()));
    } catch (apiError) {
      setError(
        apiError?.response?.data?.detail ||
          apiError?.message ||
          "Unable to reach Store Intelligence API",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard(true);
    const timer = window.setInterval(() => loadDashboard(false), 10000);
    return () => window.clearInterval(timer);
  }, [loadDashboard]);

  const metrics = dashboard.metrics || {};
  const kpis = useMemo(
    () => [
      {
        label: "Unique Visitors",
        value: Number(metrics.unique_visitors || 0).toLocaleString(),
        helper: "Distinct non-staff shoppers detected",
        accent: "cyan",
      },
      {
        label: "Average Dwell Time",
        value: formatDuration(metrics.avg_dwell_time),
        helper: "Mean in-store engagement time",
        accent: "emerald",
      },
      {
        label: "Queue Depth",
        value: Number(metrics.queue_depth || 0).toLocaleString(),
        helper: "Current net billing queue load",
        accent: "amber",
      },
      {
        label: "Abandonment Rate",
        value: formatPercent(metrics.abandonment_rate),
        helper: "Queue exits before purchase completion",
        accent: "rose",
      },
    ],
    [metrics],
  );

  return (
    <div className="min-h-screen text-slate-100">
      <Navbar lastUpdated={lastUpdated} loading={loading || refreshing} error={error} />
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <section className="mb-6 rounded-lg border border-white/10 bg-slate-950/55 p-5 shadow-2xl shadow-black/20">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-medium text-cyan-300">Live retail analytics</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  Store operations overview
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  Real-time visitor movement, conversion flow, zone engagement, and anomaly monitoring from the FastAPI intelligence backend.
                </p>
              </div>
              <div className="rounded-md border border-white/10 bg-slate-900/70 px-4 py-3 text-sm">
                <p className="font-medium text-white">Auto refresh</p>
                <p className="text-slate-500">Every 10 seconds</p>
              </div>
            </div>
            {error && (
              <div className="mt-5 rounded-md border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {error}. Showing the latest successful dashboard state when available.
              </div>
            )}
          </section>

          <section id="overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((card) => (
              <MetricCard key={card.label} {...card} loading={loading} />
            ))}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div id="conversion" className="rounded-lg border border-white/10 bg-slate-950/70 p-5 shadow-xl shadow-black/20">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">Conversion Funnel</h3>
                  <p className="text-sm text-slate-500">Entry to purchase progression</p>
                </div>
              </div>
              <FunnelChart data={dashboard.funnel} loading={loading} />
            </div>

            <div id="anomalies" className="rounded-lg border border-white/10 bg-slate-950/70 p-5 shadow-xl shadow-black/20">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Active Anomalies</h3>
                <p className="text-sm text-slate-500">Operational alerts requiring attention</p>
              </div>
              <AnomalyPanel
                anomalies={dashboard.anomalies}
                loading={loading}
                formatDuration={formatDuration}
              />
            </div>
          </section>

          <section id="heatmap" className="mt-6 rounded-lg border border-white/10 bg-slate-950/70 p-5 shadow-xl shadow-black/20">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Zone Heatmap</h3>
              <p className="text-sm text-slate-500">Visit intensity and dwell behavior by store zone</p>
            </div>
            <div className="overflow-x-auto">
              <HeatmapTable
                rows={dashboard.heatmap}
                loading={loading}
                formatDuration={formatDuration}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
