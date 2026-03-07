"use client";

import { ChevronDown } from "lucide-react";

export type NewsType = "all" | "filtered" | "twitter" | "latest";

interface Props {
  selected: NewsType;
  onChange: (value: NewsType) => void;
}

export default function NewsFilters({ selected, onChange }: Props) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value as NewsType)}
      className="text-xs border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-2 rounded-lg focus:outline-none"
    >
      <option value="all">All News</option>
      <option value="filtered">Filtered News</option>
      <option value="twitter">Twitter News</option>
      <option value="latest">Latest (Yesterday + Today)</option>
    </select>
  );
}