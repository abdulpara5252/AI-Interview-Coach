import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAppUser } from "@/lib/auth";
import { type FeedbackReport, type InterviewDimensionScores } from "@/lib/types";

const zeroDimensions: InterviewDimensionScores = {
  content: 0,
  communication: 0,
  problemSolving: 0,
  confidence: 0
};

export async function GET() {
  const result = await requireAppUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const sessions = await prisma.session.findMany({
    where: { userId: result.user.id, status: "completed" },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true, overallScore: true, role: true, feedback: true }
  });

  const scores = sessions.map((s) => s.overallScore ?? 0);
  const avgScore = scores.length ? Number((scores.reduce((acc, cur) => acc + cur, 0) / scores.length).toFixed(1)) : 0;
  const improvementRate = scores.length > 1 ? Number((scores[scores.length - 1] - scores[0]).toFixed(1)) : 0;

  const dimensions = sessions.reduce<InterviewDimensionScores>((acc, session) => {
    const report = session.feedback as FeedbackReport | null;
    if (!report?.dimensions) return acc;
    acc.content += report.dimensions.content;
    acc.communication += report.dimensions.communication;
    acc.problemSolving += report.dimensions.problemSolving;
    acc.confidence += report.dimensions.confidence;
    return acc;
  }, { ...zeroDimensions });

  const count = sessions.filter((s) => Boolean((s.feedback as FeedbackReport | null)?.dimensions)).length || 1;
  const dimensionAverage: InterviewDimensionScores = {
    content: Number((dimensions.content / count).toFixed(1)),
    communication: Number((dimensions.communication / count).toFixed(1)),
    problemSolving: Number((dimensions.problemSolving / count).toFixed(1)),
    confidence: Number((dimensions.confidence / count).toFixed(1))
  };

  const roleBuckets = new Map<string, { total: number; n: number }>();
  for (const session of sessions) {
    const bucket = roleBuckets.get(session.role) ?? { total: 0, n: 0 };
    bucket.total += session.overallScore ?? 0;
    bucket.n += 1;
    roleBuckets.set(session.role, bucket);
  }

  return NextResponse.json({
    sessionsCount: sessions.length,
    avgScore,
    improvementRate,
    trend: sessions.map((s) => ({ date: s.createdAt.toISOString().slice(0, 10), score: s.overallScore ?? 0 })),
    dimensionAverage,
    roleBreakdown: Array.from(roleBuckets.entries()).map(([role, value]) => ({
      role,
      avgScore: Number((value.total / value.n).toFixed(1))
    }))
  });
}
