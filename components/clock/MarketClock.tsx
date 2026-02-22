"use client";

import { useEffect, useState } from "react";
import { Clock, Globe } from "lucide-react";

type MarketSession = {
  name: string;
  color: string;
  confidence: string;
};

export default function MarketClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getMarketSession = (date: Date): MarketSession => {
    const istHour = date.getHours();
    const istMinute = date.getMinutes();
    const totalMinutes = istHour * 60 + istMinute;

    if (totalMinutes >= 360 && totalMinutes < 780) {
      return { name: "ASIAN SESSION", color: "bg-blue-500", confidence: "High Volume" };
    } else if (totalMinutes >= 780 && totalMinutes < 1050) {
      return { name: "ASIA-EUROPE OVERLAP", color: "bg-green-500", confidence: "Highest Liquidity" };
    } else if (totalMinutes >= 1050 && totalMinutes < 1260) {
      return { name: "EUROPEAN SESSION", color: "bg-emerald-500", confidence: "High Confidence" };
    } else if (totalMinutes >= 1080 && totalMinutes < 120) {
      return { name: "US SESSION (COMEX)", color: "bg-amber-500", confidence: "Active Trading" };
    } else {
      return { name: "OFF-HOURS", color: "bg-gray-500", confidence: "Low Activity" };
    }
  };

  // Don't render anything on the server — avoids hydration mismatch
  if (!time) {
    return (
      <div className="flex items-center gap-4 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-[var(--primary)]" />
          <div>
            <div className="text-2xl font-mono font-bold text-[var(--text-primary)] tabular-nums">
              --:--:--
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              Loading... • IST
            </div>
          </div>
        </div>
      </div>
    );
  }

  const session = getMarketSession(time);

  const timeString = time.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const dateString = time.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-4 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg px-4 py-3">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-[var(--primary)]" />
        <div>
          <div className="text-2xl font-mono font-bold text-[var(--text-primary)] tabular-nums">
            {timeString}
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">
            {dateString} • IST
          </div>
        </div>
      </div>

      <div className="h-10 w-px bg-[var(--border-default)]" />

      <div className={`flex items-center gap-2 px-4 py-2 ${session.color} rounded-lg`}>
        <Globe className="w-4 h-4 text-white" />
        <div className="text-white">
          <div className="text-sm font-bold leading-tight">{session.name}</div>
          <div className="text-xs opacity-90">{session.confidence}</div>
        </div>
      </div>
    </div>
  );
}