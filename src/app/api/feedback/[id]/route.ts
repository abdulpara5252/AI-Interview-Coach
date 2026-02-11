import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAppUser } from "@/lib/auth";
import { type FeedbackReport } from "@/lib/types";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const result = await requireAppUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const session = await prisma.session.findFirst({
    where: { id: params.id, userId: result.user.id },
    include: { questions: { orderBy: { order: "asc" } } }
  });

  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const fallback: FeedbackReport = {
    overallScore: 74,
    grade: "C",
    dimensions: { content: 72, communication: 70, problemSolving: 78, confidence: 75 },
    strengths: ["Structured responses", "Relevant examples", "Calm pacing"],
    improvements: ["Reduce filler words", "Clarify trade-offs", "Add measurable outcomes"],
    fillerWords: 18,
    resources: ["https://leetcode.com", "https://www.pramp.com"],
    perQuestion: session.questions.map((q) => ({
      question: q.text,
      score: 75,
      feedback: "Solid answer with room for depth.",
      idealAnswerSummary: q.idealAnswer ?? "Use STAR + technical specifics.",
      tip: "Add one concrete metric or trade-off in your next answer."
    }))
  };

  return NextResponse.json((session.feedback as FeedbackReport | null) ?? fallback);
}
