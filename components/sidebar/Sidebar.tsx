"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  Settings,
  ShoppingCart,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/market", icon: BarChart3, label: "Market Overview" },
    { path: "/signals", icon: Activity, label: "Trading Signals" },
    { path: "/orders", icon: ShoppingCart, label: "Orders" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside
      className="w-64 p-4 space-y-6 border-r"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-default)",
      }}
    >
      <h1
        className="text-xl font-bold"
        style={{ color: "var(--primary)" }}
      >
        MCX Trading
      </h1>

      <nav className="space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = pathname === path;

          return (
            <Link
              key={path}
              href={path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
              style={
                isActive
                  ? {
                      backgroundColor: "var(--primary)",
                      color: "var(--bg-card)",
                    }
                  : {
                      color: "var(--text-secondary)",
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor =
                    "var(--bg-muted)";
                  e.currentTarget.style.color =
                    "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor =
                    "transparent";
                  e.currentTarget.style.color =
                    "var(--text-secondary)";
                }
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
