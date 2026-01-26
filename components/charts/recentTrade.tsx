"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

/* ================= TYPES ================= */

type StrategyData = {
  trades: number;
  wins: number;
  losses: number;
  win_rate: number;
  avg_win: number;
  avg_loss: number;
  total_pnl: number;
};

type StrategyStats = {
  strategy_name: string;
  win_rate: number;
  total_trades: number;
  wins: number;
  losses: number;
  avg_win: number;
  avg_loss: number;
  total_pnl: number;
  contribution: number;
};

type ViewMode = "strategies" | "performance" | "distribution";

/* ================= COMPONENT ================= */

export default function RecentTrades() {
  const [strategyStats, setStrategyStats] = useState<StrategyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("strategies");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/analytics/strategy-stats/");
      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      const strategies: StrategyStats[] = Object.entries(data.stats).map(
        ([name, stats]) => {
          const s = stats as StrategyData;
          return {
            strategy_name: name,
            win_rate: s.win_rate,
            total_trades: s.trades,
            wins: s.wins,
            losses: s.losses,
            avg_win: s.avg_win,
            avg_loss: s.avg_loss,
            total_pnl: s.total_pnl,
            contribution: data.contributions[name] ?? 0,
          };
        }
      );

      setStrategyStats(strategies);
    } catch (err) {
      setError("Failed to load trading analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, []);

  /* ================= AGGREGATES ================= */

  const totalTrades = strategyStats.reduce((a, b) => a + b.total_trades, 0);
  const totalPnL = strategyStats.reduce((a, b) => a + b.total_pnl, 0);
  const totalWins = strategyStats.reduce((a, b) => a + b.wins, 0);
  const totalLosses = strategyStats.reduce((a, b) => a + b.losses, 0);
  const winRate = totalTrades ? (totalWins / totalTrades) * 100 : 0;

  const pieData = strategyStats.map((s) => ({
    name: s.strategy_name,
    value: s.total_trades,
    total_pnl: s.total_pnl,
  }));

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  /* ================= TOOLTIP ================= */

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;

    return (
      <div className="rounded-lg border bg-[var(--bg-card)] p-3 shadow-xl">
        <p className="text-xs font-bold mb-2">{d.strategy_name || d.name}</p>
        <p className="text-xs">
          Trades: <b>{d.total_trades ?? d.value}</b>
        </p>
        {d.total_pnl !== undefined && (
          <p
            className="text-xs font-bold"
            style={{ color: d.total_pnl >= 0 ? "var(--buy)" : "var(--sell)" }}
          >
            PnL: ₹{d.total_pnl.toLocaleString("en-IN")}
          </p>
        )}
      </div>
    );
  };

  /* ================= STATES ================= */

  if (loading && !strategyStats.length) {
    return (
      <div className="p-6 rounded-xl border bg-[var(--bg-card)] animate-pulse h-48" />
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm font-semibold text-red-500">{error}</span>
        </div>
      </div>
    );
  }

  if (!strategyStats.length) {
    return (
      <div className="p-8 rounded-xl border text-center bg-[var(--bg-card)]">
        <Activity className="mx-auto w-10 h-10 text-[var(--text-muted)] mb-2" />
        <p className="text-sm text-[var(--text-muted)]">
          No strategy data available
        </p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="rounded-xl border bg-[var(--bg-card)] overflow-hidden">
      {/* HEADER */}
      <div className="px-6 py-4 border-b bg-[var(--bg-muted)]">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h2 className="font-bold">Strategy Performance</h2>
            <p className="text-xs text-[var(--text-muted)]">
              Trading strategy analytics
            </p>
          </div>

          <div className="flex gap-1 bg-[var(--bg-card)] rounded p-1">
            {(["strategies", "performance", "distribution"] as ViewMode[]).map(
              (m) => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`px-3 py-1.5 text-xs rounded font-semibold ${
                    viewMode === m
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {m}
                </button>
              )
            )}
          </div>

          <button onClick={fetchData}>
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <Stat label="Total PnL" value={`₹${totalPnL.toLocaleString("en-IN")}`} positive={totalPnL >= 0} />
          <Stat label="Win Rate" value={`${winRate.toFixed(1)}%`} />
          <Stat label="Trades" value={totalTrades.toString()} />
          <Stat label="W / L" value={`${totalWins}/${totalLosses}`} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {viewMode === "strategies" && (
          <div className="space-y-3">
            {strategyStats.map((s, i) => (
              <div key={i} className="flex justify-between border rounded-lg p-4">
                <div>
                  <p className="font-semibold">{s.strategy_name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {s.total_trades} trades • {(s.win_rate * 100).toFixed(0)}% win
                  </p>
                </div>
                <p
                  className="font-bold"
                  style={{ color: s.total_pnl >= 0 ? "var(--buy)" : "var(--sell)" }}
                >
                  ₹{Math.abs(s.total_pnl).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        )}

        {viewMode === "performance" && (
          <div className="h-[400px]">
            <ResponsiveContainer>
              <BarChart data={strategyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategy_name" />
                <YAxis tickFormatter={(v) => `₹${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total_pnl">
                  {strategyStats.map((s, i) => (
                    <Cell
                      key={i}
                      fill={s.total_pnl >= 0 ? "var(--buy)" : "var(--sell)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {viewMode === "distribution" && (
          <div className="h-[400px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={120} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= SMALL STAT CARD ================= */

function Stat({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-lg p-3 bg-[var(--bg-card)]">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p
        className="text-lg font-bold"
        style={{
          color:
            positive === undefined
              ? "var(--text-primary)"
              : positive
              ? "var(--buy)"
              : "var(--sell)",
        }}
      >
        {value}
      </p>
    </div>
  );
}
