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

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Body must be an object" }, { status: 400 });
    }

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

    let content: string | null = null;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: "Generate the questions now. Return a JSON object with a 'questions' key containing the array." },
        ],
        response_format: { type: "json_object" },
      });
      content = completion.choices[0]?.message?.content ?? null;
    } catch (openaiError: unknown) {
      const errMsg = openaiError instanceof Error ? openaiError.message : "Unknown OpenAI error";
      console.error("[SESSION_CREATE_OPENAI_ERROR]", errMsg);
      return NextResponse.json(
        { error: "Failed to generate questions", details: process.env.NODE_ENV === "development" ? errMsg : undefined },
        { status: 502 }
      );
    }

    if (!content) {
      return NextResponse.json({ error: "No questions generated — empty OpenAI response" }, { status: 500 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("[SESSION_CREATE_PARSE_ERROR]", content.substring(0, 500));
      return NextResponse.json({ error: "Invalid question JSON from AI" }, { status: 500 });
    }

    // GPT-4o json_object mode always returns an object; questions may be at top level or nested
    let rawQuestions: unknown[];
    if (Array.isArray(parsed)) {
      rawQuestions = parsed;
    } else if (parsed && typeof parsed === "object") {
      // Try common keys: "questions", "interview_questions", or first array-valued key
      const obj = parsed as Record<string, unknown>;
      if (Array.isArray(obj.questions)) {
        rawQuestions = obj.questions;
      } else {
        const firstArrayKey = Object.keys(obj).find((k) => Array.isArray(obj[k]));
        rawQuestions = firstArrayKey ? (obj[firstArrayKey] as unknown[]) : [];
      }
    } else {
      rawQuestions = [];
    }

    if (rawQuestions.length === 0) {
      console.error("[SESSION_CREATE_EMPTY]", JSON.stringify(parsed).substring(0, 500));
      return NextResponse.json({ error: "No questions in AI response" }, { status: 500 });
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
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[SESSION_CREATE_ERROR]", errMsg, error);
    return NextResponse.json(
      { error: "Internal server error", details: process.env.NODE_ENV === "development" ? errMsg : undefined },
      { status: 500 }
    );
  }
}
