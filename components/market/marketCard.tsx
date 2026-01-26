interface Props {
  exchange: string;
  title: string;
  price: number;
  change: number;
  time: string;
}

export default function MarketDataCard({
  title,
  price,
  change,
  time,
}: Props) {
  const isUp = change >= 0;

  return (
    <div className="rounded-xl border bg-[var(--bg-card)] p-4 space-y-1">
      <p className="text-sm text-[var(--text-secondary)]">{title}</p>

      <p className="text-xl font-semibold">
        ${price.toFixed(2)}
      </p>

      <p
        className={`text-sm font-medium ${
          isUp ? "text-[var(--buy)]" : "text-[var(--sell)]"
        }`}
      >
        {isUp ? "▲" : "▼"} {change.toFixed(2)}%
      </p>

      <p className="text-xs text-[var(--text-secondary)]">
        {new Date(time).toLocaleTimeString()}
      </p>
    </div>
  );
}
