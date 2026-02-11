import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInterviewQuestions } from "@/lib/ai/openai";
import { requireAppUser } from "@/lib/auth";
import { createSessionSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const result = await requireAppUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const parsed = createSessionSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid interview payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const generatedQuestions = await generateInterviewQuestions(payload);

  const session = await prisma.session.create({
    data: {
      userId: result.user.id,
      role: payload.role,
      interviewType: payload.interviewType,
      difficulty: payload.difficulty,
      duration: payload.duration,
      status: "in_progress",
      questions: {
        create: generatedQuestions.map((q, idx) => ({
          text: String(q.text ?? `Question ${idx + 1}`),
          type: String(q.type ?? payload.interviewType),
          difficulty: String(q.difficulty ?? payload.difficulty),
          category: String(q.category ?? "general"),
          idealAnswer: q.idealAnswer ? String(q.idealAnswer) : null,
          order: idx + 1
        }))
      }
    },
    include: { questions: { orderBy: { order: "asc" } } }
  });

  return NextResponse.json(session, { status: 201 });
}
