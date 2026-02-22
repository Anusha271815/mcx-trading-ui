"use client";

import { useState } from "react";
import VerdictCard from "@/components/dashboard/VerdictCard";
import MarketDataGrid from "../components/market/marketDataGrid";
import NewsCard from "@/components/dashboard/NewsCard";
import MetricsSummary from "@/components/analytics/metrics";
import PriceChart from "@/components/charts/PriceChart";
import RecentTrades from "@/components/charts/recentTrade";
import {
  LayoutDashboard,
  CandlestickChart,
  ListOrdered,
  Newspaper,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "markets",  label: "Markets",  icon: CandlestickChart },
  { id: "trades",   label: "Trades",   icon: ListOrdered },
  { id: "news",     label: "News",     icon: Newspaper },
];

export default function DashboardPage() {
  const [active, setActive] = useState("overview");

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex flex-col">

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

          {/* Header */}
          <header className="mb-2">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              MCX Trading Dashboard
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Real-time market analysis and trading signals
            </p>
          </header>

          {/* Overview = MetricsSummary + VerdictCard combined */}
          {active === "overview" && (
            <div className="space-y-6">
              <MetricsSummary />
              <VerdictCard />
            </div>
          )}

          {active === "markets" && (
            <div className="space-y-6">
              <PriceChart />
              <MarketDataGrid />
            </div>
          )}

          {active === "trades" && <RecentTrades />}

          {active === "news" && <NewsCard />}

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