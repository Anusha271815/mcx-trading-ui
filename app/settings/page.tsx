"use client";

import { useState, useEffect } from "react";
import ProfileSection from "@/components/settings/ProfileSection";
import AppearanceSection, { ThemeType } from "@/components/settings/AppearanceSection";
import NotificationsCard from "@/components/settings/NotificationCard";
import SaveButton from "@/components/settings/SaveButton";
import useTheme from "@/lib/useTheme";


// 🔹 1. Fully typed Settings state
interface Notifications {
  tradingSignals: boolean;
  orderUpdates: boolean;
  priceAlerts: boolean;
  riskWarnings: boolean;
}

interface SettingsState {
  name: string;
  email: string;
  phone: string;
  location: string;
  theme: ThemeType;
  notifications: Notifications;
}

// 🔹 2. Default settings
const defaultSettings: SettingsState = {
  name: "Rajesh Kumar",
  email: "rajesh.kumar@email.com",
  phone: "+91 98765 43210",
  location: "Varanasi, Uttar Pradesh, India",
  theme: "dark",
  notifications: {
    tradingSignals: true,
    orderUpdates: true,
    priceAlerts: false,
    riskWarnings: true,
  },
};

export default function SettingsPage() {
  // 🔹 State
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const { theme, setTheme } = useTheme();

  // 🔹 Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("app-settings");
    if (stored) {
      try {
        const parsed: SettingsState = JSON.parse(stored);
        setSettings(parsed);
      } catch (err) {
        console.warn("Failed to parse stored settings:", err);
      }
    }
  }, []);

  // 🔹 Save handler
  const handleSave = async () => {
    setSaving(true);
    try {
      // simulate API call / localStorage save
      await new Promise((res) => setTimeout(res, 500));
      localStorage.setItem("app-settings", JSON.stringify(settings));
      alert("Settings saved successfully ");
    } catch (err) {
      alert("Failed to save settings ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Profile */}
      <ProfileSection
        name={settings.name}
        email={settings.email}
        phone={settings.phone}
        location={settings.location}
        onChange={(data) => setSettings((s) => ({ ...s, ...data }))}
      />

      {/* Appearance / Theme */}
      
    <AppearanceSection theme={theme} setTheme={setTheme} />

      {/* Notifications */}
      <NotificationsCard
        notifications={settings.notifications}
        onChange={(data) =>
          setSettings((s) => ({
            ...s,
            notifications: { ...s.notifications, ...data },
          }))
        }
      />

      {/* Save Button */}
      <SaveButton onSave={handleSave} loading={saving} />
    </div>
  );
}

