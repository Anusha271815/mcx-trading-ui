"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { fetchAlerts, Alert } from "@/src/services/alerts.service";
import { Bell, X, Tag, Clock, AlertTriangle } from "lucide-react";

const POLL_INTERVAL = 60 * 1000;

/* ── toast popup (bottom-right, auto-dismiss) ── */
function AlertToast({ alert, onDismiss }: { alert: Alert; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderLeft: "4px solid var(--primary)",
        borderRadius: "10px",
        padding: "12px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        maxWidth: "320px",
        width: "100%",
        animation: "slideIn 0.3s ease",
        cursor: "pointer",
      }}
      onClick={onDismiss}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <Bell style={{ width: 13, height: 13, color: "var(--primary)", marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
            {alert.title.replace(/^🚨 Filtered News: /, "")}
          </span>
        </div>
        <X style={{ width: 12, height: 12, color: "var(--text-muted)", flexShrink: 0, marginTop: 2 }} />
      </div>
      {alert.tags?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}>
          {alert.tags.map(tag => (
            <span key={tag} style={{
              fontSize: "9px", padding: "2px 6px", borderRadius: "4px",
              background: "var(--primary)15", color: "var(--primary)",
              border: "1px solid var(--primary)30", fontWeight: 600,
            }}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── full modal ── */
function AlertModal({
  alerts,
  onClose,
  onClearAll,
}: {
  alerts: Alert[];
  onClose: () => void;
  onClearAll: () => void;
}) {
  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return isNaN(d.getTime()) ? "—" : d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric", month: "short",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          zIndex: 998, backdropFilter: "blur(4px)",
        }}
      />

      {/* modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 999, width: "min(480px, 92vw)",
        maxHeight: "75vh", display: "flex", flexDirection: "column",
        background: "var(--bg-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "16px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        overflow: "hidden",
        animation: "modalIn 0.25s ease",
      }}>

        {/* header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-default)",
          background: "var(--bg-muted)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: "var(--primary)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Bell style={{ width: 14, height: 14, color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                Market Alerts
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                {alerts.length} notification{alerts.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {alerts.length > 0 && (
              <button
                onClick={onClearAll}
                style={{
                  fontSize: "10px", padding: "4px 10px", borderRadius: "6px",
                  border: "1px solid var(--border-default)",
                  background: "transparent", color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                width: "28px", height: "28px", borderRadius: "8px",
                border: "1px solid var(--border-default)",
                background: "var(--bg-card)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <X style={{ width: 14, height: 14, color: "var(--text-muted)" }} />
            </button>
          </div>
        </div>

        {/* body */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {alerts.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <Bell style={{ width: 28, height: 28, color: "var(--text-muted)", margin: "0 auto 10px", opacity: 0.3 }} />
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>No alerts yet</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", opacity: 0.6, marginTop: 4 }}>
                Polls every 60 seconds
              </div>
            </div>
          ) : (
            <div style={{ padding: "8px" }}>
              {alerts.map((alert, i) => (
                <div key={i} style={{
                  padding: "12px 14px", borderRadius: "10px", marginBottom: "4px",
                  border: "1px solid var(--border-default)",
                  background: i === 0 ? "var(--primary)08" : "transparent",
                  transition: "background 0.15s",
                }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <AlertTriangle style={{
                      width: 13, height: 13, flexShrink: 0, marginTop: 2,
                      color: "var(--primary)",
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.45, marginBottom: "6px" }}>
                        {alert.title.replace(/^🚨 Filtered News: /, "")}
                      </div>
                      {alert.tags?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
                          {alert.tags.map(tag => (
                            <span key={tag} style={{
                              fontSize: "9px", padding: "2px 6px", borderRadius: "4px",
                              background: "var(--bg-muted)", color: "var(--text-muted)",
                              border: "1px solid var(--border-default)", fontWeight: 600,
                            }}>{tag}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock style={{ width: 9, height: 9, color: "var(--text-muted)" }} />
                        <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                          {formatTime(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ── bell button (embed in any nav) ── */
export function AlertBell({ onClick, count }: { onClick: () => void; count: number }) {
  return (
    <button
      onClick={onClick}
      style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
      aria-label="Alerts"
    >
      <Bell style={{ width: 20, height: 20, color: count > 0 ? "var(--primary)" : "var(--text-muted)" }} />
      {count > 0 && (
        <span style={{
          position: "absolute", top: "-2px", right: "-2px",
          minWidth: "16px", height: "16px", borderRadius: "8px",
          background: "#dc2626", color: "#fff",
          fontSize: "9px", fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 3px", lineHeight: 1,
        }}>
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

/* ── main provider — add to layout.tsx ── */
export default function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts]       = useState<Alert[]>([]);
  const [toasts, setToasts]       = useState<Alert[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const seenRef                   = useRef<Set<string>>(new Set());

  const poll = useCallback(async () => {
    try {
      const fresh = await fetchAlerts();
      const newAlerts = fresh.filter(a => {
        const key = `${a.title}__${a.timestamp}`;
        if (seenRef.current.has(key)) return false;
        seenRef.current.add(key);
        return true;
      });

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev]);
        // show max 3 toasts at once
        setToasts(prev => [...prev, ...newAlerts.slice(0, 3)]);
      }
    } catch (e) {
      console.error("Alert poll failed:", e);
    }
  }, []);

  useEffect(() => {
    poll(); // immediate first fetch
    const id = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [poll]);

  const dismissToast = (i: number) =>
    setToasts(prev => prev.filter((_, idx) => idx !== i));

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.97); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>

      {children}

      {/* toasts — bottom right, above nav */}
      <div style={{
        position: "fixed", bottom: "90px", right: "16px",
        zIndex: 997, display: "flex", flexDirection: "column",
        gap: "8px", alignItems: "flex-end", pointerEvents: "none",
      }}>
        {toasts.map((t, i) => (
          <div key={i} style={{ pointerEvents: "auto" }}>
            <AlertToast alert={t} onDismiss={() => dismissToast(i)} />
          </div>
        ))}
      </div>

      {/* modal */}
      {modalOpen && (
        <AlertModal
          alerts={alerts}
          onClose={() => setModalOpen(false)}
          onClearAll={() => { setAlerts([]); setModalOpen(false); }}
        />
      )}

      {/* floating bell — visible when modal closed, sits above nav */}
      {!modalOpen && (
        <div style={{
          position: "fixed", bottom: "80px", left: "50%",
          transform: "translateX(-50%)", zIndex: 996,
          display: "flex", justifyContent: "center",
        }}>
          <AlertBell onClick={() => setModalOpen(true)} count={alerts.length} />
        </div>
      )}
    </>
  );
}