"use client";

import { useEffect, useState } from "react";
import {
  fetchTocom,
  fetchLondon,
  fetchShanghai,
  ExchangeData,
} from "@/src/services/globalMarkets.service";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Cell,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Globe,
  Activity,
  Clock,
} from "lucide-react";

type Exchange = "tocom" | "london" | "shanghai";
type Metal = "gold" | "silver";

const EXCHANGES: { id: Exchange; label: string; code: string; city: string }[] = [
  { id: "tocom",    label: "TOCOM",    code: "TYO", city: "Tokyo" },
  { id: "london",   label: "London",   code: "LME", city: "London" },
  { id: "shanghai", label: "Shanghai", code: "SGE", city: "Shanghai" },
];

/* ── candlestick ── */
const CandleBar = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload || !height) return null;

  const { open, close, high, low } = payload;
  const isUp  = close >= open;
  const color = isUp ? "#16a34a" : "#dc2626";

  const min   = Math.min(open, close, high, low);
  const max   = Math.max(open, close, high, low);
  const range = max - min || 1;

  const toPixel  = (val: number) => y + height - ((val - min) / range) * height;
  const pHigh    = toPixel(high);
  const pLow     = toPixel(low);
  const pOpen    = toPixel(open);
  const pClose   = toPixel(close);
  const pBodyTop = Math.min(pOpen, pClose);
  const pBodyH   = Math.max(Math.abs(pClose - pOpen), 2);
  const cx       = x + width / 2;

  return (
    <g>
      {/* shadow glow */}
      <line x1={cx} y1={pHigh} x2={cx} y2={pLow}
        stroke={color} strokeWidth={3} strokeOpacity={0.15} />
      {/* wick */}
      <line x1={cx} y1={pHigh} x2={cx} y2={pLow}
        stroke={color} strokeWidth={1.5} />
      {/* body */}
      <rect
        x={x + width * 0.1} y={pBodyTop}
        width={width * 0.8} height={pBodyH}
        fill={color} fillOpacity={isUp ? 0.15 : 0.9} rx={2}
      />
      <rect
        x={x + width * 0.1} y={pBodyTop}
        width={width * 0.8} height={pBodyH}
        fill="none" stroke={color} strokeWidth={1.5} rx={2}
      />
    </g>
  );
};

/* ── tooltip ── */
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const up = d.close >= d.open;
  const changeAbs = d.close - d.open;

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "10px",
      padding: "12px 16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      minWidth: "180px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em",
          color: "var(--text-primary)", textTransform: "uppercase",
        }}>
          {d.exchange}
        </span>
        <span style={{
          fontSize: "10px", padding: "1px 6px", borderRadius: "4px",
          background: up ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
          color: up ? "#16a34a" : "#dc2626", fontWeight: 600,
        }}>
          {up ? "▲" : "▼"} {d.change_pct?.toFixed(2)}%
        </span>
      </div>
      {[
        ["Open",  d.open,  "var(--text-muted)"],
        ["High",  d.high,  "#16a34a"],
        ["Low",   d.low,   "#dc2626"],
        ["Close", d.close, up ? "#16a34a" : "#dc2626"],
      ].map(([label, val, color]: any) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginBottom: "3px" }}>
          <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{label}</span>
          <span style={{ fontSize: "10px", fontWeight: 600, fontFamily: "monospace", color }}>
            {Number(val)?.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── metal tile ── */
function MetalTile({
  label, data, active, onClick, rank,
}: {
  label: string;
  data: { price: number; change_pct: number; trend: number; open: number; high: number; low: number };
  active: boolean;
  onClick: () => void;
  rank: number;
}) {
  if (!data) return null;
  const up = data.trend >= 0;
  const icon = label === "gold" ? "⬡" : "◈";

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        borderRadius: "12px",
        padding: "18px",
        border: active ? "2px solid var(--primary)" : "1.5px solid var(--border-default)",
        background: active
          ? "linear-gradient(135deg, var(--primary)08 0%, var(--primary)15 100%)"
          : "var(--bg-card)",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: active
          ? "var(--primary)"
          : up ? "#16a34a" : "#dc2626",
        borderRadius: "12px 12px 0 0",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "16px", color: label === "gold" ? "#d97706" : "#64748b" }}>{icon}</span>
            <span style={{
              fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em",
              color: "var(--text-secondary)", textTransform: "uppercase",
            }}>
              {label}
            </span>
          </div>
        </div>
        <span style={{
          fontSize: "10px", padding: "3px 8px", borderRadius: "20px", fontWeight: 700,
          background: up ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
          color: up ? "#16a34a" : "#dc2626",
          border: `1px solid ${up ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)"}`,
          display: "flex", alignItems: "center", gap: "3px",
        }}>
          {up ? <TrendingUp style={{ width: 10, height: 10 }} /> : <TrendingDown style={{ width: 10, height: 10 }} />}
          {up ? "+" : ""}{data.change_pct.toFixed(2)}%
        </span>
      </div>

      <div style={{
        fontSize: "24px", fontWeight: 800, letterSpacing: "-0.02em",
        color: "var(--text-primary)", marginBottom: "4px", fontFamily: "monospace",
      }}>
        {data.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: "4px", marginTop: "12px",
        padding: "8px", borderRadius: "8px",
        background: "var(--bg-muted)",
      }}>
        {[["O", data.open], ["H", data.high], ["L", data.low]].map(([k, v]: any) => (
          <div key={k} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "9px", color: "var(--text-muted)", marginBottom: "2px", fontWeight: 600 }}>{k}</div>
            <div style={{ fontSize: "10px", fontWeight: 700, fontFamily: "monospace", color: "var(--text-secondary)" }}>
              {Number(v).toLocaleString("en-IN", { maximumFractionDigits: 1 })}
            </div>
          </div>
        ))}
      </div>
    </button>
  );
}

