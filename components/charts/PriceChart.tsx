"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import { getMarketData } from "@/src/services/marketData.service";
import { MarketDataResponse } from "@/src/types/market-data";

type Range = "1H" | "1D" | "1W";

type ChartPoint = {
  timestamp: number;
  time: string;
  gold?: number;
  silver?: number;
};

const STORAGE_KEY = "market-price-history";
const FIVE_MIN = 5 * 60 * 1000;
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

function toChartPoint(data: MarketDataResponse): ChartPoint {
  const ts = new Date(data.fetched_at).getTime();

  return {
    timestamp: ts,
    time: new Date(ts).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    gold: data.comex.gold?.price,
    silver: data.comex.silver?.price,
  };
}

export default function PriceChart() {
  const [range, setRange] = useState<Range>("1H");
  const [history, setHistory] = useState<ChartPoint[]>([]);

  // 🔹 Load saved history
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // 🔹 Fetch every 5 minutes
  useEffect(() => {
    const fetchAndStore = async () => {
      try {
        const data = await getMarketData();
        const point = toChartPoint(data);

        setHistory((prev) => {
          const updated = [...prev, point].filter(
            (p) => point.timestamp - p.timestamp <= ONE_WEEK
          );

          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      } catch (e) {
        console.error("Market fetch failed", e);
      }
    };

    fetchAndStore();
    const interval = setInterval(fetchAndStore, FIVE_MIN);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Filter by selected range
  const filteredData = useMemo(() => {
    const now = Date.now();
    const cutoff =
      range === "1H"
        ? now - 60 * 60 * 1000
        : range === "1D"
        ? now - 24 * 60 * 60 * 1000
        : now - ONE_WEEK;

    return history.filter((p) => p.timestamp >= cutoff);
  }, [range, history]);

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <h2 className="text-white font-semibold">
          Gold & Silver Prices (COMEX)
        </h2>

        <div className="flex gap-2">
          {(["1H", "1D", "1W"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs rounded-md ${
                range === r
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* CHART */}
      <div className="p-6 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid stroke="#374151" strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis yAxisId="gold" stroke="#fbbf24" />
            <YAxis yAxisId="silver" orientation="right" stroke="#e5e7eb" />
            <Tooltip />
            <Legend />

            <Line
              yAxisId="gold"
              dataKey="gold"
              stroke="#fbbf24"
              strokeWidth={2.5}
              dot={false}
              name="Gold"
            />

            <Line
              yAxisId="silver"
              dataKey="silver"
              stroke="#e5e7eb"
              strokeWidth={2.5}
              dot={false}
              name="Silver"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
