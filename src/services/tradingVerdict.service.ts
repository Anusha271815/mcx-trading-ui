import api from "@/lib/axios";
import { TradingVerdict } from "../types/trading-verdict";

export const getTradingVerdict = async (): Promise<TradingVerdict> => {
  const res = await api.get("/trading-verdict/");
  return res.data;
};
