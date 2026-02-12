import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { ROLES, INTERVIEW_TYPES, DIFFICULTIES } from "@/types";

const QUESTION_GENERATION_SYSTEM = `You are an expert technical interviewer at a top-tier tech company.
Generate exactly {count} interview questions for a {difficulty} difficulty {role} interview.
Interview Type: {interviewType}

Rules:
- Questions must be realistic and representative of actual interviews at FAANG/top-tier companies
- For "technical" type: focus on core skills, algorithms, system design, debugging scenarios
- For "behavioral" type: use STAR-format prompts (Situation, Task, Action, Result)
- For "mixed": alternate between technical and behavioral
- Vary difficulty even within the set
- Include at least one follow-up setup question per main question
- Return ONLY a JSON array, no additional text, no markdown fences

JSON format:
[{
  "id": "q1",
  "text": "...",
  "type": "technical|behavioral",
  "category": "...",
  "difficulty": "easy|medium|hard",
  "idealAnswer": "...",
  "followUps": ["..."]
}]
`;

interface GeneratedQuestion {
  id: string;
  text: string;
  type: string;
  category: string;
  difficulty: string;
  idealAnswer?: string;
  followUps?: string[];
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const role = typeof body.role === "string" ? body.role.trim() : "";
    const interviewType = typeof body.interviewType === "string" ? body.interviewType.trim() : "";
    const difficulty = typeof body.difficulty === "string" ? body.difficulty.trim() : "";
    const duration = typeof body.duration === "number" ? body.duration : 30;

    if (!role || !ROLES.includes(role as (typeof ROLES)[number])) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    if (!interviewType || !INTERVIEW_TYPES.includes(interviewType as (typeof INTERVIEW_TYPES)[number])) {
      return NextResponse.json({ error: "Invalid interview type" }, { status: 400 });
    }
    if (!difficulty || !DIFFICULTIES.includes(difficulty as (typeof DIFFICULTIES)[number])) {
      return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 });
    }

    const count = Math.floor(duration / 5) || 6;
    const prompt = QUESTION_GENERATION_SYSTEM.replace(/\{count\}/g, String(count))
      .replace(/\{difficulty\}/g, difficulty)
      .replace(/\{role\}/g, role)
      .replace(/\{interviewType\}/g, interviewType);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: "Generate the questions now." },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No questions generated" }, { status: 500 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: "Invalid question JSON" }, { status: 500 });
    }

    const rawQuestions = Array.isArray(parsed)
      ? parsed
      : (parsed as { questions?: unknown[] })?.questions ?? [];
    if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
      return NextResponse.json({ error: "No questions in response" }, { status: 500 });
    }

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        role,
        interviewType,
        difficulty,
        duration,
        status: "in_progress",
      },
    });

    const questionsToCreate = (rawQuestions as GeneratedQuestion[]).slice(0, 20).map((q, i) => ({
      sessionId: session.id,
      text: typeof q.text === "string" ? q.text : String(q.text),
      type: typeof q.type === "string" ? q.type : "technical",
      difficulty: typeof q.difficulty === "string" ? q.difficulty : difficulty,
      category: typeof q.category === "string" ? q.category : "general",
      idealAnswer: typeof q.idealAnswer === "string" ? q.idealAnswer : null,
      order: i + 1,
    }));

    await prisma.question.createMany({ data: questionsToCreate });

    return NextResponse.json({
      sessionId: session.id,
      questions: await prisma.question.findMany({
        where: { sessionId: session.id },
        orderBy: { order: "asc" },
      }),
    });
  } catch (error) {
    console.error("[SESSION_CREATE_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
