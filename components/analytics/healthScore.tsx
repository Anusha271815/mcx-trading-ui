"use client";

import { useEffect, useState } from "react";
import { fetchHealthStatus } from "@/src/services/health.service";
import { Heart, TrendingUp, Activity, ShieldAlert, Repeat2, Info, Lightbulb } from "lucide-react";

export default function HealthScore() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthStatus()
      .then(setHealth)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 animate-pulse">
          <div className="h-4 bg-[var(--bg-muted)] rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-[var(--bg-muted)] rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-[var(--bg-muted)] rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 text-[var(--text-muted)] text-sm">
        Failed to load health status.
      </div>
    );
  }

  const scoreColor =
    health.score >= 75
      ? "text-[var(--success)]"
      : health.score >= 50
      ? "text-[var(--warning)]"
      : "text-[var(--danger)]";

  const scoreBg =
    health.score >= 75
      ? "bg-green-500/10"
      : health.score >= 50
      ? "bg-amber-500/10"
      : "bg-red-500/10";

  const signalLower = health.signal?.toLowerCase();
  const signalColor =
    signalLower === "buy"
      ? "text-[var(--success)] bg-green-500/10"
      : signalLower === "sell"
      ? "text-[var(--danger)] bg-red-500/10"
      : "text-[var(--warning)] bg-amber-500/10";

  const isWinRateGood = health.recent_win_rate >= 0.5;
  const isSharpeGood = health.recent_sharpe >= 1;
  const isDrawdownOk = Math.abs(health.current_drawdown) <= 10;
  const isConsecLossOk = health.consecutive_losses <= 3;

  const metrics = [
    {
      label: "Win Rate",
      value: `${(health.recent_win_rate * 100).toFixed(1)}%`,
      icon: <TrendingUp className="w-4 h-4" />,
      good: isWinRateGood,
      progress: health.recent_win_rate * 100,
      showProgress: true,
    },
    {
      label: "Sharpe Ratio",
      value: health.recent_sharpe.toFixed(2),
      icon: <Activity className="w-4 h-4" />,
      good: isSharpeGood,
      showProgress: false,
    },
    {
      label: "Drawdown",
      value: `${health.current_drawdown.toFixed(2)}%`,
      icon: <ShieldAlert className="w-4 h-4" />,
      good: isDrawdownOk,
      showProgress: false,
    },
    {
      label: "Consec. Losses",
      value: health.consecutive_losses,
      icon: <Repeat2 className="w-4 h-4" />,
      good: isConsecLossOk,
      showProgress: false,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Card — Score + Signal */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Score */}
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${scoreBg}`}>
              <Heart className={`w-6 h-6 ${scoreColor}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Strategy Health Score
              </p>
              <p className={`text-4xl font-bold leading-tight ${scoreColor}`}>
                {health.score}
                <span className="text-lg font-medium text-[var(--text-muted)] ml-1">/ 100</span>
              </p>
            </div>
          </div>

          {/* Signal Badge */}
          <div className="flex flex-col items-start sm:items-end gap-1">
            <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide">
              Signal
            </p>
            <span
              className={`text-sm font-semibold px-4 py-1.5 rounded-full ${signalColor}`}
            >
              {health.signal}
            </span>
          </div>
        </div>

        {/* Score progress bar */}
        <div className="mt-5">
          <div className="w-full bg-[var(--bg-muted)] rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                health.score >= 75
                  ? "bg-[var(--success)]"
                  : health.score >= 50
                  ? "bg-[var(--warning)]"
                  : "bg-[var(--danger)]"
              }`}
              style={{ width: `${health.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="group rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`p-2 rounded-lg ${
                  m.good ? "bg-green-500/10" : "bg-amber-500/10"
                }`}
              >
                <span className={m.good ? "text-[var(--success)]" : "text-[var(--warning)]"}>
                  {m.icon}
                </span>
              </div>
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                {m.label}
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${
                m.good ? "text-[var(--success)]" : "text-[var(--warning)]"
              }`}
            >
              {m.value}
            </p>
            {m.showProgress && typeof m.progress === "number" && (
              <div className="mt-3">
                <div className="w-full bg-[var(--bg-muted)] rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      m.good ? "bg-[var(--success)]" : "bg-[var(--warning)]"
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Description & Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Info className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">Description</span>
          </div>
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">
            {health.description}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Lightbulb className="w-4 h-4 text-[var(--success)]" />
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">Recommendation</span>
          </div>
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">
            {health.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}