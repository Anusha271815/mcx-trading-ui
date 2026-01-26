"use client";

import { useEffect, useState } from "react";
import { getMarketData } from "@/src/services/marketData.service";
import { MarketDataResponse } from "@/src/types/market-data";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Globe2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

type MarketItem = {
  exchange: string;
  location: string;
  color: string;
  data: {
    name: string;
    price: number;
    change_pct: number;
    timestamp: string;
  };
  timezone: string;
};

export default function MarketDataGrid() {
  const [data, setData] = useState<MarketDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = () => {
    setLoading(true);
    setError(null);
    getMarketData()
      .then((res) => {
        setData(res);
        setLastUpdate(new Date());
      })
      .catch(() => setError("Failed to load market data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  /* -------- LOADING -------- */
  if (loading && !data) {
    return (
      <div className="rounded-xl border bg-[var(--bg-card)] p-6 text-sm text-[var(--text-muted)]">
        Loading market data…
      </div>
    );
  }

  /* -------- ERROR -------- */
  if (error || !data) {
    return (
      <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[var(--danger)]" />
          <span className="text-sm font-semibold text-[var(--danger)]">
            {error ?? "No market data"}
          </span>
        </div>
      </div>
    );
  }

  /* -------- PREPARE DATA -------- */
  const goldMarkets: MarketItem[] = [];
  const silverMarkets: MarketItem[] = [];

  if (data.comex.gold)
    goldMarkets.push({
      exchange: "COMEX",
      location: "New York",
      color: "var(--gold-line)",
      data: data.comex.gold,
      timezone: "EST",
    });

  if (data.shanghai.gold)
    goldMarkets.push({
      exchange: "SGE",
      location: "Shanghai",
      color: "var(--gold-line)",
      data: data.shanghai.gold,
      timezone: "CST",
    });

  if (data.london.gold)
    goldMarkets.push({
      exchange: "LBMA",
      location: "London",
      color: "var(--gold-line)",
      data: data.london.gold,
      timezone: "GMT",
    });

  if (data.comex.silver)
    silverMarkets.push({
      exchange: "COMEX",
      location: "New York",
      color: "var(--silver-line)",
      data: data.comex.silver,
      timezone: "EST",
    });

  if (data.shanghai.silver)
    silverMarkets.push({
      exchange: "SGE",
      location: "Shanghai",
      color: "var(--silver-line)",
      data: data.shanghai.silver,
      timezone: "CST",
    });

  if (data.london.silver)
    silverMarkets.push({
      exchange: "LBMA",
      location: "London",
      color: "var(--silver-line)",
      data: data.london.silver,
      timezone: "GMT",
    });

  /* -------- RENDER ROWS -------- */
  const renderRows = (markets: MarketItem[]) =>
    markets.map(({ exchange, location, color, data, timezone }, index) => {
      const isPositive = data.change_pct >= 0;
      const changeColor = isPositive ? "var(--buy)" : "var(--sell)";
      const absoluteChange = data.price * (data.change_pct / 100);

      return (
        <div
          key={`${exchange}-${data.name}-${index}`}
          className="px-6 py-5 hover:bg-[var(--bg-muted)] transition-colors"
        >
          <div className="flex items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-1 h-14 rounded-full" style={{ backgroundColor: color }} />
              <div>
                <div className="text-xs font-bold">{exchange}</div>
                <div className="text-xs text-[var(--text-muted)]">
                  {location} • {timezone}
                </div>
                <div className="text-sm font-semibold">{data.name}</div>
              </div>
            </div>

            {/* PRICE */}
            <div className="text-right px-6">
              <div className="text-2xl font-bold">
                ${data.price.toFixed(2)}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {new Date(data.timestamp).toLocaleString()}
              </div>
            </div>

            {/* CHANGE */}
            <div className="text-right min-w-[120px]">
              <div
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg font-bold text-sm"
                style={{
                  backgroundColor: `color-mix(in srgb, ${changeColor} 15%, transparent)`,
                  color: changeColor,
                }}
              >
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {isPositive ? "+" : ""}
                {data.change_pct.toFixed(2)}%
              </div>
              <div className="text-xs font-semibold mt-1" style={{ color: changeColor }}>
                {isPositive ? "+" : ""}${Math.abs(absoluteChange).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      );
    });

  /* -------- UI -------- */
  return (
    <div className="rounded-xl border bg-[var(--bg-card)] overflow-hidden ">
      {/* HEADER */}
      <div className="px-6 py-4 border-b bg-[var(--bg-muted)] flex justify-between">
        <div className="flex items-center gap-3">
          <Globe2 className="w-5 h-5" />
          <h2 className="font-bold">Global Commodity Prices</h2>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Clock size={14} />
          Updated {lastUpdate.toLocaleTimeString()}
          <button onClick={fetchData}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* GOLD COLUMN */}
  {goldMarkets.length > 0 && (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
      <div className="px-6 py-3 text-sm font-bold bg-[var(--bg-muted)]">
        🟡 Gold Markets
      </div>
      <div className="divide-y divide-[var(--border-default)]">
        {renderRows(goldMarkets)}
      </div>
    </div>
  )}

  {/* SILVER COLUMN */}
  {silverMarkets.length > 0 && (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
      <div className="px-6 py-3 text-sm font-bold bg-[var(--bg-muted)]">
        ⚪ Silver Markets
      </div>
      <div className="divide-y divide-[var(--border-default)]">
        {renderRows(silverMarkets)}
      </div>
    </div>
  )}
</div>

    </div>
  );
}
