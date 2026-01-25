import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MarketCardProps {
  title: string;
  price: string;
  change: string;
  bullish?: boolean;
  volume?: string;
  oi?: string;
}

export default function MarketCard({ title, price, change, bullish, volume, oi }: MarketCardProps) {
  return (
    <div className="p-3 rounded-xl transition-all hover:shadow-lg" style={{ backgroundColor: 'var(--bg-card)', borderWidth: '1px', borderColor: 'var(--border-default)' }}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</h4>
        {bullish ? (
          <ArrowUpRight size={16} style={{ color: 'var(--success)' }} />
        ) : (
          <ArrowDownRight size={16} style={{ color: 'var(--danger)' }} />
        )}
      </div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>₹{price}</span>
        <span className="text-xs font-semibold" style={{ color: bullish ? 'var(--success)' : 'var(--danger)' }}>
          {change}
        </span>
      </div>
      {(volume || oi) && (
        <div className="flex items-center justify-between text-xs pt-2" style={{ borderTopWidth: '1px', borderColor: 'var(--border-default)' }}>
          {volume && <span style={{ color: 'var(--text-muted)' }}>Vol: {volume}</span>}
          {oi && <span style={{ color: 'var(--text-muted)' }}>OI: {oi}</span>}
        </div>
      )}
    </div>
  );
}