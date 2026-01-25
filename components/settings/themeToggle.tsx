"use client";

import { Sun, Moon } from "lucide-react";
import { ThemeType } from "./AppearanceSection"; // import the type

interface ThemeToggleProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export default function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme("light")}
        className="p-3 rounded-lg transition-all"
        style={{
          backgroundColor: theme === "light" ? "var(--primary)" : "var(--bg-muted)",
          color: theme === "light" ? "#fff" : "var(--text-secondary)",
        }}
      >
        <Sun size={20} />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className="p-3 rounded-lg transition-all"
        style={{
          backgroundColor: theme === "dark" ? "var(--primary)" : "var(--bg-muted)",
          color: theme === "dark" ? "#fff" : "var(--text-secondary)",
        }}
      >
        <Moon size={20} />
      </button>
    </div>
  );
}
