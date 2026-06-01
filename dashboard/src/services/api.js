import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 8000,
});

const STORE_ID = "store_1";

export async function fetchDashboardData() {
  const [metrics, funnel, heatmap, anomalies] = await Promise.all([
    apiClient.get(`/stores/${STORE_ID}/metrics`),
    apiClient.get(`/stores/${STORE_ID}/funnel`),
    apiClient.get(`/stores/${STORE_ID}/heatmap`),
    apiClient.get(`/stores/${STORE_ID}/anomalies`),
  ]);

  return {
    metrics: metrics.data,
    funnel: funnel.data,
    heatmap: heatmap.data,
    anomalies: anomalies.data,
  };
}
