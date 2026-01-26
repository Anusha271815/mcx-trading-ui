"use client";

import { useEffect, useState } from "react";
import { fetchAnalyticsMetrics } from "@/src/services/analytics.service";
import { TrendingUp, TrendingDown, Target, Activity } from "lucide-react";

export default function MetricsSummary() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsMetrics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 animate-pulse"
          >
            <div className="h-4 bg-[var(--bg-muted)] rounded w-1/3 mb-3"></div>
            <div className="h-8 bg-[var(--bg-muted)] rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const isPnlPositive = data.total_pnl >= 0;
  const isWinRateGood = data.win_rate >= 0.5;
  const isSharpeGood = data.sharpe_ratio >= 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total PnL */}
      <div className="group rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                isPnlPositive ? "bg-green-500/10" : "bg-red-500/10"
              }`}
            >
              {isPnlPositive ? (
                <TrendingUp className="w-5 h-5 text-[var(--success)]" />
              ) : (
                <TrendingDown className="w-5 h-5 text-[var(--danger)]" />
              )}
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Total PnL
            </span>
          </div>
        </div>
        <p
          className={`text-3xl font-bold ${
            isPnlPositive ? "text-[var(--success)]" : "text-[var(--danger)]"
          }`}
        >
          ₹{Math.abs(data.total_pnl).toLocaleString("en-IN")}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          {isPnlPositive ? "Profit" : "Loss"} • All Time
        </p>
      </div>

      {/* Win Rate */}
      <div className="group rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                isWinRateGood ? "bg-blue-500/10" : "bg-amber-500/10"
              }`}
            >
              <Target
                className={`w-5 h-5 ${
                  isWinRateGood
                    ? "text-[var(--primary)]"
                    : "text-[var(--warning)]"
                }`}
              />
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Win Rate
            </span>
          </div>
        </div>
        <p
          className={`text-3xl font-bold ${
            isWinRateGood
              ? "text-[var(--primary)]"
              : "text-[var(--warning)]"
          }`}
        >
          {(data.win_rate * 100).toFixed(1)}%
        </p>
        <div className="mt-3">
          <div className="w-full bg-[var(--bg-muted)] rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isWinRateGood ? "bg-[var(--primary)]" : "bg-[var(--warning)]"
              }`}
              style={{ width: `${data.win_rate * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Sharpe Ratio */}
      <div className="group rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                isSharpeGood ? "bg-emerald-500/10" : "bg-amber-500/10"
              }`}
            >
              <Activity
                className={`w-5 h-5 ${
                  isSharpeGood
                    ? "text-[var(--success)]"
                    : "text-[var(--warning)]"
                }`}
              />
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Sharpe Ratio
            </span>
          </div>
        </div>
        <p
          className={`text-3xl font-bold ${
            isSharpeGood ? "text-[var(--success)]" : "text-[var(--warning)]"
          }`}
        >
          {data.sharpe_ratio.toFixed(2)}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          {isSharpeGood ? "Excellent" : "Needs Improvement"} • Risk-Adjusted
        </p>
      </div>

      
    </div>
  );
}