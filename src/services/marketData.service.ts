import api from "@/lib/axios";
import { MarketDataResponse } from "../types/market-data";

export const getMarketData = async (): Promise<MarketDataResponse> => {
  const res = await api.get("/market-data/");
  return res.data;
};
