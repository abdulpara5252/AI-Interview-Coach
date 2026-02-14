"use client";

import { Card, CardContent } from "@/components/ui/card";
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
      gradient: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-50",
      textColor: "text-violet-600",
    },
    {
      title: "Average Score",
      value: `${avgScore.toFixed(1)}%`,
      icon: Zap,
      gradient: "from-fuchsia-500 to-pink-600",
      bgColor: "bg-fuchsia-50",
      textColor: "text-fuchsia-600",
    },
    {
      title: "Current Streak",
      value: `${currentStreak}`,
      subtitle: "days",
      icon: Flame,
      gradient: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "Improvement Rate",
      value: `${Math.abs(improvementRate).toFixed(1)}%`,
      icon: isImproving ? TrendingUp : TrendingDown,
      gradient: isImproving ? "from-emerald-500 to-green-600" : "from-rose-500 to-red-600",
      bgColor: isImproving ? "bg-emerald-50" : "bg-rose-50",
      textColor: isImproving ? "text-emerald-600" : "text-rose-600",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="border-violet-100/50 shadow-purple-sm hover:shadow-purple transition-all duration-300 rounded-2xl overflow-hidden group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-sm text-violet-700/60 font-medium mb-1">{stat.title}</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                {stat.subtitle && <p className="text-sm text-violet-700/60 mb-1">{stat.subtitle}</p>}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
