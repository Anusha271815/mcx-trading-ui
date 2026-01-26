"use client";

import { useEffect, useState } from "react";
import { getTradingVerdict } from "@/src/services/tradingVerdict.service";
import { TradingVerdict } from "@/src/types/trading-verdict";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  ShieldAlert, 
  Zap,
  Brain,
  ChevronDown,
  AlertCircle
} from "lucide-react";

export default function VerdictCard() {
  const [data, setData] = useState<TradingVerdict | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReasoning, setShowReasoning] = useState(false);

  useEffect(() => {
    getTradingVerdict()
      .then(setData)
      .catch(() => setError("Failed to load trading verdict"))
      .finally(() => setLoading(false));
  }, []);

  const getChangeColor = (v: number) =>
    v > 0 ? "text-green-400" : v < 0 ? "text-red-400" : "text-gray-400";
  

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[var(--bg-muted)] animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-[var(--bg-muted)] rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-[var(--bg-muted)] rounded w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="h-2 bg-[var(--bg-muted)] rounded animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[var(--danger)]" />
          <p className="text-sm text-[var(--danger)] font-medium">
            {error ?? "No data available"}
          </p>
        </div>
      </div>
    );
  }

  const getActionConfig = () => {
    switch (data.action) {
      case "BUY":
        return {
          color: "var(--buy)",
          bg: "bg-green-500/10",
          icon: TrendingUp,
          label: "BUY Signal"
        };
      case "SELL":
        return {
          color: "var(--sell)",
          bg: "bg-red-500/10",
          icon: TrendingDown,
          label: "SELL Signal"
        };
      default:
        return {
          color: "var(--wait)",
          bg: "bg-amber-500/10",
          icon: Clock,
          label: "WAIT Signal"
        };
    }
  };

  const actionConfig = getActionConfig();
  const ActionIcon = actionConfig.icon;

  const getConfidenceColor = () => {
    if (data.confidence >= 75) return "var(--confidence-high)";
    if (data.confidence >= 50) return "var(--confidence-medium)";
    return "var(--confidence-low)";
  };

  const getUrgencyBadge = () => {
    const urgency = data.recommendation.urgency.toLowerCase();
    if (urgency === "high") return "bg-red-500/20 text-red-500 border-red-500/30";
    if (urgency === "medium") return "bg-amber-500/20 text-amber-500 border-amber-500/30";
    return "bg-blue-500/20 text-blue-500 border-blue-500/30";
  };

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* HEADER SECTION */}
      <div className={`p-6 ${actionConfig.bg} border-b border-[var(--border-default)]`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-xl"
              style={{ backgroundColor: `color-mix(in srgb, ${actionConfig.color} 15%, transparent)` }}
            >
              <ActionIcon className="w-8 h-8" style={{ color: actionConfig.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  AI Trading Verdict
                </span>
              </div>
              <h3 
                className="text-2xl font-bold"
                style={{ color: actionConfig.color }}
              >
                {data.verdict}
              </h3>
            </div>
          </div>
          
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${getUrgencyBadge()}`}>
            <Zap className="w-3 h-3 inline mr-1" />
            {data.recommendation.urgency} Urgency
          </div>
        </div>
      </div>

      {/* CONFIDENCE SECTION */}
      <div className="p-6 border-b border-[var(--border-default)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            Confidence Level
          </span>
          <span className="text-lg font-bold" style={{ color: getConfidenceColor() }}>
            {data.confidence}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-[var(--bg-muted)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ 
              width: `${data.confidence}%`,
              backgroundColor: getConfidenceColor()
            }}
          />
        </div>
      </div>

      {/* RECOMMENDATION GRID */}
      <div className="p-6 border-b border-[var(--border-default)]">
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          Trading Recommendation
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-muted)]">
            <div className="p-2 rounded-lg bg-[var(--bg-card)]">
              <Target className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-0.5">Position Size</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {data.recommendation.position_size}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-muted)]">
            <div className="p-2 rounded-lg bg-[var(--bg-card)]">
              <ShieldAlert className="w-4 h-4 text-[var(--danger)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-0.5">Stop Loss</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                ₹{data.recommendation.stop_loss}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-muted)]">
            <div className="p-2 rounded-lg bg-[var(--bg-card)]">
              <TrendingUp className="w-4 h-4 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-0.5">Target Price</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                ₹{data.recommendation.target}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-muted)]">
            <div className="p-2 rounded-lg bg-[var(--bg-card)]">
              <Zap className="w-4 h-4 text-[var(--warning)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-0.5">Urgency</p>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {data.recommendation.urgency}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* META INFO */}
      <div className="px-6 py-3 bg-[var(--bg-muted)] flex items-center gap-4 text-xs text-[var(--text-secondary)]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
          Strategy: <b className="text-[var(--text-primary)]">{data.strategy}</b>
        </span>
        <span className="text-[var(--border-default)]">|</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
          Regime: <b className="text-[var(--text-primary)]">{data.regime}</b>
        </span>
      </div>

      {/* MARKET CONTEXT */}
<div className="p-6 border-b border-[var(--border-default)]">
  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
    Market Context
  </h4>

  <div className="grid grid-cols-2 gap-4">
    {/* COMEX */}
    <div className="p-3 rounded-lg bg-[var(--bg-muted)]">
      <p className="text-xs text-[var(--text-muted)] mb-1">
        COMEX Gold
      </p>
      <p className={`text-lg font-bold ${getChangeColor(data.market_context.comex_gold_change)}`}>
        {data.market_context.comex_gold_change > 0 ? "+" : ""}
        {data.market_context.comex_gold_change}%
      </p>
    </div>

    {/* SHANGHAI */}
    <div className="p-3 rounded-lg bg-[var(--bg-muted)]">
      <p className="text-xs text-[var(--text-muted)] mb-1">
        Shanghai Gold
      </p>
      <p className={`text-lg font-bold ${getChangeColor(data.market_context.shanghai_gold_change)}`}>
        {data.market_context.shanghai_gold_change > 0 ? "+" : ""}
        {data.market_context.shanghai_gold_change}%
      </p>
    </div>

    {/* INDUCED MOVE */}
    <div className="p-3 rounded-lg bg-[var(--bg-muted)]">
      <p className="text-xs text-[var(--text-muted)] mb-1">
        Induced Move Score
      </p>
      <p className="text-lg font-bold text-[var(--primary)]">
        {data.market_context.induced_move_score.toFixed(2)}
      </p>
    </div>

    {/* NEWS */}
    <div className="p-3 rounded-lg bg-[var(--bg-muted)]">
      <p className="text-xs text-[var(--text-muted)] mb-1">
        Market News
      </p>
      <p className="text-lg font-bold text-[var(--text-primary)]">
        {data.market_context.news_count} articles
      </p>
    </div>
  </div>
</div>

      {/* REASONING SECTION */}
      <div className="p-6">
        <button
          onClick={() => setShowReasoning(!showReasoning)}
          className="flex items-center justify-between w-full text-left group"
        >
          <span className="text-sm font-semibold text-[var(--primary)] group-hover:underline">
            AI Reasoning & Analysis
          </span>
          <ChevronDown 
            className={`w-4 h-4 text-[var(--primary)] transition-transform duration-200 ${
              showReasoning ? "rotate-180" : ""
            }`}
          />
        </button>
        
        {showReasoning && (
          <div className="mt-4 p-4 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-default)]">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {data.reasoning}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}