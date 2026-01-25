"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const data: CandleData[] = [
  { time: "10:00", open: 142000, high: 142120, low: 141900, close: 141980 },
  { time: "11:00", open: 141980, high: 142010, low: 141700, close: 141760 },
  { time: "12:00", open: 141760, high: 141820, low: 141480, close: 141520 },
  { time: "13:00", open: 141520, high: 141600, low: 141300, close: 141360 },
  { time: "14:00", open: 141360, high: 141420, low: 141200, close: 141220 },
];

export default function CandlestickChart() {
  return (
    <div className="bg-[#0b0f1a] border rounded-xl p-4 h-[320px]">
      <h3 className="text-sm font-medium text-gray-200 mb-2">
        MCX Gold – Candlestick (Signal Context)
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <XAxis dataKey="time" />
          <YAxis domain={["dataMin - 100", "dataMax + 100"]} />
          <Tooltip />

          {/* Wicks */}
          <Bar
            dataKey="high"
            fill="#000"
            barSize={2}
            shape={(props: any) => {
              const { x, y, width, height, payload } = props;
              const highY = y;
              const lowY = y + height;
              return (
                <line
                  x1={x + width / 2}
                  x2={x + width / 2}
                  y1={highY}
                  y2={lowY}
                  stroke="#000"
                />
              );
            }}
          />

          {/* Candle Body */}
          <Bar
            dataKey={(d: CandleData) => Math.abs(d.close - d.open)}
            barSize={14}
            shape={(props: any) => {
              const { x, y, width, payload } = props;
              const isBullish = payload.close > payload.open;

              const top = isBullish ? payload.close : payload.open;
              const bottom = isBullish ? payload.open : payload.close;

              return (
                <rect
                  x={x}
                  y={y + Math.min(top, bottom)}
                  width={width}
                  height={Math.abs(payload.close - payload.open)}
                  fill={isBullish ? "#22c55e" : "#ef4444"}
                />
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
