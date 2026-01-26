"use client";

import { useState } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function RiskModeToggle() {
  const [riskMode, setRiskMode] = useState<"NORMAL" | "RISK_OFF">("NORMAL");

  const isRiskOff = riskMode === "RISK_OFF";

  return (
    <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg px-4 py-3">
      {/* Label */}
      <span className="text-sm font-medium text-[var(--text-secondary)]">
        Risk Mode
      </span>

      {/* Toggle Switch */}
      <button
        onClick={() => setRiskMode(isRiskOff ? "NORMAL" : "RISK_OFF")}
        className={`relative flex items-center gap-2.5 px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
          isRiskOff
            ? "bg-red-500/10 border-[var(--sell)] hover:bg-red-500/20"
            : "bg-green-500/10 border-[var(--buy)] hover:bg-green-500/20"
        }`}
      >
        {/* Icon */}
        {isRiskOff ? (
          <ShieldAlert 
            className="w-4 h-4 transition-transform duration-300" 
            style={{ color: "var(--sell)" }}
          />
        ) : (
          <ShieldCheck 
            className="w-4 h-4 transition-transform duration-300" 
            style={{ color: "var(--buy)" }}
          />
        )}

        {/* Text */}
        <span 
          className="text-sm font-bold"
          style={{ color: isRiskOff ? "var(--sell)" : "var(--buy)" }}
        >
          {isRiskOff ? "RISK-OFF" : "NORMAL"}
        </span>

        {/* Pulse indicator for RISK-OFF */}
        {isRiskOff && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Status Description */}
      <div className="ml-2">
        <p className="text-xs text-[var(--text-muted)]">
          {isRiskOff 
            ? "Conservative trading - Reduced positions" 
            : "Standard trading conditions"}
        </p>
      </div>
    </div>
  );
}
