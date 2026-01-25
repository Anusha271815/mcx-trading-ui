"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", price: 58500 },
  { day: "Tue", price: 68900 },
  { day: "Wed", price: 69200 },
  { day: "Thu", price: 59000 },
  { day: "Fri", price: 49450 },
];

export default function PriceChart() {
  return (
    <div
      className="p-4 rounded-xl h-[260px]"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      <h3
        className="text-sm mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        MCX Gold Price Trend
      </h3>

      {/* reduce height taken by heading */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              stroke="var(--border-default)"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="day"
              stroke="var(--text-muted)"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="var(--text-muted)"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-muted)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--text-secondary)" }}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--success)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
