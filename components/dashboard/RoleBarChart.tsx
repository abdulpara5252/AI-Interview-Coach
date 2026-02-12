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
  // Transform data for better visualization
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} stroke="#cbd5e1" />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 12, fill: "#64748b" }}
          stroke="#cbd5e1"
          width={140}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value) => `${value}`}
        />
        <Legend />
        <Bar
          dataKey="count"
          fill="#2563eb"
          name="Sessions"
          radius={[0, 8, 8, 0]}
        />
        <Bar
          dataKey="score"
          fill="#06b6d4"
          name="Avg Score"
          radius={[0, 8, 8, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
