import { Clock } from "lucide-react";

function SessionGauge() {
  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', borderWidth: '1px', borderColor: 'var(--border-default)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Clock size={18} style={{ color: 'var(--primary)' }} />
        <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Time Session Confidence</h3>
      </div>
      <div className="text-5xl font-bold mb-2" style={{ color: 'var(--success)' }}>0.75</div>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Europe Session Active</p>
      <div className="mt-4 pt-4" style={{ borderTopWidth: '1px', borderColor: 'var(--border-default)' }}>
        <div className="flex justify-between text-xs mb-2">
          <span style={{ color: 'var(--text-muted)' }}>Session Progress</span>
          <span style={{ color: 'var(--text-secondary)' }}>75%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: '75%', backgroundColor: 'var(--success)' }}></div>
        </div>
      </div>
    </div>
  );
}

export default SessionGauge;