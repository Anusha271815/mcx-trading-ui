import api from "@/lib/axios";
import { NewsResponse } from "../types/new";

export const fetchNews = async (): Promise<NewsResponse> => {
  const res = await api.get("/news/latest");
  return res.data;
};
