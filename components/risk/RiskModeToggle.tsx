"use client";

import { useState } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function RiskModeToggle() {
  const [riskMode, setRiskMode] = useState<"NORMAL" | "RISK_OFF">("NORMAL");

  const isRiskOff = riskMode === "RISK_OFF";

  return (
    <div className="flex items-center gap-4">
      {/* Label */}
      <span className="text-sm text-gray-400">Risk Mode</span>

      {/* Toggle Container */}
      <button
        onClick={() =>
          setRiskMode(isRiskOff ? "NORMAL" : "RISK_OFF")
        }
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition bg-white
          ${
            isRiskOff
              ? "bg-red-900/40 border-red-600 text-red-400"
              : "bg-green-900/30 border-green-600 text-green-400"
          }
        `}
      >
        {isRiskOff ? (
          <>
            <ShieldAlert size={16} />
            <span className="text-sm font-semibold">RISK-OFF</span>
          </>
        ) : (
          <>
            <ShieldCheck size={16} />
            <span className="text-sm font-semibold">NORMAL</span>
          </>
        )}
      </button>
    </div>
  );
}
