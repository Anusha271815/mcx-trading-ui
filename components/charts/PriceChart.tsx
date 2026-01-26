"use client";

import { useEffect, useState } from "react";
import { ReferenceArea } from "recharts";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Clock, RefreshCw, AlertCircle, Activity } from "lucide-react";

type ChartPoint = {
  timestamp: string;
  time: string;
  gold: number;
  silver: number;
};

const mcxSessions = [
  { label: "COMEX Close + USDINR", start: "09:00", end: "09:15", trade: false, impact: "Low", description: "Market opens, volatility settling" },
  { label: "Local Flow", start: "09:15", end: "10:30", trade: "maybe", impact: "Medium", description: "Domestic sentiment driving" },
  { label: "Lean Period", start: "10:30", end: "14:00", trade: false, impact: "Low", description: "Low liquidity, avoid trading" },
  { label: "Europe", start: "14:00", end: "17:00", trade: "maybe", impact: "Medium", description: "European markets active" },
  { label: "COMEX Noise", start: "17:30", end: "17:45", trade: false, impact: "Low", description: "Pre-COMEX volatility" },
  { label: "COMEX Trend", start: "17:45", end: "19:30", trade: true, impact: "High", description: "Prime trading window!" },
  { label: "US Events", start: "19:30", end: "22:00", trade: false, impact: "Low", description: "News-driven, risky" },
  { label: "Settlement", start: "22:00", end: "23:30", trade: false, impact: "Low", description: "Day end settlement" },
];

const isTimeInRange = (time: string, start: string, end: string) => {
  return time >= start && time <= end;
};

const getCurrentSession = () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  for (const session of mcxSessions) {
    if (isTimeInRange(currentTime, session.start, session.end)) {
      return session;
    }
  }
  return null;
};

type TimeRange = '1H' | '4H' | '1D' | '1W';

