"use client";

import { useEffect, useState } from "react";
import { Clock, Globe } from "lucide-react";

type MarketSession = {
  name: string;
  color: string;
  confidence: string;
};

export default function MarketClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getMarketSession = (date: Date): MarketSession => {
    const istHour = date.getHours();
    const istMinute = date.getMinutes();
    const totalMinutes = istHour * 60 + istMinute;

    // IST Market Sessions (Based on major commodity trading hours)
    // Asian Session: 6:00 AM - 2:00 PM IST (Shanghai, Singapore)
    // European Session: 1:00 PM - 9:00 PM IST (London, Zurich)
    // US Session: 6:00 PM - 2:00 AM IST (New York, Chicago - COMEX)

    if (totalMinutes >= 360 && totalMinutes < 780) {
      // 6:00 AM - 1:00 PM IST - Asian Session (High overlap)
      return {
        name: "ASIAN SESSION",
        color: "bg-blue-500",
        confidence: "High Volume"
      };
    } else if (totalMinutes >= 780 && totalMinutes < 1050) {
      // 1:00 PM - 5:30 PM IST - Asian/European Overlap
      return {
        name: "ASIA-EUROPE OVERLAP",
        color: "bg-green-500",
        confidence: "Highest Liquidity"
      };
    } else if (totalMinutes >= 1050 && totalMinutes < 1260) {
      // 5:30 PM - 9:00 PM IST - European Session
      return {
        name: "EUROPEAN SESSION",
        color: "bg-emerald-500",
        confidence: "High Confidence"
      };
    } else if (totalMinutes >= 1080 && totalMinutes < 120) {
      // 6:00 PM - 2:00 AM IST - US Session (COMEX active)
      return {
        name: "US SESSION (COMEX)",
        color: "bg-amber-500",
        confidence: "Active Trading"
      };
    } else {
      // Off-hours / Low activity
      return {
        name: "OFF-HOURS",
        color: "bg-gray-500",
        confidence: "Low Activity"
      };
    }
  };

  const session = getMarketSession(time);

  // Format time in IST
  const timeString = time.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const dateString = time.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    month: "short",
    day: "numeric"
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
          <div className="text-sm font-bold leading-tight">
            {session.name}
          </div>
          <div className="text-xs opacity-90">
            {session.confidence}
          </div>
        </div>
      </div>
    </div>
  );
}