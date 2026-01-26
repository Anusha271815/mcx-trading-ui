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
} from "recharts";
import { Target, TrendingUp, Award, AlertCircle } from "lucide-react";

export default function PerformanceRatios({
  winRate,
  sharpe,
  profitFactor,
}: {
  winRate: number;
  sharpe: number;
  profitFactor: number;
}) {
  // Prepare data with rating
  const getRating = (metric: string, value: number) => {
    switch (metric) {
      case "Win Rate":
        if (value >= 60) return { label: "Excellent", color: "var(--buy)" };
        if (value >= 50) return { label: "Good", color: "var(--primary)" };
        return { label: "Needs Work", color: "var(--warning)" };
      
      case "Sharpe":
        if (value >= 2) return { label: "Excellent", color: "var(--buy)" };
        if (value >= 1) return { label: "Good", color: "var(--primary)" };
        return { label: "Below Average", color: "var(--warning)" };
      
      case "Profit Factor":
        if (value >= 2) return { label: "Excellent", color: "var(--buy)" };
        if (value >= 1.5) return { label: "Good", color: "var(--primary)" };
        return { label: "Risky", color: "var(--sell)" };
      
      default:
        return { label: "N/A", color: "var(--text-muted)" };
    }
  };

  const data = [
    { 
      name: "Win Rate", 
      value: winRate * 100,
      displayValue: `${(winRate * 100).toFixed(1)}%`,
      max: 100,
      rating: getRating("Win Rate", winRate * 100)
    },
    { 
      name: "Sharpe Ratio", 
      value: sharpe,
      displayValue: sharpe.toFixed(2),
      max: 3,
      rating: getRating("Sharpe", sharpe)
    },
    { 
      name: "Profit Factor", 
      value: profitFactor,
      displayValue: profitFactor.toFixed(2),
      max: 3,
      rating: getRating("Profit Factor", profitFactor)
    },
  ];

  // Overall quality score
  const qualityScore = (
    (winRate >= 0.5 ? 1 : 0) +
    (sharpe >= 1 ? 1 : 0) +
    (profitFactor >= 1.5 ? 1 : 0)
  );

  const getQualityLabel = () => {
    if (qualityScore === 3) return { label: "Excellent Strategy", color: "var(--buy)", icon: Award };
    if (qualityScore === 2) return { label: "Good Strategy", color: "var(--primary)", icon: TrendingUp };
    if (qualityScore === 1) return { label: "Average Strategy", color: "var(--warning)", icon: Target };
    return { label: "Needs Improvement", color: "var(--sell)", icon: AlertCircle };
  };

  const quality = getQualityLabel();
  const QualityIcon = quality.icon;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-[var(--bg-card)] border-2 border-[var(--border-default)] rounded-lg p-3 shadow-xl">
          <p className="text-xs text-[var(--text-muted)] mb-2 font-semibold">
            {data.name}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[var(--text-secondary)]">Value:</span>
              <span className="text-lg font-bold text-[var(--text-primary)]">
                {data.displayValue}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[var(--text-secondary)]">Rating:</span>
              <span 
                className="text-xs font-bold"
                style={{ color: data.rating.color }}
              >
                {data.rating.label}
              </span>
            </div>
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
              Strategy Quality Metrics
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Performance indicators and ratings
            </p>
          </div>
          
          {/* Quality Score Badge */}
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: `color-mix(in srgb, ${quality.color} 15%, transparent)` }}
          >
            <QualityIcon className="w-4 h-4" style={{ color: quality.color }} />
            <div>
              <p className="text-xs text-[var(--text-muted)]">Overall</p>
              <p className="text-sm font-bold" style={{ color: quality.color }}>
                {quality.label}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--border-default)" 
                opacity={0.3}
                horizontal={false}
              />
              
              <XAxis 
                type="number"
                stroke="var(--text-primary)"
                tick={{ fill: 'var(--text-primary)', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border-default)' }}
              />
              
              <YAxis 
                type="category"
                dataKey="name"
                stroke="var(--text-primary)"
                tick={{ fill: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border-default)' }}
              />
              
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-muted)', opacity: 0.3 }} />
              
              <Bar 
                dataKey="value" 
                radius={[0, 8, 8, 0]}
                maxBarSize={40}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.rating.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[var(--border-default)]">
          {data.map((metric, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-lg border border-[var(--border-default)] hover:bg-[var(--bg-muted)] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-[var(--text-secondary)]">
                  {metric.name}
                </p>
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: metric.rating.color }}
                />
              </div>
              <p 
                className="text-2xl font-bold mb-1"
                style={{ color: metric.rating.color }}
              >
                {metric.displayValue}
              </p>
              <p 
                className="text-xs font-semibold"
                style={{ color: metric.rating.color }}
              >
                {metric.rating.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer with Insights */}
      <div className="bg-[var(--bg-muted)] px-6 py-3 border-t border-[var(--border-default)]">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-[var(--text-muted)] mb-1">Win Rate</p>
            <p className="text-[var(--text-secondary)]">
              {winRate >= 0.6 ? "✓ Strong consistency" : winRate >= 0.5 ? "○ Moderate edge" : "⚠ Needs improvement"}
            </p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Sharpe Ratio</p>
            <p className="text-[var(--text-secondary)]">
              {sharpe >= 2 ? "✓ Excellent risk-adj returns" : sharpe >= 1 ? "○ Good risk-adj returns" : "⚠ High risk"}
            </p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-1">Profit Factor</p>
            <p className="text-[var(--text-secondary)]">
              {profitFactor >= 2 ? "✓ Very profitable" : profitFactor >= 1.5 ? "○ Profitable" : "⚠ Risky profile"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}