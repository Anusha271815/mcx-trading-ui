export default function SignalReason() {
  return (
    <div
      className="border rounded-xl p-6 space-y-4"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-default)",
        color: "var(--text-primary)",
      }}
    >
      <h3
        className="text-sm font-semibold"
        style={{ color: "var(--text-secondary)" }}
      >
        AI Decision Rationale
      </h3>

      <ul className="space-y-3 text-sm">
        <li className="flex gap-2 items-start">
          <span style={{ color: "var(--sell)" }}>●</span>
          <span style={{ color: "var(--text-secondary)" }}>
            COMEX gold weak after market open
          </span>
        </li>

        <li className="flex gap-2 items-start">
          <span style={{ color: "var(--warning)" }}>●</span>
          <span style={{ color: "var(--text-secondary)" }}>
            Europe session in risk-off regime
          </span>
        </li>

        <li className="flex gap-2 items-start">
          <span style={{ color: "var(--sell)" }}>●</span>
          <span style={{ color: "var(--text-secondary)" }}>
            Fed bias remains hawkish
          </span>
        </li>

        <li className="flex gap-2 items-start">
          <span style={{ color: "var(--sell)" }}>●</span>
          <span style={{ color: "var(--text-secondary)" }}>
            MCX price trading below VWAP
          </span>
        </li>
      </ul>

      <div
        className="border-t pt-3 text-xs"
        style={{
          borderColor: "var(--border-default)",
          color: "var(--text-muted)",
        }}
      >
        Decision validated for current time window only
      </div>
    </div>
  );
}

  