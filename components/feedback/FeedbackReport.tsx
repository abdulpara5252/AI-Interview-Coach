"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { getScoreColor, getGradeColor } from "@/lib/utils";
import { QuestionFeedback } from "./QuestionFeedback";

interface SessionFeedback {
  id: string;
  overallScore: number | null;
  grade: string | null;
  feedback: unknown;
  questions: { id: string; text: string; order: number }[];
  answers: {
    id: string;
    questionId: string;
    score: number | null;
    feedback: {
      scores: { contentAccuracy: number; communication: number; problemSolving: number; confidence: number };
      overallScore: number;
      grade: string;
      strengths: string[];
      improvements: string[];
      idealAnswerSummary: string;
      fillerWords: { count: number; examples: string[] };
      tip: string;
    } | null;
    question: { text: string };
  }[];
  shareToken: string | null;
  isPublic: boolean;
}

interface FeedbackReportProps {
  session: SessionFeedback;
  onShare?: () => void;
}

export function FeedbackReport({ session, onShare }: FeedbackReportProps) {
  const score = session.overallScore ?? 0;
  const grade = session.grade ?? "—";

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Interview feedback</CardTitle>
          <div className="mx-auto flex flex-col items-center gap-4 pt-4">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary text-2xl font-bold"
              style={{
                background: `conic-gradient(var(--primary) ${score * 3.6}deg, var(--muted) 0deg)`,
              }}
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-background text-2xl">
                {score}
              </span>
            </div>
            <div className={getGradeColor(grade)}>
              <span className="text-2xl font-semibold">Grade: {grade}</span>
            </div>
            <Progress value={score} className="h-2 w-48" />
            {session.shareToken && (
              <Button variant="outline" size="sm" onClick={onShare}>
                Share report
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Per-question feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {session.questions.map((q, i) => {
              const answer = session.answers.find((a) => a.questionId === q.id) ?? session.answers[i];
              return (
                <QuestionFeedback
                  key={q.id}
                  questionText={q.text}
                  feedback={answer?.feedback ?? null}
                  index={i}
                />
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
