"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RoleBarChartProps {
  data: { role: string; count: number; avgScore: number }[];
}

export function RoleBarChart({ data }: RoleBarChartProps) {
  const chartData = data.map((item) => ({
    name: item.role.replace(" Developer", "").replace(" Designer", "").replace(" Manager", "").replace(" Scientist", ""),
    count: item.count,
    score: Math.round(item.avgScore),
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
        <XAxis type="number" tick={{ fontSize: 12, fill: "#8b5cf6" }} stroke="#ddd6fe" />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 12, fill: "#8b5cf6" }}
          stroke="#ddd6fe"
          width={140}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(88, 28, 135, 0.95)",
            border: "1px solid #7c3aed",
            borderRadius: "12px",
            color: "#fff",
            boxShadow: "0 4px 16px rgba(124, 58, 237, 0.3)",
          }}
          formatter={(value) => `${value}`}
        />
        <Legend />
        <Bar
          dataKey="count"
          fill="#7c3aed"
          name="Sessions"
          radius={[0, 8, 8, 0]}
        />
        <Bar
          dataKey="score"
          fill="#a855f7"
          name="Avg Score"
          radius={[0, 8, 8, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
