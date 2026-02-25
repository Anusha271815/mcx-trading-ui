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
  