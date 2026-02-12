"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  currentQuestion: { text: string; order: number };
  totalQuestions: number;
  upcomingQuestions?: { text: string }[];
  className?: string;
}

export function QuestionCard({
  currentQuestion,
  totalQuestions,
  upcomingQuestions = [],
  className,
}: QuestionCardProps) {
  const completedCount = Math.min(currentQuestion.order, totalQuestions);
  const progressValue = totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Current Question</h3>
      <Card className="flex-1 border-slate-700/50 bg-slate-800/30">
        <CardHeader className="pb-2">
          <span className="text-slate-400 text-sm">
            Question {currentQuestion.order} of {totalQuestions}
          </span>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-100 text-lg font-medium leading-relaxed">
            {currentQuestion.text}
          </p>
          {upcomingQuestions.length > 0 && (
            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-slate-500 text-xs font-medium mb-2">Upcoming</p>
              <ul className="space-y-2">
                {upcomingQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="text-sm text-slate-500/80 line-clamp-2 blur-[2px] select-none"
                  >
                    {q.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-4">
        <Progress value={progressValue} className="h-2 bg-slate-700 [&>div]:bg-blue-500" />
        <p className="text-xs text-slate-500 mt-1">
          {completedCount} of {totalQuestions} questions
        </p>
      </div>
    </div>
  );
}
