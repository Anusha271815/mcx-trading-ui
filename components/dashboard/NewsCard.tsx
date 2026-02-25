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
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function NewsCard() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [collapsedSources, setCollapsedSources] = useState<Set<string>>(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

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
    const interval = setInterval(fetchNewsData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Group news: { [source]: { [tag]: NewsItem[] } }
  const grouped = news.reduce<Record<string, Record<string, NewsItem[]>>>((acc, item) => {
    const source = item.source || "Unknown";
    const tags: string[] = item.tags?.length ? item.tags : ["General"];

    if (!acc[source]) acc[source] = {};

    // Add item under each of its tags (deduplicated by using first tag as primary)
    const primaryTag = tags[0];
    if (!acc[source][primaryTag]) acc[source][primaryTag] = [];
    acc[source][primaryTag].push(item);

    return acc;
  }, {});

  const toggleSource = (source: string) => {
    setCollapsedSources((prev) => {
      const next = new Set(prev);
      next.has(source) ? next.delete(source) : next.add(source);
      return next;
    });
  };

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const getSentimentConfig = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
      case "bullish":
        return {
          icon: TrendingUp,
          color: "var(--buy)",
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          label: "Bullish",
        };
      case "negative":
      case "bearish":
        return {
          icon: TrendingDown,
          color: "var(--sell)",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          label: "Bearish",
        };
      default:
        return {
          icon: Minus,
          color: "var(--wait)",
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          label: "Neutral",
        };
    }
  };

  const formatPublishedDate = (dateString: string | number): string => {
    try {
      let date: Date;
      if (typeof dateString === "number") {
        date = new Date(dateString > 9999999999 ? dateString : dateString * 1000);
      } else if (typeof dateString === "string") {
        date = new Date(dateString.replace(" ", "T"));
      } else {
        return "Recent";
      }
      if (isNaN(date.getTime())) return "Recent";

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Recent";
    }
  };

  /* -------- TAG BADGE COLOR -------- */
  const getTagColor = (tag: string) => {
    const map: Record<string, string> = {
      Geopolitics: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      "Currency/Central Banks": "bg-blue-500/10 text-blue-400 border-blue-500/30",
      "Metals/Industrial": "bg-orange-500/10 text-orange-400 border-orange-500/30",
      "US Economy": "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      General: "bg-gray-500/10 text-gray-400 border-gray-500/30",
    };
    return map[tag] ?? "bg-gray-500/10 text-gray-400 border-gray-500/30";
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
              <p className="text-sm font-semibold text-[var(--danger)]">{error}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Unable to fetch latest market news</p>
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
      {/* GLOBAL HEADER */}
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
            <RefreshCw
              className={`w-4 h-4 text-[var(--text-secondary)] ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* SOURCE SECTIONS */}
      <div className="divide-y divide-[var(--border-default)]">
        {Object.entries(grouped).map(([source, tagMap]) => {
          const isSourceCollapsed = collapsedSources.has(source);
          const totalCount = Object.values(tagMap).reduce((s, a) => s + a.length, 0);

          return (
            <div key={source}>
              {/* SOURCE HEADER — clickable to collapse entire source */}
              <button
                onClick={() => toggleSource(source)}
                className="w-full flex items-center justify-between px-6 py-3 bg-[var(--bg-muted)]/60 hover:bg-[var(--bg-muted)] transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isSourceCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                  )}
                  <span className="text-sm font-bold text-[var(--text-primary)]">{source}</span>
                  <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-default)] px-2 py-0.5 rounded-full">
                    {totalCount}
                  </span>
                </div>
              </button>

              {/* TAG GROUPS within source */}
              {!isSourceCollapsed && (
                <div className="divide-y divide-[var(--border-default)]">
                  {Object.entries(tagMap).map(([tag, items]) => {
                    const groupKey = `${source}::${tag}`;
                    const isGroupCollapsed = collapsedGroups.has(groupKey);

                    return (
                      <div key={tag}>
                        {/* TAG SUB-HEADER */}
                        <button
                          onClick={() => toggleGroup(groupKey)}
                          className="w-full flex items-center gap-2 px-6 py-2.5 hover:bg-[var(--bg-muted)]/40 transition-colors"
                        >
                          {isGroupCollapsed ? (
                            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                          )}
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getTagColor(tag)}`}
                          >
                            {tag}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] ml-auto">
                            {items.length} article{items.length !== 1 ? "s" : ""}
                          </span>
                        </button>

                        {/* ARTICLES */}
                        {!isGroupCollapsed && (
                          <div className="divide-y divide-[var(--border-default)]">
                            {items.map((item, idx) => {
                              const sentiment = getSentimentConfig(item.sentiment);
                              const SentimentIcon = sentiment.icon;

                              return (
                                <article
                                  key={idx}
                                  className="px-6 py-5 pl-10 hover:bg-[var(--bg-muted)] transition-colors group"
                                >
                                  {/* Title + sentiment */}
                                  <div className="flex items-start justify-between gap-4 mb-2">
                                    <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-snug group-hover:text-[var(--primary)] transition-colors flex-1">
                                      {item.title}
                                    </h3>
                                    <div
                                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold whitespace-nowrap ${sentiment.bg} ${sentiment.border}`}
                                      style={{ color: sentiment.color }}
                                    >
                                      <SentimentIcon className="w-3 h-3" />
                                      <span>{sentiment.label}</span>
                                    </div>
                                  </div>

                                  {/* Summary */}
                                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-2">
                                    {item.summary}
                                  </p>

                                  {/* Footer */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                                      <Clock className="w-3 h-3" />
                                      <span>{formatPublishedDate(item.published_at)}</span>
                                    </div>
                                    {item.link && (
                                      <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"
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
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
          <span>
            {news.length} article{news.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}