"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function AvgWinLossChart({
  avgWin,
  avgLoss,
}: {
  avgWin: number;
  avgLoss: number;
}) {
  const data = [
    { name: "Avg Win", value: avgWin, type: "win" },
    { name: "Avg Loss", value: Math.abs(avgLoss), type: "loss" },
  ];

  const winLossRatio = avgLoss !== 0 ? (avgWin / Math.abs(avgLoss)).toFixed(2) : "N/A";
  const isGoodRatio = typeof winLossRatio === 'string' ? false : parseFloat(winLossRatio) >= 1.5;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isWin = data.type === "win";
      
      return (
        <div className="bg-[var(--bg-card)] border-2 border-[var(--border-default)] rounded-lg p-3 shadow-xl">
          <p className="text-xs font-semibold mb-2" style={{ color: isWin ? 'var(--buy)' : 'var(--sell)' }}>
            {data.name}
          </p>
          <div className="flex items-center gap-2">
            {isWin ? (
              <TrendingUp className="w-4 h-4" style={{ color: 'var(--buy)' }} />
            ) : (
              <TrendingDown className="w-4 h-4" style={{ color: 'var(--sell)' }} />
            )}
            <span className="text-lg font-bold text-[var(--text-primary)]">
              ₹{data.value.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--bg-muted)] px-6 py-4 border-b border-[var(--border-default)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Average Win vs Loss
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Risk-reward comparison
            </p>
          </div>
          
          {/* Win/Loss Ratio Badge */}
          <div className={`px-3 py-2 rounded-lg ${isGoodRatio ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
            <p className="text-xs text-[var(--text-muted)] mb-0.5">Win/Loss Ratio</p>
            <p 
              className="text-lg font-bold"
              style={{ color: isGoodRatio ? 'var(--buy)' : 'var(--warning)' }}
            >
              {winLossRatio}x
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--border-default)" 
                opacity={0.3}
                vertical={false}
              />
              
              <XAxis
                dataKey="name"
                stroke="var(--text-primary)"
                tick={{ fill: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border-default)' }}
              />
              
              <YAxis
                stroke="var(--text-primary)"
                tick={{ fill: 'var(--text-primary)', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border-default)' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-muted)', opacity: 0.3 }} />
              
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
                maxBarSize={80}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.type === 'win' ? 'var(--buy)' : 'var(--sell)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[var(--border-default)]">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="w-5 h-5 text-[var(--buy)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Average Win</p>
              <p className="text-lg font-bold text-[var(--buy)]">
                ₹{avgWin.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
            <div className="p-2 rounded-lg bg-red-500/10">
              <TrendingDown className="w-5 h-5 text-[var(--sell)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Average Loss</p>
              <p className="text-lg font-bold text-[var(--sell)]">
                ₹{Math.abs(avgLoss).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[var(--bg-muted)] px-6 py-3 border-t border-[var(--border-default)]">
        <p className="text-xs text-[var(--text-muted)] text-center">
          {isGoodRatio 
            ? "✓ Excellent risk-reward ratio - Wins are significantly larger than losses" 
            : "⚠ Consider improving your risk-reward ratio for better profitability"}
        </p>
      </div>
    </div>
  );
}