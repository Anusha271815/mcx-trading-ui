"use client";

import { Shield } from "lucide-react";

export default function SecurityCard() {
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
        <Shield size={24} style={{ color: "var(--primary)" }} />
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Security
        </h2>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <SecurityItem
          title="Two-Factor Authentication (2FA)"
          desc="Extra layer of security for login"
          action="Enabled"
          highlight
        />

        <SecurityItem
          title="Change Password"
          desc="Update your account password regularly"
          action="Change"
        />

        <SecurityItem
          title="Active Sessions"
          desc="Manage devices logged into your account"
          action="View"
        />

        <SecurityItem
          title="Login Alerts"
          desc="Get notified of new login attempts"
          action="On"
          highlight
        />
      </div>
    </div>
  );
}

/* ===== Security Row ===== */

function SecurityItem({
  title,
  desc,
  action,
  highlight = false,
}: {
  title: string;
  desc: string;
  action: string;
  highlight?: boolean;
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

      <button
        className="px-4 py-1.5 rounded-lg text-sm font-medium"
        style={{
          backgroundColor: highlight
            ? "var(--primary)"
            : "var(--bg-muted)",
          color: highlight ? "white" : "var(--text-primary)",
        }}
      >
        {action}
      </button>
    </div>
  );
}

