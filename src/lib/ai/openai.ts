import OpenAI from "openai";
import { type FeedbackReport } from "@/lib/types";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function generateInterviewQuestions(input: {
  role: string;
  interviewType: string;
  difficulty: string;
  count?: number;
}) {
  const count = input.count ?? 5;
  const systemPrompt = `You are an expert technical interviewer at a top-tier tech company. Generate exactly ${count} interview questions for a ${input.difficulty} difficulty ${input.role} interview. Interview Type: ${input.interviewType}. Return ONLY valid JSON with this shape: {"questions":[{"text":"...","type":"technical|behavioral|mixed","category":"...","difficulty":"easy|medium|hard","idealAnswer":"...","followUps":["..."]}]}`;

  const completion = await openai.responses.create({
    model: "gpt-4o",
    input: systemPrompt
  });

  const parsed = safeJsonParse<{ questions: Array<Record<string, any>> }>(completion.output_text || "", { questions: [] });
  return parsed.questions ?? [];
}

export function toLetterGrade(score: number) {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 65) return "D";
  return "F";
}

export async function evaluateSession(input: {
  role: string;
  transcript: string;
  questions: Array<{ text: string; idealAnswer?: string | null; difficulty: string }>;
}) {
  const systemPrompt = `You are a senior engineering interview coach. Evaluate this completed interview and return JSON only with keys: dimensions(content,communication,problemSolving,confidence), overallScore, grade, strengths, improvements, fillerWords, resources, perQuestion. Role: ${input.role}. Transcript: ${input.transcript}. Questions: ${JSON.stringify(input.questions)}.`;

  const completion = await openai.responses.create({
    model: "gpt-4o",
    input: systemPrompt
  });

  const parsed = safeJsonParse<Partial<FeedbackReport> & { resources?: string[]; grade?: string }>(completion.output_text || "", {});

  return {
    overallScore: parsed.overallScore ?? 0,
    grade: parsed.grade ?? toLetterGrade(parsed.overallScore ?? 0),
    dimensions: parsed.dimensions ?? {
      content: 0,
      communication: 0,
      problemSolving: 0,
      confidence: 0
    },
    strengths: parsed.strengths ?? [],
    improvements: parsed.improvements ?? [],
    fillerWords: parsed.fillerWords ?? 0,
    perQuestion: parsed.perQuestion ?? [],
    resources: parsed.resources ?? []
  };
}
