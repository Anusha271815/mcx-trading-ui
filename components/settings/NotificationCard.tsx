"use client";

import { Bell } from "lucide-react";

interface NotificationsCardProps {
  notifications: {
    tradingSignals: boolean;
    orderUpdates: boolean;
    priceAlerts: boolean;
    riskWarnings: boolean;
  };
  onChange: (
    data: Partial<NotificationsCardProps["notifications"]>
  ) => void;
}

export default function NotificationsCard({
  notifications,
  onChange,
}: NotificationsCardProps) {
  return (
    <div
      className="rounded-xl p-6 border"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-default)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Bell size={24} style={{ color: "var(--primary)" }} />
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Notifications
        </h2>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <ToggleItem
          title="Trading Signals"
          desc="Get notified when new signals are generated"
          checked={notifications.tradingSignals}
          onChange={(v) => onChange({ tradingSignals: v })}
        />

        <ToggleItem
          title="Order Updates"
          desc="Order execution, rejection & completion alerts"
          checked={notifications.orderUpdates}
          onChange={(v) => onChange({ orderUpdates: v })}
        />

        <ToggleItem
          title="Price Alerts"
          desc="Notify when price hits your target"
          checked={notifications.priceAlerts}
          onChange={(v) => onChange({ priceAlerts: v })}
        />

        <ToggleItem
          title="Risk Warnings"
          desc="Margin calls & volatility alerts"
          checked={notifications.riskWarnings}
          onChange={(v) => onChange({ riskWarnings: v })}
        />
      </div>
    </div>
  );
}

/* ===== Toggle Row ===== */

function ToggleItem({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p
          className="font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </p>
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          {desc}
        </p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 cursor-pointer"
        style={{ accentColor: "var(--primary)" }}
      />
    </div>
  );
}


