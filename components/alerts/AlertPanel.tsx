import { AlertCircle } from "lucide-react";

function AlertsPanel() {
  const alerts = [
    { 
      type: 'success' as const, 
      message: 'Europe session started — Confidence ↑ 0.75',
      time: '2m ago'
    },
    { 
      type: 'danger' as const, 
      message: 'Risk-Off in 7 min — Avoid new trades',
      time: '5m ago'
    },
    { 
      type: 'warning' as const, 
      message: 'High volatility detected in GOLD futures',
      time: '12m ago'
    },
    { 
      type: 'success' as const, 
      message: 'SILVER target reached — Consider booking profits',
      time: '18m ago'
    }
  ];

  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', borderWidth: '1px', borderColor: 'var(--border-default)' }}>
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle size={18} style={{ color: 'var(--warning)' }} />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Alerts</h3>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {alerts.map((alert, idx) => (
          <div 
            key={idx} 
            className="p-3 rounded-lg flex items-start gap-3"
            style={{ 
              backgroundColor: 'var(--bg-muted)',
              borderLeftWidth: '3px',
              borderColor: alert.type === 'success' ? 'var(--success)' : alert.type === 'warning' ? 'var(--warning)' : 'var(--danger)'
            }}
          >
            <div 
              className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
              style={{ 
                backgroundColor: alert.type === 'success' ? 'var(--success)' : alert.type === 'warning' ? 'var(--warning)' : 'var(--danger)'
              }}
            ></div>
            <div className="flex-1">
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{alert.message}</p>
              <span className="text-xs mt-1 block" style={{ color: 'var(--text-muted)' }}>{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default AlertsPanel;