export default function PriceChart() {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('1D');
  const [goldTrend, setGoldTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [silverTrend, setSilverTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [currentSession, setCurrentSession] = useState(getCurrentSession());

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    
    try {
      // Simulating API call with mock data
      const goldPrice = 2650 + Math.random() * 50;
      const silverPrice = 30 + Math.random() * 2;

      const historicalData = generateHistoricalData(goldPrice, silverPrice, timeRange);
      setData(historicalData);

      if (historicalData.length > 1) {
        const goldStart = historicalData[0].gold;
        const goldEnd = historicalData[historicalData.length - 1].gold;
        const silverStart = historicalData[0].silver;
        const silverEnd = historicalData[historicalData.length - 1].silver;

        setGoldTrend(goldEnd > goldStart ? 'up' : goldEnd < goldStart ? 'down' : 'neutral');
        setSilverTrend(silverEnd > silverStart ? 'up' : silverEnd < silverStart ? 'down' : 'neutral');
      }
    } catch (err) {
      setError(true);
      console.error('Failed to load chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
      setCurrentSession(getCurrentSession());
    }, 60000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const generateHistoricalData = (currentGold: number, currentSilver: number, range: TimeRange): ChartPoint[] => {
    const points: ChartPoint[] = [];
    let numPoints = 24;
    let interval = 60;
    let format: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

    switch (range) {
      case '1H':
        numPoints = 12;
        interval = 5;
        break;
      case '4H':
        numPoints = 24;
        interval = 10;
        break;
      case '1D':
        numPoints = 24;
        interval = 60;
        break;
      case '1W':
        numPoints = 28;
        interval = 360;
        format = { month: 'short', day: 'numeric' };
        break;
    }

    const now = new Date();
    let goldBase = currentGold * 0.98;
    let silverBase = currentSilver * 0.98;

    for (let i = 0; i < numPoints; i++) {
      const timestamp = new Date(now.getTime() - (numPoints - i - 1) * interval * 60000);
      
      const goldVariation = (Math.random() - 0.5) * (currentGold * 0.01);
      const silverVariation = (Math.random() - 0.5) * (currentSilver * 0.01);
      
      goldBase += goldVariation;
      silverBase += silverVariation;
      goldBase = goldBase * 0.95 + currentGold * 0.05;
      silverBase = silverBase * 0.95 + currentSilver * 0.05;

      points.push({
        timestamp: timestamp.toISOString(),
        time: timestamp.toLocaleTimeString('en-US', format),
        gold: parseFloat(goldBase.toFixed(2)),
        silver: parseFloat(silverBase.toFixed(2)),
      });
    }

    return points;
  };

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '1H', label: '1H' },
    { value: '4H', label: '4H' },
    { value: '1D', label: '1D' },
    { value: '1W', label: '1W' },
  ];

  if (loading && data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-900 overflow-hidden">
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
          <div className="h-6 bg-gray-700 rounded w-48 animate-pulse" />
        </div>
        <div className="p-6 h-[400px] flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-400">Loading price chart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-500">Failed to load price chart</p>
              <p className="text-xs text-gray-400 mt-1">Unable to fetch historical price data</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-gray-400 mb-2 font-semibold">{payload[0].payload.time}</p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium text-yellow-400">Gold:</span>
              <span className="text-sm font-bold text-white">${payload[0].value.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium text-gray-300">Silver:</span>
              <span className="text-sm font-bold text-white">${payload[1].value.toFixed(2)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 overflow-hidden">
      {/* HEADER */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white">COMEX Price Movement</h2>
              <p className="text-xs text-gray-400 mt-0.5">Gold & Silver live price trends</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-900">
                {goldTrend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                ) : goldTrend === 'down' ? (
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <span className="w-3.5 h-0.5 bg-gray-500" />
                )}
                <span className="text-xs font-medium text-yellow-400">Gold</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-900">
                {silverTrend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                ) : silverTrend === 'down' ? (
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <span className="w-3.5 h-0.5 bg-gray-500" />
                )}
                <span className="text-xs font-medium text-gray-300">Silver</span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1">
              {timeRanges.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTimeRange(value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                    timeRange === value
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
              title="Refresh chart"
            >
              <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* CURRENT SESSION ALERT */}
      {currentSession && (
        <div className={`px-6 py-3 border-b border-gray-700 ${
          currentSession.trade === true ? 'bg-green-500/10' : 
          currentSession.trade === 'maybe' ? 'bg-yellow-500/10' : 
          'bg-red-500/10'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className={`w-4 h-4 ${
                currentSession.trade === true ? 'text-green-400' : 
                currentSession.trade === 'maybe' ? 'text-yellow-400' : 
                'text-red-400'
              }`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Now: {currentSession.label}</span>
                  <span className="text-xs text-gray-400">({currentSession.start} - {currentSession.end})</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{currentSession.description}</p>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${
              currentSession.trade === true ? 'bg-green-500 text-white' : 
              currentSession.trade === 'maybe' ? 'bg-yellow-500 text-gray-900' : 
              'bg-red-500 text-white'
            }`}>
              {currentSession.trade === true ? '✅ TRADE NOW' : 
               currentSession.trade === 'maybe' ? '⚠️ CAUTION' : 
               '❌ AVOID'}
            </div>
          </div>
        </div>
      )}

      {/* CHART */}
      <div className="p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />

              <XAxis
                dataKey="time"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#374151', strokeWidth: 1 }}
              />

              <YAxis
                yAxisId="gold"
                orientation="left"
                stroke="#fbbf24"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#fbbf24', strokeWidth: 2 }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />

              <YAxis
                yAxisId="silver"
                orientation="right"
                stroke="#e5e7eb"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                iconType="line"
              />

              {/* Highlight COMEX Trend zone */}
              {data.map((point, index) => {
                const time = point.time;
                if (isTimeInRange(time, "17:45", "19:30")) {
                  return (
                    <ReferenceArea
                      key={index}
                      x1={point.time}
                      x2={data[index + 1]?.time || point.time}
                      yAxisId="gold"
                      fill="rgba(34,197,94,0.1)"
                      fillOpacity={1}
                    />
                  );
                }
                return null;
              })}

              <Line
                yAxisId="gold"
                type="monotone"
                dataKey="gold"
                name="Gold (USD/oz)"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#fbbf24' }}
              />

              <Line
                yAxisId="silver"
                type="monotone"
                dataKey="silver"
                name="Silver (USD/oz)"
                stroke="#e5e7eb"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#e5e7eb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MCX SESSIONS TABLE */}
      <div className="px-6 pb-6">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          MCX Trading Sessions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 font-semibold text-gray-400">Time</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-400">Session</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-400">Description</th>
                <th className="text-center py-2 px-3 font-semibold text-gray-400">Trade?</th>
                <th className="text-center py-2 px-3 font-semibold text-gray-400">Impact</th>
              </tr>
            </thead>
            <tbody>
              {mcxSessions.map((session, i) => {
                const isActive = currentSession?.label === session.label;
                return (
                  <tr 
                    key={i} 
                    className={`border-b border-gray-800 transition-colors ${
                      isActive ? 'bg-blue-500/10' : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span className={`font-mono ${isActive ? 'text-blue-400 font-bold' : 'text-gray-300'}`}>
                        {session.start}–{session.end}
                      </span>
                    </td>
                    <td className={`py-3 px-3 font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {session.label}
                    </td>
                    <td className="py-3 px-3 text-gray-400">{session.description}</td>
                    <td className="py-3 px-3 text-center text-lg">
                      {session.trade === true && "✅"}
                      {session.trade === false && "❌"}
                      {session.trade === "maybe" && "⚠️"}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        session.trade === true
                          ? 'bg-green-500/20 text-green-400'
                          : session.trade === 'maybe'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {session.impact}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-gray-800 px-6 py-3 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Live • Updates every minute</span>
          </div>
          <span>COMEX • New York Mercantile Exchange</span>
        </div>
      </div>
    </div>
  );
}