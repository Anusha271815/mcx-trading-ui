import VerdictCard from "@/components/dashboard/VerdictCard";
import MarketDataGrid from "../components/market/marketDataGrid";
import NewsCard from "@/components/dashboard/NewsCard";
import MetricsSummary from "@/components/analytics/metrics";
import PriceChart from "@/components/charts/PriceChart";
import RecentTrades from "@/components/charts/recentTrade";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            MCX Trading Dashboard
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Real-time market analysis and trading signals
          </p>
        </header>

        <section>
          <MetricsSummary />
        </section>

        {/* AI Verdict */}
        <section>
          <VerdictCard />
        </section>

        {/* Gold & Silver Price Chart */}
        <section>
          <PriceChart />
        </section>

        {/* Market Prices - COMEX / Shanghai / London */}
        <section>
          <MarketDataGrid />
        </section>


        {/* Recent Trades */}
        <section>
          <RecentTrades />
        </section>

        {/* Latest News */}
        <section>
          <NewsCard />
        </section>

      </div>
    </div>
  );
}
