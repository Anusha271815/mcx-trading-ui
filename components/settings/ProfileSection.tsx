"use client";

import { Mail, Phone, MapPin } from "lucide-react";

interface ProfileSectionProps {
  name: string;
  email: string;
  phone: string;
  location: string;
  onChange: (data: Partial<{ name: string; email: string; phone: string; location: string }>) => void;
}

export default function ProfileSection({
  name,
  email,
  phone,
  location,
  onChange,
}: ProfileSectionProps) {
  return (
    <div
      className="rounded-xl p-6 border"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-default)" }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
        Profile Information
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={name}
          onChange={(v) => onChange({ name: v })}
        />
        <Input
          label="Trading ID"
          value="MCX9847562"
          disabled
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input
          label="Email"
          value={email}
          type="email"
          onChange={(v) => onChange({ email: v })}
        />
        <Input
          label="Phone"
          value={phone}
          type="tel"
          onChange={(v) => onChange({ phone: v })}
        />
      </div>

      <div className="mt-4">
        <Input
          label="Location"
          value={location}
          onChange={(v) => onChange({ location: v })}
        />
      </div>
    </div>
  );
}

/* ======================
   Reusable Input Field
====================== */
interface InputProps {
  label: string;
  value?: string;
  type?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

function Input({ label, value, type = "text", disabled = false, onChange }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-4 py-2 rounded-lg text-sm ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        style={{
          backgroundColor: "var(--bg-muted)",
          color: "var(--text-primary)",
          borderWidth: "1px",
          borderColor: "var(--border-default)",
        }}
      />
    </div>
  );
}
