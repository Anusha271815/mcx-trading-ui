"use client";
import SessionGauge from "@/components/confidence/SessionGauge";
import MarketCard from "@/components/market/marketCard";
import AlertsPanel from "@/components/alerts/AlertPanel";
import { use, useState } from "react";
import { TrendingUp, TrendingDown,AlertCircle, Target } from "lucide-react";

export default function Dashboard() {
  const portfolioStats = [
    { label: "Total Value", value: "₹12,45,890", change: "+5.2%", positive: true },
    { label: "Today's P&L", value: "₹8,430", change: "+2.1%", positive: true },
    { label: "Open Positions", value: "7", change: "3 profitable", positive: true },
    { label: "Available Margin", value: "₹3,42,100", change: "67% utilized", positive: false }
  ];

  const openPositions = [
    { symbol: "GOLD APR", type: "LONG", entry: "58,649", current: "59,422", qty: 2, pnl: "+1,546", percent: "+1.32%" },
    { symbol: "SILVER MAR", type: "SHORT", entry: "75,510", current: "74,372", qty: 5, pnl: "+5,690", percent: "+1.51%" },
    { symbol: "CRUDE FEB", type: "LONG", entry: "6,156", current: "6,245", qty: 3, pnl: "+267", percent: "+1.45%" },
    { symbol: "COPPER MAR", type: "LONG", entry: "733.40", current: "745.80", qty: 4, pnl: "+496", percent: "+1.69%" }
  ];

  const recentTrades = [
    { symbol: "GOLD APR", type: "BUY", price: "58,649", qty: 2, time: "10:45 AM", status: "Executed" },
    { symbol: "SILVER MAR", type: "SELL", price: "75,510", qty: 5, time: "11:20 AM", status: "Executed" },
    { symbol: "CRUDE FEB", type: "BUY", price: "6,156", qty: 3, time: "02:15 PM", status: "Executed" }
  ];

  const tradingSignals = [
    { symbol: "GOLD", signal: "BUY", confidence: "High", target: "60,200", sl: "58,900", time: "5m ago" },
    { symbol: "COPPER", signal: "BUY", confidence: "Medium", target: "755", sl: "740", time: "12m ago" },
    { symbol: "NATURAL GAS", signal: "SELL", confidence: "High", target: "228", sl: "238", time: "18m ago" },
    { symbol: "ZINC", signal: "SELL", confidence: "Medium", target: "265", sl: "272", time: "25m ago" }
  ];

  const alerts = [
    { type: 'success' as const, message: 'GOLD target of 59,500 achieved', time: '2m ago' },
    { type: 'warning' as const, message: 'High volatility expected in next 30 mins', time: '8m ago' },
    { type: 'danger' as const, message: 'CRUDE OIL approaching stop loss', time: '15m ago' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Portfolio Overview - Top Stats */}
      <div className="grid grid-cols-4 gap-6">
        {portfolioStats.map((stat, idx) => (
          <div key={idx} className="p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', borderWidth: '1px', borderColor: 'var(--border-default)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
              {stat.positive ? <TrendingUp size={18} style={{ color: 'var(--success)' }} /> : <TrendingDown size={18} style={{ color: 'var(--text-muted)' }} />}
            </div>
            <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
            <div className="text-sm font-medium" style={{ color: stat.positive ? 'var(--success)' : 'var(--text-muted)' }}>{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Section - Open Positions & Recent Trades */}
        <div className="col-span-8 space-y-6">
          {/* Open Positions Table */}
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Open Positions</h2>
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderWidth: '1px', borderColor: 'var(--border-default)' }}>
              <table className="w-full">
                <thead style={{ backgroundColor: 'var(--bg-muted)' }}>
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Symbol</th>
                    <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Type</th>
                    <th className="text-right p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Entry</th>
                    <th className="text-right p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Current</th>
                    <th className="text-right p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Qty</th>
                    <th className="text-right p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {openPositions.map((position, idx) => (
                    <tr key={idx} style={{ borderTopWidth: '1px', borderColor: 'var(--border-default)' }}>
                      <td className="p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{position.symbol}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-md text-xs font-bold" style={{ 
                          backgroundColor: position.type === 'LONG' ? 'var(--success)' : 'var(--danger)',
                          color: 'white'
                        }}>
                          {position.type}
                        </span>
                      </td>
                      <td className="p-4 text-right" style={{ color: 'var(--text-secondary)' }}>₹{position.entry}</td>
                      <td className="p-4 text-right font-semibold" style={{ color: 'var(--text-primary)' }}>₹{position.current}</td>
                      <td className="p-4 text-right" style={{ color: 'var(--text-secondary)' }}>{position.qty}</td>
                      <td className="p-4 text-right font-bold text-base" style={{ color: 'var(--success)' }}>
                        {position.pnl} <span className="text-sm">({position.percent})</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Trades */}
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Trades</h2>
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderWidth: '1px', borderColor: 'var(--border-default)' }}>
              <table className="w-full">
                <thead style={{ backgroundColor: 'var(--bg-muted)' }}>
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Symbol</th>
                    <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Type</th>
                    <th className="text-right p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Price</th>
                    <th className="text-right p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Qty</th>
                    <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Time</th>
                    <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade, idx) => (
                    <tr key={idx} style={{ borderTopWidth: '1px', borderColor: 'var(--border-default)' }}>
                      <td className="p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{trade.symbol}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-md text-xs font-bold" style={{ 
                          backgroundColor: trade.type === 'BUY' ? 'var(--success)' : 'var(--danger)',
                          color: 'white'
                        }}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="p-4 text-right font-semibold" style={{ color: 'var(--text-primary)' }}>₹{trade.price}</td>
                      <td className="p-4 text-right" style={{ color: 'var(--text-secondary)' }}>{trade.qty}</td>
                      <td className="p-4" style={{ color: 'var(--text-secondary)' }}>{trade.time}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-xs font-semibold" style={{ 
                          backgroundColor: 'var(--success)',
                          color: 'white'
                        }}>
                          {trade.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Trading Signals & Alerts */}
        <div className="col-span-4 space-y-6">
          {/* Trading Signals */}
          <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', borderWidth: '1px', borderColor: 'var(--border-default)' }}>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Target size={20} style={{ color: 'var(--primary)' }} />
              Trading Signals
            </h3>
            <div className="space-y-4">
              {tradingSignals.map((signal, idx) => (
                <div key={idx} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-muted)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{signal.symbol}</span>
                    <span className="px-3 py-1.5 rounded-md text-sm font-bold" style={{
                      backgroundColor: signal.signal === 'BUY' ? 'var(--success)' : 'var(--danger)',
                      color: 'white'
                    }}>
                      {signal.signal}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="px-2.5 py-1 rounded text-xs font-semibold" style={{
                      backgroundColor: signal.confidence === 'High' ? 'var(--confidence-high)' : 'var(--confidence-medium)',
                      color: 'white'
                    }}>
                      {signal.confidence}
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{signal.time}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Target:</span>
                      <span className="font-semibold" style={{ color: 'var(--success)' }}>₹{signal.target}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>SL:</span>
                      <span className="font-semibold" style={{ color: 'var(--danger)' }}>₹{signal.sl}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Alerts */}
          <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', borderWidth: '1px', borderColor: 'var(--border-default)' }}>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <AlertCircle size={20} style={{ color: 'var(--warning)' }} />
              Active Alerts
            </h3>
            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-muted)',
                    borderLeftWidth: '4px',
                    borderColor: alert.type === 'success' ? 'var(--success)' : alert.type === 'warning' ? 'var(--warning)' : 'var(--danger)'
                  }}
                >
                  <p className="text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{alert.message}</p>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{alert.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Stats */}
          <div className="p-5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', borderWidth: '1px', borderColor: 'var(--border-default)' }}>
            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Today's Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Trades</span>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Win Rate</span>
                <span className="font-bold text-lg" style={{ color: 'var(--success)' }}>75%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Best Trade</span>
                <span className="font-bold text-lg" style={{ color: 'var(--success)' }}>+₹5,690</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Worst Trade</span>
                <span className="font-bold text-lg" style={{ color: 'var(--danger)' }}>-₹890</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}