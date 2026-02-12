"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  defs,
  linearGradient,
  stop,
} from "recharts";

interface ScoreTrendChartProps {
  data: { date: string; avgScore: number }[];
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#64748b" }}
          tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          stroke="#cbd5e1"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: "#64748b" }}
          stroke="#cbd5e1"
          label={{ value: "Score", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          labelFormatter={(v) => new Date(v).toLocaleDateString()}
          formatter={(value: number) => [`${value.toFixed(1)}%`, "Avg Score"]}
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            color: "#fff",
          }}
          cursor={{ stroke: "#2563eb", strokeWidth: 2 }}
        />
        <ReferenceLine
          y={70}
          stroke="#f59e0b"
          strokeDasharray="5 5"
          label={{ value: "Target: 70%", position: "right", fill: "#92400e", fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="avgScore"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ fill: "#2563eb", r: 5 }}
          activeDot={{ r: 7 }}
          fillOpacity={1}
          fill="url(#colorScore)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
