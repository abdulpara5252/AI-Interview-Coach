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
      <AccordionItem value={`q-${index}`} className="border-b border-violet-100">
        <AccordionTrigger className="hover:no-underline py-4">
          <span className="flex items-center gap-3 text-left">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl gradient-purple text-sm font-semibold text-white shadow-purple-sm">
              {index + 1}
            </span>
            <span className="text-gray-700">{questionText.substring(0, 50)}...</span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="bg-violet-50/50 p-4 rounded-xl">
          <p className="text-sm font-medium text-gray-900 mb-2">{questionText}</p>
          <p className="text-sm text-violet-700/60">Feedback generation in progress...</p>
        </AccordionContent>
      </AccordionItem>
    );
  }

  const { scores, grade, strengths, improvements, fillerWords, tip, idealAnswerSummary } = feedback;

  function getMetricColor(score: number) {
    if (score >= 70) return "text-violet-600";
    if (score >= 50) return "text-amber-600";
    return "text-rose-600";
  }

  function getMetricBarColor(score: number) {
    if (score >= 70) return "bg-violet-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  }

  return (
    <AccordionItem value={`q-${index}`} className="border-b border-violet-100">
      <AccordionTrigger className="hover:no-underline py-4 group">
        <span className="flex items-center gap-3 text-left flex-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl gradient-purple text-sm font-semibold text-white shadow-purple-sm flex-shrink-0">
            {index + 1}
          </span>
          <span className="text-gray-700 flex-1 group-hover:text-gray-900 transition-colors">
            {questionText.substring(0, 60)}
            {questionText.length > 60 ? "..." : ""}
          </span>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <Badge className={`${getGradeColor(grade)} font-bold`}>
              {grade}
            </Badge>
            <span className={`font-bold ${getMetricColor(feedback.overallScore)}`}>
              {feedback.overallScore}%
            </span>
          </div>
        </span>
      </AccordionTrigger>
      <AccordionContent className="bg-violet-50/30 p-6 rounded-xl space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Full Question</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{questionText}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Content Accuracy", value: scores.contentAccuracy },
            { label: "Communication", value: scores.communication },
            { label: "Problem Solving", value: scores.problemSolving },
            { label: "Confidence", value: scores.confidence },
          ].map((metric, i) => (
            <div key={i} className="bg-white rounded-xl p-3 border border-violet-100 shadow-purple-sm">
              <p className="text-xs text-violet-700/60 font-medium mb-1">{metric.label}</p>
              <p className={`text-2xl font-bold ${getMetricColor(metric.value)}`}>
                {metric.value}
              </p>
              <div className="h-1.5 bg-violet-100 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getMetricBarColor(metric.value)}`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {idealAnswerSummary && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Ideal Answer Summary</h4>
            <p className="text-sm text-gray-700">{idealAnswerSummary}</p>
          </div>
        )}

        {strengths.length > 0 && (
          <div>
            <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
              ✓ Strengths
            </h4>
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {improvements.length > 0 && (
          <div>
            <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
              ↑ Areas for Improvement
            </h4>
            <ul className="space-y-2">
              {improvements.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {fillerWords.count > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Filler Words: {fillerWords.count}
            </h4>
            {fillerWords.examples.length > 0 && (
              <p className="text-sm text-gray-700">
                Examples:{" "}
                {fillerWords.examples.slice(0, 3).join(", ")}
                {fillerWords.examples.length > 3 && `, +${fillerWords.examples.length - 3} more`}
              </p>
            )}
          </div>
        )}

        {tip && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <h4 className="font-semibold text-violet-900 mb-1">Pro Tip</h4>
            <p className="text-sm text-gray-700">{tip}</p>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
