"use client";

import { useEffect, useState } from "react";
import { fetchAnalyticsMetrics } from "@/src/services/analytics.service";
import { AnalyticsMetrics } from "@/src/types/analytics-matrics";
import WinLossChart from "@/components/charts/WinLossChart";
import AvgWinLossChart from "@/components/charts/AvgWinLossChart";
import PerformanceRatios from "@/components/charts/PerformanceRatios";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  Trophy,
  XCircle,
  DollarSign,
  Activity,
  RefreshCw
} from "lucide-react";

type StatProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: "green" | "red" | "blue" | "amber";
  trend?: string;
};

function Stat({ label, value, icon, highlight, trend }: StatProps) {
  const getColorClasses = () => {
    switch (highlight) {
      case "green":
        return "bg-green-500/10 border-green-500/30 text-[var(--buy)]";
      case "red":
        return "bg-red-500/10 border-red-500/30 text-[var(--sell)]";
      case "blue":
        return "bg-blue-500/10 border-blue-500/30 text-[var(--primary)]";
      case "amber":
        return "bg-amber-500/10 border-amber-500/30 text-[var(--warning)]";
      default:
        return "bg-[var(--bg-card)] border-[var(--border-default)] text-[var(--text-primary)]";
    }
  };

  return (
    <div className={`rounded-xl border p-4 hover:shadow-lg transition-all ${getColorClasses()}`}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium text-[var(--text-muted)]">{label}</p>
        {icon && <div className="opacity-70">{icon}</div>}
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      {trend && (
        <p className="text-xs text-[var(--text-muted)]">{trend}</p>
      )}
    </div>
  );
}

function MetricsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-[var(--bg-muted)]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-96 rounded-xl bg-[var(--bg-muted)]" />
        ))}
      </div>
    </div>
  );
}

export default function MetricsDashboard() {
  const [data, setData] = useState<AnalyticsMetrics | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    setError("");
    fetchAnalyticsMetrics()
      .then(setData)
      .catch(() => setError("Failed to load analytics metrics"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[var(--danger)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--danger)]">{error}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Unable to fetch analytics data
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-lg bg-[var(--danger)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return <MetricsSkeleton />;
  }

  /* ---------- Logic ---------- */
  const pnlPositive = data.total_pnl >= 0;
  const winRateGood = data.win_rate >= 0.5;
  const sharpeGood = data.sharpe_ratio >= 1;
  const profitFactorGood = data.profit_factor >= 1.5;

  const formatINR = (v: number) => `₹${Math.abs(v).toLocaleString("en-IN")}`;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Performance Analytics
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Comprehensive trading performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-[var(--bg-muted)] text-[var(--text-secondary)] font-semibold border border-[var(--border-default)]">
            All Time
          </span>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-[var(--bg-muted)] transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 text-[var(--text-secondary)] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Key Performance Indicators - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          label="Total PnL"
          value={`${pnlPositive ? '+' : ''}${formatINR(data.total_pnl)}`}
          icon={pnlPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          highlight={pnlPositive ? "green" : "red"}
          trend={pnlPositive ? "Profitable" : "In Loss"}
        />

        <Stat
          label="Win Rate"
          value={`${(data.win_rate * 100).toFixed(1)}%`}
          icon={<Target className="w-5 h-5" />}
          highlight={winRateGood ? "green" : "amber"}
          trend={`${data.winning_trades}W / ${data.losing_trades}L`}
        />

        <Stat
          label="Sharpe Ratio"
          value={data.sharpe_ratio.toFixed(2)}
          icon={<Activity className="w-5 h-5" />}
          highlight={sharpeGood ? "blue" : "amber"}
          trend={sharpeGood ? "Good risk-adj returns" : "High risk"}
        />

        <Stat
          label="Profit Factor"
          value={data.profit_factor.toFixed(2)}
          icon={<DollarSign className="w-5 h-5" />}
          highlight={profitFactorGood ? "green" : "amber"}
          trend={profitFactorGood ? "Profitable system" : "Needs improvement"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <WinLossChart wins={data.winning_trades} losses={data.losing_trades} />
        <AvgWinLossChart avgWin={data.avg_win} avgLoss={data.avg_loss} />
        <PerformanceRatios
          winRate={data.win_rate}
          sharpe={data.sharpe_ratio}
          profitFactor={data.profit_factor}
        />
      </div>

      {/* Detailed Metrics Section */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
        <div className="bg-[var(--bg-muted)] px-6 py-4 border-b border-[var(--border-default)]">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Detailed Trading Metrics
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            In-depth performance breakdown
          </p>
        </div>

        <div className="p-6">
          {/* Trade Statistics */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
              Trade Statistics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <Stat
                label="Total Trades"
                value={data.total_trades.toString()}
                icon={<Activity className="w-4 h-4" />}
              />
              <Stat
                label="Winning Trades"
                value={data.winning_trades.toString()}
                icon={<Trophy className="w-4 h-4" />}
                highlight="green"
              />
              <Stat
                label="Losing Trades"
                value={data.losing_trades.toString()}
                icon={<XCircle className="w-4 h-4" />}
                highlight="red"
              />
              <Stat
                label="Win Streak"
                value={`${data.consecutive_wins}W`}
                highlight="green"
              />
            </div>
          </div>

          {/* Win/Loss Analysis */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
              Win/Loss Analysis
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat
                label="Average Win"
                value={formatINR(data.avg_win)}
                icon={<TrendingUp className="w-4 h-4" />}
                highlight="green"
              />
              <Stat
                label="Average Loss"
                value={formatINR(data.avg_loss)}
                icon={<TrendingDown className="w-4 h-4" />}
                highlight="red"
              />
              <Stat
                label="Best Trade"
                value={formatINR(data.best_trade)}
                highlight="green"
                trend="Highest profit"
              />
              <Stat
                label="Worst Trade"
                value={formatINR(data.worst_trade)}
                highlight="red"
                trend="Largest loss"
              />
            </div>
          </div>

          {/* Risk Metrics */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
              Risk Management
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Stat
                label="Max Drawdown"
                value={formatINR(data.max_drawdown)}
                icon={<AlertTriangle className="w-4 h-4" />}
                highlight="red"
                trend="Peak to trough"
              />
              <Stat
                label="Loss Streak"
                value={`${data.consecutive_losses}L`}
                highlight="red"
                trend="Max consecutive losses"
              />
              <Stat
                label="Risk/Reward Ratio"
                value={(data.avg_win / Math.abs(data.avg_loss)).toFixed(2)}
                highlight="blue"
                trend="Avg win to avg loss"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}