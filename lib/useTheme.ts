"use client";

import { useEffect, useState } from "react";

export type ThemeType = "light" | "dark";

export default function useTheme() {
  const [theme, setThemeState] = useState<ThemeType>("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as ThemeType | null;

    if (saved === "dark" || saved === "light") {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return { theme, setTheme };
}
