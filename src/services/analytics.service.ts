import api from "@/lib/axios";
import { AnalyticsMetrics } from "../types/analytics-matrics";

export const fetchAnalyticsMetrics = async (): Promise<AnalyticsMetrics> => {
  const res = await api.get("/analytics/metrics/");
  return res.data;
};
