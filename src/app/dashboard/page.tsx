"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } = useDashboard();

  if (isLoading) return <Skeleton className="m-8 h-96" />;
  if (isError || !data) {
    return (
      <main className="m-8 space-y-2">
        <p className="text-sm text-red-600">Failed to load dashboard.</p>
        <button className="rounded border px-3 py-1 text-sm" onClick={() => refetch()} disabled={isFetching}>Retry</button>
      </main>
    );
  }

  const radarData = [
    { key: "Content", value: data.dimensionAverage.content },
    { key: "Communication", value: data.dimensionAverage.communication },
    { key: "Problem Solving", value: data.dimensionAverage.problemSolving },
    { key: "Confidence", value: data.dimensionAverage.confidence }
  ];

  return (
    <main className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle>Sessions</CardTitle></CardHeader><CardContent>{data.sessionsCount}</CardContent></Card>
        <Card><CardHeader><CardTitle>Avg Score</CardTitle></CardHeader><CardContent>{data.avgScore}</CardContent></Card>
        <Card><CardHeader><CardTitle>Improvement</CardTitle></CardHeader><CardContent>{data.improvementRate}%</CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Score Trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} /></LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Score by Dimension</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="key" />
                <Radar dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Role Breakdown</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.roleBreakdown}><XAxis dataKey="role" /><YAxis /><Tooltip /><Bar dataKey="avgScore" fill="#10b981" /></BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  );
}
