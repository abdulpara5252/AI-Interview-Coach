"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getScoreColor, getGradeColor } from "@/lib/utils";

interface AnswerFeedback {
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

interface QuestionFeedbackProps {
  questionText: string;
  feedback: AnswerFeedback | null;
  index: number;
}

export function QuestionFeedback({
  questionText,
  feedback,
  index,
}: QuestionFeedbackProps) {
  if (!feedback) {
    return (
      <AccordionItem value={`q-${index}`}>
        <AccordionTrigger>Question {index + 1}</AccordionTrigger>
        <AccordionContent>
          <p className="text-muted-foreground text-sm">{questionText}</p>
          <p className="text-muted-foreground text-sm mt-2">No feedback yet.</p>
        </AccordionContent>
      </AccordionItem>
    );
  }

  const { scores, grade, strengths, improvements, fillerWords, tip } = feedback;

  return (
    <AccordionItem value={`q-${index}`}>
      <AccordionTrigger className="hover:no-underline">
        <span className="flex items-center gap-2">
          Question {index + 1}
          <Badge variant="secondary" className={getGradeColor(grade)}>
            {grade}
          </Badge>
          <span className={getScoreColor(scores.contentAccuracy)}>
            {feedback.overallScore}%
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4">
        <p className="text-sm font-medium">{questionText}</p>
        <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          <div>
            <span className="text-muted-foreground">Content</span>
            <p className={getScoreColor(scores.contentAccuracy)}>{scores.contentAccuracy}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Communication</span>
            <p className={getScoreColor(scores.communication)}>{scores.communication}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Problem solving</span>
            <p className={getScoreColor(scores.problemSolving)}>{scores.problemSolving}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Confidence</span>
            <p className={getScoreColor(scores.confidence)}>{scores.confidence}</p>
          </div>
        </div>
        {strengths.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-600">Strengths</h4>
            <ul className="list-inside list-disc text-sm">
              {strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {improvements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-amber-600">Improvements</h4>
            <ul className="list-inside list-disc text-sm">
              {improvements.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {fillerWords.count > 0 && (
          <p className="text-muted-foreground text-sm">
            Filler words: {fillerWords.count}
            {fillerWords.examples.length > 0 &&
              ` (e.g. ${fillerWords.examples.slice(0, 3).join(", ")})`}
          </p>
        )}
        {tip && (
          <p className="rounded-md bg-muted p-2 text-sm">
            <strong>Tip:</strong> {tip}
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
