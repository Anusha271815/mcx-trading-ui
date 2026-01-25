"use client";

import { Globe } from "lucide-react";
import ThemeToggle from "@/components/settings/themeToggle";

export type ThemeType = "light" | "dark";

interface AppearanceSectionProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export default function AppearanceSection({
  theme,
  setTheme,
}: AppearanceSectionProps) {
  return (
    <div
      className="rounded-xl p-6 border"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-default)",
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Globe size={24} style={{ color: "var(--primary)" }} />
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Appearance
        </h2>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p
            className="font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Theme
          </p>
          <p
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Switch between light and dark mode
          </p>
        </div>

        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
}
