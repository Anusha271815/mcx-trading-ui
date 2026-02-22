"use client";

import { useState } from "react";
import MetricsGrid from "@/components/analytics/MetrixGrid";
import HealthScore from "@/components/analytics/healthScore";
import SessionStatus from "@/components/analytics/SessionStatus";
import { BarChart2, Heart } from "lucide-react";

const NAV_ITEMS = [
  { id: "metrics", label: "Metrics", icon: BarChart2 },
  { id: "health",  label: "Health",  icon: Heart },
  { id: "sessions", label: "Sessions", icon: Heart },
];

export default function AnalyticsPage() {
  const [active, setActive] = useState("metrics");

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex flex-col">

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

          {active === "metrics" && <MetricsGrid />}
          {active === "health"  && <HealthScore />}
          {active === "sessions" && <SessionStatus />}

        </div>
      </div>

      {/* Fixed Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div
          className="absolute inset-0 backdrop-blur-xl"
          style={{
            background: "linear-gradient(to top, var(--bg-card) 85%, transparent 100%)",
            borderTop: "1px solid var(--border-default)",
          }}
        />
        <ul className="relative flex items-center justify-around max-w-2xl mx-auto px-2 py-2">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <li key={id} className="flex-1">
                <button
                  onClick={() => setActive(id)}
                  className="w-full flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all duration-200"
                  aria-label={label}
                >
                  <span
                    className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
                    style={
                      isActive
                        ? {
                            background: "var(--primary, #3b82f6)",
                            boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                          }
                        : {}
                    }
                  >
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-xl animate-ping opacity-20"
                        style={{ background: "var(--primary, #3b82f6)" }}
                      />
                    )}
                    <Icon
                      className="w-5 h-5 transition-all duration-200"
                      style={{ color: isActive ? "#fff" : "var(--text-muted)" }}
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />
                  </span>
                  <span
                    className="text-[10px] font-semibold tracking-wide transition-all duration-200"
                    style={{
                      color: isActive ? "var(--primary, #3b82f6)" : "var(--text-muted)",
                    }}
                  >
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}


// import SessionGauge from "@/components/confidence/SessionGauge";
// import MarketCard from "@/components/market/marketCard";
// import AlertsPanel from "@/components/alerts/AlertPanel";
// import PriceChart from "@/components/charts/PriceChart";
// import VolumeChart from "@/components/charts/VolumeChart";

// export default function MarketOverviewPage() {
//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div>
//         <h1 className="text-2xl font-semibold">Market Overview</h1>
//         <p className="text-sm text-gray-400">
//           Live session confidence & global instruments
//         </p>
//       </div>

//       {/* TOP GRID */}
//       <div className="grid grid-cols-12 gap-6">
//         {/* LEFT */}
//         <div className="col-span-4 space-y-4">
//           <SessionGauge />
//           <AlertsPanel />
//         </div>

//         {/* RIGHT */}
//         {/* <div className="col-span-8 grid grid-cols-2 auto-rows-min gap-4">
//           <MarketCard title="MCX Gold" price="59,450" change="+0.65%" bullish />
//           <MarketCard title="MCX Silver" price="74,710" change="-1.09%" />
//           <MarketCard title="USD/INR" price="91.57" change="+0.22%" bullish />
//           <MarketCard title="COMEX Gold" price="1,989" change="+0.88%" bullish />
//           <MarketCard title="MCX Gold" price="59,450" change="+0.65%" bullish />
//           <MarketCard title="MCX Silver" price="74,710" change="-1.09%" />
//           <MarketCard title="USD/INR" price="91.57" change="+0.22%" bullish />
//           <MarketCard title="COMEX Gold" price="1,989" change="+0.88%" bullish />
//         </div>
//       </div> */}

//       {/* CHARTS */}
//       <div className="grid grid-cols-2 gap-6">
//         <PriceChart />
//         <VolumeChart />
//       </div>
//     </div>
//   );
// }
