"use client";

import { TrendingUp } from "lucide-react";
import { useState } from "react";

export default function TradingPreferences() {
  const [prefs, setPrefs] = useState({
    defaultLeverage: "5x",
    autoStopLoss: true,
    confirmTrades: true,
    riskLevel: "medium",
  });

  return (
    <div
      className="rounded-xl p-6 border"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-default)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp size={24} style={{ color: "var(--primary)" }} />
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Trading Preferences
        </h2>
      </div>

      {/* Content */}
      <div className="space-y-5">
        {/* Default Leverage */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>
              Default Leverage
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Applied automatically to new trades
            </p>
          </div>

          <select
            value={prefs.defaultLeverage}
            onChange={(e) =>
              setPrefs({ ...prefs, defaultLeverage: e.target.value })
            }
            className="px-3 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: "var(--bg-muted)",
              borderColor: "var(--border-default)",
              color: "var(--text-primary)",
            }}
          >
            <option>2x</option>
            <option>5x</option>
            <option>10x</option>
            <option>20x</option>
          </select>
        </div>

        {/* Auto Stop Loss */}
        <ToggleItem
          title="Auto Stop-Loss"
          desc="Automatically apply stop-loss to trades"
          checked={prefs.autoStopLoss}
          onChange={() =>
            setPrefs({ ...prefs, autoStopLoss: !prefs.autoStopLoss })
          }
        />

        {/* Confirm Trades */}
        <ToggleItem
          title="Trade Confirmation"
          desc="Ask confirmation before placing a trade"
          checked={prefs.confirmTrades}
          onChange={() =>
            setPrefs({ ...prefs, confirmTrades: !prefs.confirmTrades })
          }
        />

        {/* Risk Level */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>
              Risk Level
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Controls signal aggressiveness
            </p>
          </div>

          <select
            value={prefs.riskLevel}
            onChange={(e) =>
              setPrefs({ ...prefs, riskLevel: e.target.value })
            }
            className="px-3 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: "var(--bg-muted)",
              borderColor: "var(--border-default)",
              color: "var(--text-primary)",
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
}

/* ===== Toggle Component ===== */

function ToggleItem({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium" style={{ color: "var(--text-primary)" }}>
          {title}
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {desc}
        </p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 cursor-pointer accent-blue-600"
      />
    </div>
  );
}

