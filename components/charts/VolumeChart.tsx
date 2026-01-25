"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", volume: 120 },
  { day: "Tue", volume: 190 },
  { day: "Wed", volume: 300 },
  { day: "Thu", volume: 250 },
  { day: "Fri", volume: 320 },
];

export default function VolumeChart() {
  return (
    <div
      className="p-4 rounded-xl h-[260px]"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      <h3
        className="text-sm mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        Volume Activity
      </h3>

      {/* chart height control */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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

            <Bar
              dataKey="volume"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
