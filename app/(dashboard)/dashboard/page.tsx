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
import { ArrowRight, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <Card className="border-rose-200 bg-rose-50 rounded-2xl">
        <CardContent className="pt-6">
          <p className="text-rose-700 font-medium">Failed to load dashboard. Try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100/80 text-violet-700 text-sm font-medium border border-violet-200/50 mb-3">
            <Sparkles className="h-4 w-4" />
            Analytics
          </div>
          <h1 className="text-4xl font-bold gradient-text-purple">
            Analytics Dashboard
          </h1>
          <p className="text-violet-700/60 mt-1">Track your interview preparation progress</p>
        </div>
        {/* <Link href="/interview/new">
          <Button className="gradient-purple-pink text-white shadow-purple hover:shadow-purple-lg hover:opacity-90 rounded-xl px-6 transition-all">
            New Interview
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link> */}
      </div>

      {/* Stats Cards */}
      <StatsCards
        totalSessions={stats.totalSessions}
        avgScore={stats.avgScore}
        currentStreak={stats.currentStreak}
        improvementRate={stats.improvementRate}
      />

      {/* Score Trend Chart */}
      <Card className="border-violet-100/50 shadow-purple-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Score Trend - Last 30 Days</CardTitle>
          <p className="text-sm text-violet-700/60 mt-1">Your average score trajectory over time</p>
        </CardHeader>
        <CardContent>
          {stats.scoreTrend.length > 0 ? (
            <ScoreTrendChart data={stats.scoreTrend} />
          ) : (
            <div className="h-64 flex items-center justify-center bg-violet-50/50 rounded-xl">
              <p className="text-violet-500">Complete interviews to see your score trend.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-violet-100/50 shadow-purple-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Skills Analysis</CardTitle>
            <p className="text-sm text-violet-700/60 mt-1">Current performance across dimensions</p>
          </CardHeader>
          <CardContent>
            <RoleRadarChart dimensionAverages={stats.dimensionAverages} />
          </CardContent>
        </Card>

        <Card className="border-violet-100/50 shadow-purple-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Sessions by Role</CardTitle>
            <p className="text-sm text-violet-700/60 mt-1">Practice distribution across interview types</p>
          </CardHeader>
          <CardContent>
            {stats.roleBreakdown.length > 0 ? (
              <RoleBarChart data={stats.roleBreakdown} />
            ) : (
              <div className="h-64 flex items-center justify-center bg-violet-50/50 rounded-xl">
                <p className="text-violet-500">Complete interviews to see role breakdown.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Practice Heatmap */}
      <Card className="border-violet-100/50 shadow-purple-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Practice Heatmap - Last 90 Days</CardTitle>
          <p className="text-sm text-violet-700/60 mt-1">Your practice consistency over time</p>
        </CardHeader>
        <CardContent>
          <PracticeHeatmap sessions={stats.recentSessions} />
        </CardContent>
      </Card>

      {/* Recent Sessions Table */}
      <Card className="border-violet-100/50 shadow-purple-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Sessions</CardTitle>
          <p className="text-sm text-violet-700/60 mt-1">Your last 5 interview sessions</p>
        </CardHeader>
        <CardContent>
          {stats.recentSessions.length > 0 ? (
            <RecentSessionsTable sessions={stats.recentSessions} />
          ) : (
            <div className="py-8 text-center">
              <p className="text-violet-500">No completed sessions yet. Start your first interview!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
