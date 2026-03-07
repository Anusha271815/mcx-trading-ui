import api from "@/lib/axios";

export interface MetalData {
  name: string;
  symbol: string;
  price: number;
  change_pct: number;
  trend: number;
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: string;
}

export interface ExchangeData {
  status: string;
  gold: MetalData;
  silver: MetalData;
  fetched_at: string;
}

const cache: Record<string, { data: ExchangeData; time: number }> = {};
const CACHE_TTL = 3 * 60 * 1000;

const cachedFetch = async (key: string, fetcher: () => Promise<ExchangeData>) => {
  const now = Date.now();
  if (cache[key] && now - cache[key].time < CACHE_TTL) return cache[key].data;
  const data = await fetcher();
  cache[key] = { data, time: now };
  return data;
};

export const fetchTocom    = () => cachedFetch("tocom",    () => api.get("/tocom-data/").then(r => r.data));
export const fetchLondon   = () => cachedFetch("london",   () => api.get("/london-spot/").then(r => r.data));
export const fetchShanghai = () => cachedFetch("shanghai", () => api.get("/shanghai-futures/").then(r => r.data));