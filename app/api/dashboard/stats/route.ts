import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completedSessions = await prisma.session.findMany({
      where: { userId: user.id, status: "completed" },
      include: { answers: true },
      orderBy: { completedAt: "asc" },
    });

    const totalSessions = completedSessions.length;
    const scores = completedSessions
      .map((s) => s.overallScore)
      .filter((n): n is number => n != null);
    const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    const dates = completedSessions
      .map((s) => s.completedAt)
      .filter((d): d is Date => d != null)
      .map((d) => d.toISOString().slice(0, 10));
    const uniqueDays = [...new Set(dates)].sort();
    let currentStreak = 0;
    const today = new Date().toISOString().slice(0, 10);
    for (let i = uniqueDays.length - 1; i >= 0; i--) {
      const expected = new Date();
      expected.setDate(expected.getDate() - (uniqueDays.length - 1 - i));
      if (uniqueDays[i] === expected.toISOString().slice(0, 10)) currentStreak++;
      else break;
    }

    const first5 = scores.slice(0, 5);
    const last5 = scores.slice(-5);
    const first5Avg = first5.length ? first5.reduce((a, b) => a + b, 0) / first5.length : 0;
    const last5Avg = last5.length ? last5.reduce((a, b) => a + b, 0) / last5.length : 0;
    const improvementRate =
      first5Avg > 0 ? ((last5Avg - first5Avg) / first5Avg) * 100 : 0;

    const last30 = completedSessions.slice(-30);
    const byDate = new Map<string, number[]>();
    for (const s of last30) {
      if (!s.completedAt || s.overallScore == null) continue;
      const d = s.completedAt.toISOString().slice(0, 10);
      if (!byDate.has(d)) byDate.set(d, []);
      byDate.get(d)!.push(s.overallScore);
    }
    const scoreTrend = Array.from(byDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, arr]) => ({
        date,
        avgScore: arr.reduce((a, b) => a + b, 0) / arr.length,
      }));

    const byRole = new Map<string, { count: number; sum: number }>();
    for (const s of completedSessions) {
      if (s.overallScore == null) continue;
      const r = s.role;
      if (!byRole.has(r)) byRole.set(r, { count: 0, sum: 0 });
      const x = byRole.get(r)!;
      x.count++;
      x.sum += s.overallScore;
    }
    const roleBreakdown = Array.from(byRole.entries()).map(([role, { count, sum }]) => ({
      role,
      count,
      avgScore: sum / count,
    }));

    let dimensionAverages = {
      contentAccuracy: 0,
      communication: 0,
      problemSolving: 0,
      confidence: 0,
    };
    let dimCount = 0;
    for (const s of completedSessions) {
      for (const a of s.answers) {
        const f = a.feedback as { scores?: typeof dimensionAverages } | null;
        if (f?.scores) {
          dimensionAverages.contentAccuracy += f.scores.contentAccuracy ?? 0;
          dimensionAverages.communication += f.scores.communication ?? 0;
          dimensionAverages.problemSolving += f.scores.problemSolving ?? 0;
          dimensionAverages.confidence += f.scores.confidence ?? 0;
          dimCount++;
        }
      }
    }
    if (dimCount > 0) {
      dimensionAverages = {
        contentAccuracy: Math.round(dimensionAverages.contentAccuracy / dimCount),
        communication: Math.round(dimensionAverages.communication / dimCount),
        problemSolving: Math.round(dimensionAverages.problemSolving / dimCount),
        confidence: Math.round(dimensionAverages.confidence / dimCount),
      };
    }

    const recentSessions = completedSessions
      .slice(-5)
      .reverse()
      .map((s) => ({
        id: s.id,
        role: s.role,
        interviewType: s.interviewType,
        overallScore: s.overallScore,
        grade: s.grade,
        createdAt: s.completedAt?.toISOString() ?? s.createdAt.toISOString(),
        duration: s.duration,
      }));

    return NextResponse.json({
      totalSessions,
      avgScore: Math.round(avgScore * 10) / 10,
      currentStreak,
      improvementRate: Math.round(improvementRate * 10) / 10,
      scoreTrend,
      roleBreakdown,
      dimensionAverages,
      recentSessions,
    });
  } catch (error) {
    console.error("[DASHBOARD_STATS_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
