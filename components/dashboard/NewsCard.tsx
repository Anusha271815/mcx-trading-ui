"use client";

import { useEffect, useState } from "react";
import { fetchNews } from "@/src/services/news.service";
import { NewsItem } from "@/src/types/new";
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ExternalLink, 
  Clock,
  AlertCircle,
  RefreshCw 
} from "lucide-react";

export default function NewsCard() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNewsData = () => {
    setLoading(true);
    setError("");
    fetchNews()
      .then((res) => setNews(res.articles))
      .catch(() => setError("Failed to load news"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNewsData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchNewsData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getSentimentConfig = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
      case "bullish":
        return {
          icon: TrendingUp,
          color: "var(--buy)",
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          label: "Bullish"
        };
      case "negative":
      case "bearish":
        return {
          icon: TrendingDown,
          color: "var(--sell)",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          label: "Bearish"
        };
      default:
        return {
          icon: Minus,
          color: "var(--wait)",
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          label: "Neutral"
        };
    }
  };

  // Format date with better error handling
  const formatPublishedDate = (dateString: string | number): string => {
    try {
      let date: Date;

      // Handle different date formats
      if (typeof dateString === 'number') {
        // Unix timestamp (seconds or milliseconds)
        date = new Date(dateString > 9999999999 ? dateString : dateString * 1000);
      } else if (typeof dateString === 'string') {
        // Try parsing as ISO string or other formats
        // Replace space with 'T' if format is "YYYY-MM-DD HH:MM:SS"
        const normalized = dateString.replace(' ', 'T');
        date = new Date(normalized);
      } else {
        return "Recent";
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return "Recent";
      }

      // Calculate time difference
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      // Relative time for recent news
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      // Absolute date for older news
      return date.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Date parsing error:', error, 'Input:', dateString);
      return "Recent";
    }
  };

  /* -------- LOADING STATE -------- */
  if (loading && news.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
        <div className="bg-[var(--bg-muted)] px-6 py-4 border-b border-[var(--border-default)]">
          <div className="h-6 bg-[var(--bg-card)] rounded w-48 animate-pulse" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="h-5 bg-[var(--bg-muted)] rounded w-3/4" />
              <div className="h-4 bg-[var(--bg-muted)] rounded w-full" />
              <div className="h-4 bg-[var(--bg-muted)] rounded w-5/6" />
              <div className="h-3 bg-[var(--bg-muted)] rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* -------- ERROR STATE -------- */
  if (error) {
    return (
      <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--danger)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--danger)]">
                {error}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Unable to fetch latest market news
              </p>
            </div>
          </div>
          <button
            onClick={fetchNewsData}
            className="px-4 py-2 rounded-lg bg-[var(--danger)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* -------- EMPTY STATE -------- */
  if (!news.length) {
    return (
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-8 text-center">
        <Newspaper className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-secondary)]">No news available</p>
      </div>
    );
  }

  /* -------- MAIN UI -------- */
  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
      {/* HEADER */}
      <div className="bg-[var(--bg-muted)] px-6 py-4 border-b border-[var(--border-default)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Newspaper className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Market News & Analysis
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Latest updates from commodity markets
              </p>
            </div>
          </div>

          <button
            onClick={fetchNewsData}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors disabled:opacity-50"
            title="Refresh news"
          >
            <RefreshCw className={`w-4 h-4 text-[var(--text-secondary)] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* NEWS ITEMS */}
      <div className="divide-y divide-[var(--border-default)]">
        {news.map((item, idx) => {
          const sentiment = getSentimentConfig(item.sentiment);
          const SentimentIcon = sentiment.icon;

          return (
            <article
              key={idx}
              className="p-6 hover:bg-[var(--bg-muted)] transition-colors group"
            >
              {/* Header with sentiment */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug group-hover:text-[var(--primary)] transition-colors flex-1">
                  {item.title}
                </h3>
                
                <div 
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold whitespace-nowrap ${sentiment.bg} ${sentiment.border}`}
                  style={{ color: sentiment.color }}
                >
                  <SentimentIcon className="w-3.5 h-3.5" />
                  <span>{sentiment.label}</span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">
                {item.summary}
              </p>

              {/* Footer metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  <span className="font-medium text-[var(--text-secondary)]">
                    {item.source}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{formatPublishedDate(item.published_at)}</span>
                  </div>
                </div>

                {item.url && (<a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
                  >
                    Read more
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="bg-[var(--bg-muted)] px-6 py-3 border-t border-[var(--border-default)]">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            <span>Live • Auto-refresh every 5 minutes</span>
          </div>
          <span>{news.length} article{news.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}
