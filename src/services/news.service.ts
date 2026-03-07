import api from "@/lib/axios";
import { NewsResponse, LatestNewsResponse } from "../types/new";
const cache: Record<string, { data: any; time: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const cachedFetch = async (key: string, fetcher: () => Promise<any>) => {
  const now = Date.now();
  if (cache[key] && now - cache[key].time < CACHE_TTL) {
    return cache[key].data;
  }
  const data = await fetcher();
  cache[key] = { data, time: now };
  return data;
};


export const fetchAllNews = async (): Promise<LatestNewsResponse> => {
  const res = await api.get("/news/latest");
  return res.data;
};

export const fetchFilteredNews = async (): Promise<NewsResponse> => {
  const res = await api.get("/news/filtered");
  return res.data;
};

export const fetchTwitterNews = async (): Promise<LatestNewsResponse> => {
  const res = await api.get("/news/twitter");
  return res.data;
};