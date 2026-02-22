"use client";

import { useEffect, useState } from "react";
import { fetchSessionsStatus } from "@/src/services/sessionStatus";
import { SessionsStatus } from "@/src/types/sessions-status";
import { Clock, ShieldCheck, ShieldOff, Gauge } from "lucide-react";

export default function SessionStatus() {
  const [sessions, setSessions] = useState<SessionsStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await fetchSessionsStatus();
        setSessions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load sessions status");
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 animate-pulse"
          >
            <div className="h-4 bg-[var(--bg-muted)] rounded w-1/4 mb-4" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 bg-[var(--bg-muted)] rounded-lg" />
              <div className="h-12 bg-[var(--bg-muted)] rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 text-[var(--danger)] text-sm">
        {error}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 text-[var(--text-muted)] text-sm">
        No session data available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Market Sessions
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {sessions.length} active session{sessions.length !== 1 ? "s" : ""} tracked
        </p>
      </div>

      {/* Session Cards */}
      {sessions.map((session) => {
        const allowed = session.trade_allowed;
        const confidence = session.confidence_weight * 100;

        return (
          <div
            key={session.session}
            className="group rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 hover:shadow-lg transition-all duration-200"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    allowed ? "bg-green-500/10" : "bg-red-500/10"
                  }`}
                >
                  {allowed ? (
                    <ShieldCheck className="w-5 h-5 text-[var(--success)]" />
                  ) : (
                    <ShieldOff className="w-5 h-5 text-[var(--danger)]" />
                  )}
                </div>
                <div>
                  <p className="text-base font-semibold text-[var(--text-primary)]">
                    {session.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {session.session}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                  allowed
                    ? "bg-green-500/10 text-[var(--success)]"
                    : "bg-red-500/10 text-[var(--danger)]"
                }`}
              >
                {allowed ? "Trade Allowed" : "No Trading"}
              </span>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Time */}
              <div className="rounded-lg bg-[var(--bg-muted)] p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    Time
                  </p>
                </div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {session.time}
                </p>
              </div>

              {/* Confidence */}
              <div className="rounded-lg bg-[var(--bg-muted)] p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Gauge className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    Confidence
                  </p>
                </div>
                <p className="text-sm font-semibold text-[var(--primary)]">
                  {confidence.toFixed(0)}%
                </p>
              </div>

              {/* Description */}
              <div className="rounded-lg bg-[var(--bg-muted)] p-3 col-span-1">
                <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1">
                  Note
                </p>
                <p className="text-xs text-[var(--text-primary)] leading-snug line-clamp-2">
                  {session.description}
                </p>
              </div>
            </div>

            {/* Confidence Bar */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wide">
                  Confidence Weight
                </span>
                <span className="text-[10px] font-semibold text-[var(--primary)]">
                  {confidence.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-[var(--bg-muted)] rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-700 bg-[var(--primary)]"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}