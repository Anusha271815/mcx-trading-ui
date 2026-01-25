import SignalCard from "@/components/market/SignalCard";
import SignalReason from "@/components/alerts/SignalReason";
import SignalPriceChart from "@/components/charts/SignalPriceChart";

export default function TradingSignalsPage() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Trading Signals</h1>
        <p className="text-sm text-gray-200">
          AI-generated signals · Read-only
        </p>
      </div>

      {/* SIGNAL SUMMARY */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <SignalCard
            instrument="MCX Gold"
            action="SELL"
            strategy="Trend"
            confidence={0.82}
            price="141,220"
          />
        </div>

        <div className="col-span-4">
          <SignalReason />
        </div>
      </div>

      {/* CHART */}
      <SignalPriceChart />
    </div>
  );
}
