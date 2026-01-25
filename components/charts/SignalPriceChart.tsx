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
  { time: "10:00", price: 10190 },
  { time: "11:00", price: 12170 },
  { time: "12:00", price: 13140 },
  { time: "13:00", price: 10160 },
  { time: "14:00", price: 10220 },
];

export default function SignalPriceChart() {
  return (
    <div
      className="border rounded-xl p-4 h-[260px]"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-default)",
      }}
    >
      <h3
        className="text-sm font-medium mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        Price Context (Signal Time)
      </h3>

      {/* chart height control */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              stroke="var(--border-default)"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
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
              stroke="var(--sell)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
