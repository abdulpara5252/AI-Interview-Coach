import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateSession } from "@/lib/ai/openai";
import { requireAppUser } from "@/lib/auth";
import { completeSessionSchema } from "@/lib/validators";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const result = await requireAppUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const parsedBody = completeSessionSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid completion payload", details: parsedBody.error.flatten() }, { status: 400 });
  }

  const session = await prisma.session.findFirst({
    where: { id: params.id, userId: result.user.id },
    include: { questions: { orderBy: { order: "asc" } } }
  });

  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const transcriptText = parsedBody.data.transcript.map((line) => `${line.speaker}: ${line.text}`).join("\n");

  const feedback = await evaluateSession({
    role: session.role,
    transcript: transcriptText,
    questions: session.questions.map((q) => ({ text: q.text, idealAnswer: q.idealAnswer, difficulty: q.difficulty }))
  });

  const updated = await prisma.session.update({
    where: { id: session.id },
    data: {
      status: parsedBody.data.status,
      completedAt: new Date(),
      transcript: parsedBody.data.transcript,
      feedback,
      overallScore: Number(feedback.overallScore ?? 0),
      grade: String(feedback.grade ?? "F"),
      audioUrl: parsedBody.data.audioUrl
    }
  });

  return NextResponse.json(updated);
}
