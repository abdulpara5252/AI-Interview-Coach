"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Flame, Target, Zap } from "lucide-react";

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
  const isImproving = improvementRate >= 0;

  const stats = [
    {
      title: "Total Sessions",
      value: totalSessions.toString(),
      icon: Target,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Average Score",
      value: `${avgScore.toFixed(1)}%`,
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      trend: true,
      trendValue: isImproving ? improvementRate : -improvementRate,
    },
    {
      title: "Current Streak",
      value: `${currentStreak}`,
      subtitle: "days",
      icon: Flame,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "Improvement Rate",
      value: `${Math.abs(improvementRate).toFixed(1)}%`,
      icon: isImproving ? TrendingUp : TrendingDown,
      color: isImproving ? "from-green-500 to-green-600" : "from-red-500 to-red-600",
      bgColor: isImproving ? "bg-green-50" : "bg-red-50",
      textColor: isImproving ? "text-green-600" : "text-red-600",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-sm text-slate-600 font-medium mb-1">{stat.title}</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                {stat.subtitle && <p className="text-sm text-slate-500 mb-1">{stat.subtitle}</p>}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
