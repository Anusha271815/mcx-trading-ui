interface SignalCardProps {
  instrument: string;
  action: "BUY" | "SELL";
  strategy: string;
  confidence: number;
  price: string;
}

export default function SignalCard({
  instrument,
  action,
  strategy,
  confidence,
  price,
}: SignalCardProps) {
  const isBuy = action === "BUY";

  return (
    <div
      className="border rounded-xl p-6 space-y-4"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-default)",
        color: "var(--text-primary)",
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{instrument}</h2>

        <span
          className="px-3 py-1 text-sm font-medium rounded-full"
          style={{
            backgroundColor: isBuy ? "var(--buy)" : "var(--sell)",
            color: "#ffffff",
          }}
        >
          {action}
        </span>
      </div>

      {/* CORE INFO */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Strategy
          </p>
          <p className="font-medium">{strategy}</p>
        </div>

        <div>
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Last Traded Price
          </p>
          <p className="font-medium">{price}</p>
        </div>
      </div>

      {/* CONFIDENCE */}
      <div>
        <p
          className="text-xs mb-1"
          style={{ color: "var(--text-muted)" }}
        >
          AI Confidence
        </p>

        <div
          className="w-full rounded-full h-2"
          style={{ backgroundColor: "var(--bg-muted)" }}
        >
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${confidence * 100}%`,
              backgroundColor:
                confidence >= 0.7
                  ? "var(--confidence-high)"
                  : confidence >= 0.4
                  ? "var(--confidence-medium)"
                  : "var(--confidence-low)",
            }}
          />
        </div>

        <p
          className="text-sm mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {(confidence * 100).toFixed(0)}%
        </p>
      </div>

      {/* READ ONLY NOTE */}
      <p
        className="text-xs italic"
        style={{ color: "var(--text-muted)" }}
      >
        Signal is system-generated and read-only
      </p>
    </div>
  );
}

  