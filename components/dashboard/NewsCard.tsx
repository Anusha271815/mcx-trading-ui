"use client";

import { useEffect, useState, useMemo } from "react";
import {
  fetchAllNews,
  fetchFilteredNews,
  fetchTwitterNews,
} from "@/src/services/news.service";

import NewsFilters, { NewsType } from "./newsFilters";
import NewsSection from "./newsSection";

import { Newspaper, RefreshCw, ChevronDown } from "lucide-react";

/* ── tiny collapsible primitive ── */
function CollapseHeader({
  label,
  count,
  open,
  onToggle,
  indent = false,
}: {
  label: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  indent?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between border-b border-[var(--border-default)] transition-colors hover:brightness-110 ${
        indent
          ? "px-8 py-1.5 bg-purple-500/5"
          : "px-6 py-3 bg-[var(--bg-muted)]"
      }`}
    >
      {indent ? (
        <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30 font-semibold">
          {label}
        </span>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
            {label}
          </span>
          <span className="text-xs text-[var(--text-muted)]">({count})</span>
        </div>
      )}

      <ChevronDown
        className="w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200"
        style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
      />
    </button>
  );
}

export default function NewsCard() {
  const [news, setNews] = useState<any[]>([]);
  const [type, setType] = useState<NewsType>("filtered");
  const [loading, setLoading] = useState(false);

  /* open/close state — keys like "source:Bloomberg" or "tag:Gold" or "date:Wed Mar 04 2026" */
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  /* default all sections open when news loads */
  const isOpen = (key: string) => openSections[key] !== false; // default true

  const fetchNewsData = async (selected: NewsType) => {
    setLoading(true);
    try {
      let data;
      if (selected === "all") data = await fetchAllNews();
      else if (selected === "twitter") data = await fetchTwitterNews();
      else data = await fetchFilteredNews();

      setNews(data?.articles || []);
      setOpenSections({}); // reset collapse state on new fetch
    } catch (err) {
      console.error("Fetch failed:", err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData(type);
  }, [type]);

  /* ---- LATEST FILTER ---- */
  const processedNews = useMemo(() => {
    if (type !== "latest") return news;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return news.filter((item) => new Date(item.published) >= yesterday);
  }, [news, type]);

  /* ---- DATE GROUPING (latest) ---- */
  const groupedByDate = useMemo(() => {
    if (type !== "latest") return null;
    return processedNews.reduce((acc: any, item: any) => {
      const d = new Date(item.published).toDateString();
      if (!acc[d]) acc[d] = [];
      acc[d].push(item);
      return acc;
    }, {});
  }, [processedNews, type]);

  /* ---- SOURCE > TAG GROUPING (filtered) ---- */
  const groupedBySourceAndTag = useMemo(() => {
    if (type !== "filtered") return null;
    return processedNews.reduce((acc: any, item: any) => {
      const source = item.source || "Unknown";
      const tags: string[] = item.tags?.length ? item.tags : ["General"];
      if (!acc[source]) acc[source] = {};
      tags.forEach((tag) => {
        if (!acc[source][tag]) acc[source][tag] = [];
        acc[source][tag].push(item);
      });
      return acc;
    }, {});
  }, [processedNews, type]);

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">

      {/* HEADER */}
      <div className="bg-[var(--bg-muted)] px-6 py-4 border-b border-[var(--border-default)] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[var(--primary)]" />
          <h2 className="text-sm font-bold">Market News</h2>
        </div>
        <div className="flex items-center gap-3">
          <NewsFilters selected={type} onChange={setType} />
          <button
            onClick={() => fetchNewsData(type)}
            className="p-2 hover:bg-[var(--bg-card)] rounded-lg"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* BODY */}
      {loading ? (
        <div className="px-6 py-10 text-center text-xs text-[var(--text-muted)]">Loading...</div>
      ) : processedNews.length === 0 ? (
        <div className="px-6 py-10 text-center text-xs text-[var(--text-muted)]">No news available.</div>

      ) : type === "filtered" && groupedBySourceAndTag ? (
        Object.entries(groupedBySourceAndTag).map(([source, tagMap]: any) => {
          const sourceKey = `source:${source}`;
          const sourceOpen = isOpen(sourceKey);
          const totalArticles = Object.values(tagMap).flat().length;

          return (
            <div key={source}>
              <CollapseHeader
                label={source}
                count={totalArticles}
                open={sourceOpen}
                onToggle={() => toggle(sourceKey)}
              />

              {sourceOpen &&
                Object.entries(tagMap).map(([tag, items]: any) => {
                  const tagKey = `tag:${source}:${tag}`;
                  const tagOpen = isOpen(tagKey);

                  return (
                    <div key={tag}>
                      <CollapseHeader
                        label={tag}
                        count={items.length}
                        open={tagOpen}
                        onToggle={() => toggle(tagKey)}
                        indent
                      />
                      {tagOpen && <NewsSection items={items} />}
                    </div>
                  );
                })}
            </div>
          );
        })

      ) : type === "latest" && groupedByDate ? (
        Object.entries(groupedByDate).map(([date, items]: any) => {
          const dateKey = `date:${date}`;
          const dateOpen = isOpen(dateKey);

          return (
            <div key={date}>
              <CollapseHeader
                label={date}
                count={items.length}
                open={dateOpen}
                onToggle={() => toggle(dateKey)}
              />
              {dateOpen && <NewsSection items={items} />}
            </div>
          );
        })

      ) : (
        <NewsSection items={processedNews} />
      )}
    </div>
  );
}