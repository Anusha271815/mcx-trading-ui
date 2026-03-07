import api from "@/lib/axios";

export interface Alert {
  type: string;
  title: string;
  tags: string[];
  timestamp: string;
}

export const fetchAlerts = async (): Promise<Alert[]> => {
  const res = await api.get("/news/alerts/");
  return res.data.alerts || [];
};