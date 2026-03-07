export interface NewsItem {
  title: string;
  summary: string;
  source: string;
  sentiment: "positive" | "neutral" | "negative";
  published_at: string;
  link?: string;
  tags?: string[];
}

export interface NewsResponse {
  symbol: string;
  articles: NewsItem[];
  fetched_at: string;
}

export interface LatestNewsItem {
  source: string;
  title: string;
  summary: string;
  link: string;
  published_at: string; // ✅ renamed from `published` to match usage
  fetched_at: string;
}

export interface LatestNewsResponse {
  articles: LatestNewsItem[];
}