/* ── main ── */
export default function GlobalMarketsPanel() {
  const [data, setData]         = useState<Record<Exchange, ExchangeData | null>>({ tocom: null, london: null, shanghai: null });
  const [loading, setLoading]   = useState(true);
  const [exchange, setExchange] = useState<Exchange>("london");
  const [metal, setMetal]       = useState<Metal>("gold");
  const [error, setError]       = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tocom, london, shanghai] = await Promise.all([
        fetchTocom(), fetchLondon(), fetchShanghai(),
      ]);
      setData({ tocom, london, shanghai });
      setLastUpdated(new Date());
    } catch (e) {
      setError("Failed to fetch market data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const chartData = (["tocom", "london", "shanghai"] as Exchange[])
    .filter(ex => data[ex] !== null && data[ex]?.[metal] != null)
    .map(ex => {
      const m = data[ex]![metal];
      return {
        exchange: EXCHANGES.find(e => e.id === ex)?.code || ex,
        fullName: EXCHANGES.find(e => e.id === ex)?.label || ex,
        metal, open: m.open, high: m.high, low: m.low,
        close: m.close, change_pct: m.change_pct, value: m.high,
      };
    });

  const current = data[exchange];
  const currentExchange = EXCHANGES.find(e => e.id === exchange);

  /* avg close for reference line */
  const avgClose = chartData.length
    ? chartData.reduce((s, d) => s + d.close, 0) / chartData.length
    : 0;

  return (
    <div style={{
      borderRadius: "16px",
      border: "1px solid var(--border-default)",
      background: "var(--bg-card)",
      overflow: "hidden",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}>

      {/* ── HEADER ── */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid var(--border-default)",
        background: "var(--bg-muted)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "var(--primary)", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <Globe style={{ width: 16, height: 16, color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
              Global Metals Markets
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
              Live spot & futures across 3 exchanges
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {lastUpdated && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "var(--text-muted)" }}>
              <Clock style={{ width: 10, height: 10 }} />
              {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </div>
          )}
          <button
            onClick={fetchAll}
            style={{
              padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border-default)",
              background: "var(--bg-card)", cursor: "pointer", display: "flex",
              alignItems: "center", gap: "6px", fontSize: "11px",
              color: "var(--text-muted)", transition: "all 0.2s",
            }}
          >
            <RefreshCw style={{ width: 12, height: 12 }} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "64px", textAlign: "center" }}>
          <Activity style={{ width: 24, height: 24, color: "var(--primary)", margin: "0 auto 8px", opacity: 0.5 }} />
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Fetching live market data...</div>
        </div>
      ) : error ? (
        <div style={{ padding: "64px", textAlign: "center", fontSize: "12px", color: "#dc2626" }}>{error}</div>
      ) : (
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* ── METAL SELECTOR ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Metal
            </span>
            {(["gold", "silver"] as Metal[]).map(m => (
              <button
                key={m}
                onClick={() => setMetal(m)}
                style={{
                  padding: "5px 14px", borderRadius: "20px", cursor: "pointer",
                  fontSize: "12px", fontWeight: 600, transition: "all 0.2s",
                  border: metal === m ? "1.5px solid var(--primary)" : "1.5px solid var(--border-default)",
                  background: metal === m ? "var(--primary)" : "transparent",
                  color: metal === m ? "#fff" : "var(--text-muted)",
                }}
              >
                {m === "gold" ? "⬡ Gold" : "◈ Silver"}
              </button>
            ))}
          </div>

          {/* ── EXCHANGE TABS ── */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px",
          }}>
            {EXCHANGES.map(({ id, label, code, city }) => {
              const exData = data[id];
              const metalData = exData?.[metal];
              const isActive = exchange === id;
              const up = metalData ? metalData.trend >= 0 : true;

              return (
                <button
                  key={id}
                  onClick={() => setExchange(id)}
                  style={{
                    padding: "12px 16px", borderRadius: "10px", cursor: "pointer",
                    border: isActive ? "2px solid var(--primary)" : "1.5px solid var(--border-default)",
                    background: isActive ? "var(--primary)10" : "var(--bg-muted)",
                    textAlign: "left", transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{
                      fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em",
                      color: isActive ? "var(--primary)" : "var(--text-muted)",
                      textTransform: "uppercase",
                    }}>{code}</span>
                    {metalData && (
                      <span style={{
                        fontSize: "9px", fontWeight: 700,
                        color: up ? "#16a34a" : "#dc2626",
                      }}>
                        {up ? "▲" : "▼"} {metalData.change_pct.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: "13px", fontWeight: 700,
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  }}>{label}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{city}</div>
                  {metalData && (
                    <div style={{
                      fontSize: "12px", fontWeight: 800, fontFamily: "monospace",
                      color: "var(--text-primary)", marginTop: "6px",
                    }}>
                      {metalData.price.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── METAL TILES for selected exchange ── */}
          {current && (
            <div style={{ display: "flex", gap: "12px" }}>
              {(["gold", "silver"] as Metal[])
                .filter(m => current?.[m] != null)
                .map((m, i) => (
                  <MetalTile
                    key={m} label={m} data={current![m]}
                    active={metal === m} onClick={() => setMetal(m)} rank={i}
                  />
                ))}
            </div>
          )}

          {/* ── STATUS BAR ── */}
          {current && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", borderRadius: "8px",
              background: "var(--bg-muted)", border: "1px solid var(--border-default)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: current.status === "open" ? "#16a34a" : "#dc2626",
                  boxShadow: current.status === "open" ? "0 0 0 3px rgba(22,163,74,0.2)" : "0 0 0 3px rgba(220,38,38,0.2)",
                }} />
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Market{" "}
                  <span style={{
                    fontWeight: 700,
                    color: current.status === "open" ? "#16a34a" : "#dc2626",
                  }}>
                    {current.status.toUpperCase()}
                  </span>
                </span>
                <span style={{
                  fontSize: "10px", padding: "2px 6px", borderRadius: "4px",
                  background: "var(--bg-card)", color: "var(--text-muted)",
                  border: "1px solid var(--border-default)",
                }}>
                  {currentExchange?.city}
                </span>
              </div>
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                Updated {new Date(current.fetched_at).toLocaleTimeString("en-IN", {
                  timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit",
                })} IST
              </span>
            </div>
          )}

          {/* ── CHART ── */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: "16px",
            }}>
              <div>
                <div style={{
                  fontSize: "12px", fontWeight: 700, color: "var(--text-primary)",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                }}>
                  {metal === "gold" ? "⬡ Gold" : "◈ Silver"} — Cross-Exchange OHLC
                </div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Comparing open, high, low & close across all markets
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", fontSize: "10px", color: "var(--text-muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "2px", background: "#16a34a", display: "inline-block" }} />
                  Bullish
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "2px", background: "#dc2626", display: "inline-block" }} />
                  Bearish
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={chartData} margin={{ top: 16, right: 16, left: 8, bottom: 0 }}
                barCategoryGap="35%">
                <CartesianGrid strokeDasharray="2 4" stroke="var(--chart-grid)" vertical={false} opacity={0.6} />
                <XAxis
                  dataKey="exchange"
                  tick={{ fontSize: 11, fill: "var(--text-muted)", fontWeight: 600 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                  axisLine={false} tickLine={false} width={72}
                  tickFormatter={(v) => v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  domain={["auto", "auto"]}
                />
                {avgClose > 0 && (
                  <ReferenceLine
                    y={avgClose} stroke="var(--primary)" strokeDasharray="4 4"
                    strokeWidth={1} opacity={0.5}
                    label={{ value: "avg", position: "right", fontSize: 9, fill: "var(--primary)" }}
                  />
                )}
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-muted)", opacity: 0.4, radius: 4 }} />
                <Bar dataKey="value" shape={<CandleBar />} isAnimationActive={false} radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i}
                      fill={entry.close >= entry.open ? "#16a34a" : "#dc2626"}
                    />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  );
}