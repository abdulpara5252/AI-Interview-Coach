"use client";

import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ScoreTrendChart } from "@/components/dashboard/ScoreTrendChart";
import { getScoreColor, getGradeColor } from "@/lib/utils";

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Failed to load dashboard. Try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/interview/new">
          <Button>New interview</Button>
        </Link>
      </div>

      <StatsCards
        totalSessions={stats.totalSessions}
        avgScore={stats.avgScore}
        currentStreak={stats.currentStreak}
        improvementRate={stats.improvementRate}
      />

      <Card>
        <CardHeader>
          <CardTitle>Score trend</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.scoreTrend.length > 0 ? (
            <ScoreTrendChart data={stats.scoreTrend} />
          ) : (
            <p className="text-muted-foreground text-sm py-8 text-center">
              Complete interviews to see your score trend.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentSessions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No completed sessions yet. Start your first interview.
            </p>
          ) : (
            <ul className="space-y-2">
              {stats.recentSessions.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{s.role} · {s.interviewType}</p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(s.createdAt).toLocaleDateString()} · {s.duration} min
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.overallScore != null && (
                      <span className={getScoreColor(s.overallScore)}>
                        {s.overallScore}%
                      </span>
                    )}
                    {s.grade && (
                      <span className={getGradeColor(s.grade)}>{s.grade}</span>
                    )}
                    <Link href={`/interview/${s.id}/feedback`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
