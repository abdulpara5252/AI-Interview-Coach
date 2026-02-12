"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  totalSessions: number;
  avgScore: number;
  currentStreak: number;
  improvementRate: number;
}

export function StatsCards({
  totalSessions,
  avgScore,
  currentStreak,
  improvementRate,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{totalSessions}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Average score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{avgScore.toFixed(1)}%</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{currentStreak} days</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Improvement rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold">{improvementRate.toFixed(1)}%</span>
        </CardContent>
      </Card>
    </div>
  );
}
