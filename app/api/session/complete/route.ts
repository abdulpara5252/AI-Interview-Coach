import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

const ANSWER_EVALUATION_PROMPT = `You are a senior engineering interview coach.
Evaluate the following interview answer and return a structured JSON feedback object.

Question: {question}
Ideal Answer: {idealAnswer}
Candidate Answer (transcribed): {transcript}
Role: {role} | Difficulty: {difficulty}

Evaluate on these dimensions (0-100):
1. contentAccuracy: Is the answer technically correct and complete?
2. communication: Is it clear, structured, and concise?
3. problemSolving: Did they show logical thinking and discuss trade-offs?
4. confidence: Based on transcript markers (filler words, hesitation, direct language)

Return ONLY valid JSON, no markdown fences:
{
  "scores": {
    "contentAccuracy": 0-100,
    "communication": 0-100,
    "problemSolving": 0-100,
    "confidence": 0-100
  },
  "overallScore": 0-100,
  "grade": "A+|A|B+|B|C+|C|D|F",
  "strengths": ["...", "...", "..."],
  "improvements": ["...", "...", "..."],
  "idealAnswerSummary": "...",
  "fillerWords": { "count": 0, "examples": ["..."] },
  "tip": "One specific, actionable tip for next time"
}
`;

function calculateGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "B+";
  if (score >= 80) return "B";
  if (score >= 75) return "C+";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

const WEIGHTS = {
  contentAccuracy: 0.4,
  communication: 0.25,
  problemSolving: 0.2,
  confidence: 0.15,
} as const;

interface AnswerFeedbackJson {
  scores: {
    contentAccuracy: number;
    communication: number;
    problemSolving: number;
    confidence: number;
  };
  overallScore: number;
  grade: string;
  strengths: string[];
  improvements: string[];
  idealAnswerSummary: string;
  fillerWords: { count: number; examples: string[] };
  tip: string;
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

    const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
    const transcriptItems = Array.isArray(body.transcript) ? body.transcript : [];
    const audioUrl = typeof body.audioUrl === "string" ? body.audioUrl : null;

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: user.id },
      include: { questions: { orderBy: { order: "asc" } } },
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const fullTranscript =
      transcriptItems
        .map((x: { speaker?: string; text?: string }) =>
          typeof x.text === "string"
            ? `${x.speaker === "user" ? "Candidate" : "Interviewer"}: ${x.text}`
            : ""
        )
        .filter(Boolean)
        .join("\n") || "No transcript provided.";

    let weightedSum = 0;
    let weightTotal = 0;

    for (const question of session.questions) {
      const prompt = ANSWER_EVALUATION_PROMPT.replace("{question}", question.text)
        .replace("{idealAnswer}", question.idealAnswer ?? "N/A")
        .replace("{transcript}", fullTranscript)
        .replace("{role}", session.role)
        .replace("{difficulty}", session.difficulty);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You return only valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      let parsed: AnswerFeedbackJson;
      try {
        parsed = JSON.parse(content ?? "{}") as AnswerFeedbackJson;
      } catch {
        parsed = {
          scores: {
            contentAccuracy: 50,
            communication: 50,
            problemSolving: 50,
            confidence: 50,
          },
          overallScore: 50,
          grade: "C",
          strengths: [],
          improvements: [],
          idealAnswerSummary: "",
          fillerWords: { count: 0, examples: [] },
          tip: "Try to expand on your answers with examples.",
        };
      }

      const s = parsed.scores;
      weightedSum +=
        s.contentAccuracy * WEIGHTS.contentAccuracy +
        s.communication * WEIGHTS.communication +
        s.problemSolving * WEIGHTS.problemSolving +
        s.confidence * WEIGHTS.confidence;
      weightTotal +=
        WEIGHTS.contentAccuracy +
        WEIGHTS.communication +
        WEIGHTS.problemSolving +
        WEIGHTS.confidence;

      await prisma.answer.create({
        data: {
          questionId: question.id,
          sessionId: session.id,
          transcript: fullTranscript,
          score: parsed.overallScore,
          feedback: parsed as object,
          duration: 0,
        },
      });
    }

    const overallScore = weightTotal > 0 ? Math.round(weightedSum / weightTotal) : 0;
    const grade = calculateGrade(overallScore);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        status: "completed",
        overallScore,
        grade,
        completedAt: new Date(),
        transcript: transcriptItems,
        audioUrl,
        feedback: { overallScore, grade },
      },
    });

    const report = await prisma.session.findUnique({
      where: { id: session.id },
      include: {
        answers: { include: { question: true }, orderBy: { createdAt: "asc" } },
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("[SESSION_COMPLETE_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
