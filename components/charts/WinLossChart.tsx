"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Trophy, XCircle, Target } from "lucide-react";

export default function WinLossChart({
  wins,
  losses,
}: {
  wins: number;
  losses: number;
}) {
  const total = wins + losses;
  const winRate = total > 0 ? (wins / total) * 100 : 0;

  const data = [
    { name: "Wins", value: wins, color: "var(--buy)" },
    { name: "Losses", value: losses, color: "var(--sell)" },
  ];

  const COLORS = ["var(--buy)", "var(--sell)"];

  // Determine performance level
  const getPerformanceLevel = () => {
    if (winRate >= 60) return { label: "Excellent", color: "var(--buy)", icon: Trophy };
    if (winRate >= 50) return { label: "Good", color: "var(--primary)", icon: Target };
    return { label: "Needs Work", color: "var(--warning)", icon: XCircle };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-[var(--bg-card)] border-2 border-[var(--border-default)] rounded-lg p-3 shadow-xl">
          <p className="text-xs text-[var(--text-muted)] mb-2 font-semibold">
            {data.name}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[var(--text-secondary)]">Count:</span>
              <span className="text-lg font-bold text-[var(--text-primary)]">
                {data.value}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[var(--text-secondary)]">Percentage:</span>
              <span 
                className="text-sm font-bold"
                style={{ color: data.payload.color }}
              >
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom label
  const renderCustomLabel = (entry: any) => {
    const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0;
    return `${percentage}%`;
  };

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--bg-muted)] px-6 py-4 border-b border-[var(--border-default)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Win vs Loss Distribution
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Trade outcome breakdown
            </p>
          </div>
          
          {/* Performance Badge */}
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: `color-mix(in srgb, ${performance.color} 15%, transparent)` }}
          >
            <PerformanceIcon className="w-4 h-4" style={{ color: performance.color }} />
            <div>
              <p className="text-xs text-[var(--text-muted)]">Status</p>
              <p className="text-sm font-bold" style={{ color: performance.color }}>
                {performance.label}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="relative">
          {/* Center Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: performance.color }}>
                {winRate.toFixed(1)}%
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Win Rate</p>
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {data.map((entry, i) => (
                    <Cell 
                      key={i} 
                      fill={COLORS[i]}
                      stroke="var(--bg-card)"
                      strokeWidth={3}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[var(--border-default)]">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="p-2.5 rounded-lg bg-green-500/10">
              <Trophy className="w-6 h-6 text-[var(--buy)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-0.5">Winning Trades</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-[var(--buy)]">
                  {wins}
                </p>
                <p className="text-sm font-semibold text-[var(--buy)]">
                  ({total > 0 ? ((wins / total) * 100).toFixed(0) : 0}%)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <div className="p-2.5 rounded-lg bg-red-500/10">
              <XCircle className="w-6 h-6 text-[var(--sell)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-0.5">Losing Trades</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-[var(--sell)]">
                  {losses}
                </p>
                <p className="text-sm font-semibold text-[var(--sell)]">
                  ({total > 0 ? ((losses / total) * 100).toFixed(0) : 0}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Win/Loss Ratio */}
        <div className="mt-4 p-4 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-default)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-sm font-semibold text-[var(--text-secondary)]">
                Win/Loss Ratio
              </span>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-[var(--primary)]">
                {losses > 0 ? (wins / losses).toFixed(2) : wins > 0 ? "∞" : "0.00"}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {wins} wins : {losses} losses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Insight */}
      <div className="bg-[var(--bg-muted)] px-6 py-3 border-t border-[var(--border-default)]">
        <p className="text-xs text-[var(--text-muted)] text-center">
          {winRate >= 60 
            ? "✓ Excellent win rate - Your strategy shows strong consistency" 
            : winRate >= 50 
            ? "○ Good win rate - Maintain your edge with proper risk management"
            : winRate >= 40
            ? "⚠ Average win rate - Focus on improving entry/exit timing"
            : "⚠ Low win rate - Review your strategy and risk management"}
        </p>
      </div>
    </div>
  );
}