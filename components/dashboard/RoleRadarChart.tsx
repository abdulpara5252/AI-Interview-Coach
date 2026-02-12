"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface AnswerFeedbackScores {
  contentAccuracy: number;
  communication: number;
  problemSolving: number;
  confidence: number;
}

interface RoleRadarChartProps {
  dimensionAverages: AnswerFeedbackScores;
}

export function RoleRadarChart({ dimensionAverages }: RoleRadarChartProps) {
  const data = [
    {
      name: "Content Accuracy",
      value: dimensionAverages.contentAccuracy,
      fullMark: 100,
    },
    {
      name: "Communication",
      value: dimensionAverages.communication,
      fullMark: 100,
    },
    {
      name: "Problem Solving",
      value: dimensionAverages.problemSolving,
      fullMark: 100,
    },
    {
      name: "Confidence",
      value: dimensionAverages.confidence,
      fullMark: 100,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart
        data={data}
        margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
      >
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "#64748b" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: "#64748b" }}
        />
        <Radar
          name="Current Skills"
          dataKey="value"
          stroke="#2563eb"
          fill="#2563eb"
          fillOpacity={0.3}
          dot={{ fill: "#2563eb", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
