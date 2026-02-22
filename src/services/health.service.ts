import api from "@/lib/axios";
import { HealthStatus } from "../types/health";

export const fetchHealthStatus = async (): Promise<HealthStatus> => {
  const res = await api.get("/analytics/health-score/");
  return res.data;
}