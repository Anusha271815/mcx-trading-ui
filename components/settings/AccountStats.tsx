"use client";

import { DollarSign, TrendingUp, Activity } from "lucide-react";

interface AccountStatsProps {
  memberSince: string;
  totalTrades: number;
  winRate: number; // %
  netPnL: number; // ₹ value
  activityLevel: "Low" | "Medium" | "High";
}

export default function AccountStats({
  memberSince,
  totalTrades,
  winRate,
  netPnL,
  activityLevel,
}: AccountStatsProps) {
  const isProfit = netPnL >= 0;

  return (
    <div
      className="rounded-xl p-5 space-y-4 border"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-default)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <DollarSign size={20} style={{ color: "var(--primary)" }} />
        <h3
          className="font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Account Stats
        </h3>
      </div>

      {/* Stats */}
      <div className="space-y-3 text-sm">
        <StatRow label="Member Since" value={memberSince} />
        <StatRow label="Total Trades" value={totalTrades.toLocaleString()} />

        <StatRow
          label="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          valueColor="var(--success)"
          icon={<TrendingUp size={14} />}
        />

        <StatRow
          label="Net P&L"
          value={`${isProfit ? "+" : "-"}₹${Math.abs(netPnL).toLocaleString()}`}
          valueColor={isProfit ? "var(--success)" : "var(--danger)"}
        />

        <StatRow
          label="Activity Level"
          value={activityLevel}
          icon={<Activity size={14} />}
        />
      </div>

      {/* Footer */}
      <div
        className="text-xs pt-3 border-t"
        style={{
          color: "var(--text-muted)",
          borderColor: "var(--border-default)",
        }}
      >
        Statistics are updated daily
      </div>
    </div>
  );
}

/* =====================
   Helper
===================== */

function StatRow({
  label,
  value,
  icon,
  valueColor,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  valueColor?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>

      <span
        className="flex items-center gap-1 font-semibold"
        style={{ color: valueColor || "var(--text-primary)" }}
      >
        {icon}
        {value}
      </span>
    </div>
  );
}
