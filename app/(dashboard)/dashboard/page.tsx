"use client";

import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ScoreTrendChart } from "@/components/dashboard/ScoreTrendChart";
import { RoleRadarChart } from "@/components/dashboard/RoleRadarChart";
import { RoleBarChart } from "@/components/dashboard/RoleBarChart";
import { RecentSessionsTable } from "@/components/dashboard/RecentSessionsTable";
import { PracticeHeatmap } from "@/components/dashboard/PracticeHeatmap";
import { getGradeColor } from "@/lib/utils";

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-80 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-700 font-medium">Failed to load dashboard. Try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600 mt-1">Track your interview preparation progress</p>
        </div>
        <Link href="/interview/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6">
            New Interview
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards
        totalSessions={stats.totalSessions}
        avgScore={stats.avgScore}
        currentStreak={stats.currentStreak}
        improvementRate={stats.improvementRate}
      />

      {/* Score Trend Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Score Trend - Last 30 Days</CardTitle>
          <p className="text-sm text-slate-600 mt-1">Your average score trajectory over time</p>
        </CardHeader>
        <CardContent>
          {stats.scoreTrend.length > 0 ? (
            <ScoreTrendChart data={stats.scoreTrend} />
          ) : (
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <p className="text-slate-500">Complete interviews to see your score trend.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two Column Row - Radar and Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Skills Analysis</CardTitle>
            <p className="text-sm text-slate-600 mt-1">Current performance across dimensions</p>
          </CardHeader>
          <CardContent>
            <RoleRadarChart dimensionAverages={stats.dimensionAverages} />
          </CardContent>
        </Card>

        {/* Role Bar Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sessions by Role</CardTitle>
            <p className="text-sm text-slate-600 mt-1">Practice distribution across interview types</p>
          </CardHeader>
          <CardContent>
            {stats.roleBreakdown.length > 0 ? (
              <RoleBarChart data={stats.roleBreakdown} />
            ) : (
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <p className="text-slate-500">Complete interviews to see role breakdown.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Practice Heatmap */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Practice Heatmap - Last 90 Days</CardTitle>
          <p className="text-sm text-slate-600 mt-1">Your practice consistency over time</p>
        </CardHeader>
        <CardContent>
          <PracticeHeatmap sessions={stats.recentSessions} />
        </CardContent>
      </Card>

      {/* Recent Sessions Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Sessions</CardTitle>
          <p className="text-sm text-slate-600 mt-1">Your last 5 interview sessions</p>
        </CardHeader>
        <CardContent>
          {stats.recentSessions.length > 0 ? (
            <RecentSessionsTable sessions={stats.recentSessions} />
          ) : (
            <div className="py-8 text-center">
              <p className="text-slate-500">No completed sessions yet. Start your first interview!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
