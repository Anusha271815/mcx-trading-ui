"use client";

import { Clock, ExternalLink } from "lucide-react";

interface Props {
  items: any[];
}

export default function NewsSection({ items }: Props) {

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "—";
    
    // RFC 2822 fix: parse directly
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
  
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="divide-y divide-[var(--border-default)]">
      {items.map((item, idx) => (
        <article key={idx} className="px-6 py-5 hover:bg-[var(--bg-muted)] transition-colors">

          {/* SOURCE HIGHLIGHT */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold">
              {item.source || "Unknown"}
            </span>

            {/* TAGS HIGHLIGHT */}
            {item.tags?.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* TITLE */}
          <h3 className="text-sm font-semibold mb-2">
            {item.title}
          </h3>

          {/* SUMMARY */}
          <p className="text-xs text-[var(--text-secondary)] mb-3">
            {item.summary}
          </p>

          {/* FOOTER */}
          <div className="flex justify-between items-center text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDateTime(item.published)}</span>
            </div>

            {item.link && (
              <a
                href={item.link}
                target="_blank"
                className="flex items-center gap-1 text-[var(--primary)] hover:underline"
              >
                Read more <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}