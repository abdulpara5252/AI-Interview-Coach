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
            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#8b5cf6" }}
          tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          stroke="#ddd6fe"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: "#8b5cf6" }}
          stroke="#ddd6fe"
          label={{ value: "Score", angle: -90, position: "insideLeft", fill: "#8b5cf6" }}
        />
        <Tooltip
          labelFormatter={(v) => new Date(v).toLocaleDateString()}
          formatter={(value: number) => [`${value.toFixed(1)}%`, "Avg Score"]}
          contentStyle={{
            backgroundColor: "rgba(88, 28, 135, 0.95)",
            border: "1px solid #7c3aed",
            borderRadius: "12px",
            color: "#fff",
            boxShadow: "0 4px 16px rgba(124, 58, 237, 0.3)",
          }}
          cursor={{ stroke: "#7c3aed", strokeWidth: 2 }}
        />
        <ReferenceLine
          y={70}
          stroke="#a855f7"
          strokeDasharray="5 5"
          label={{ value: "Target: 70%", position: "right", fill: "#7c3aed", fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="avgScore"
          stroke="#7c3aed"
          strokeWidth={3}
          dot={{ fill: "#7c3aed", r: 5, strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 7, fill: "#a855f7", stroke: "#7c3aed", strokeWidth: 2 }}
          fillOpacity={1}
          fill="url(#colorScore)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
