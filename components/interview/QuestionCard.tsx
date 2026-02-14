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
      <h3 className="text-sm font-semibold text-violet-700 mb-3">Current Question</h3>
      <Card className="flex-1 border-violet-100/50 bg-white/80 backdrop-blur-sm shadow-purple-sm rounded-2xl">
        <CardHeader className="pb-2">
          <span className="text-violet-500 text-sm font-medium">
            Question {currentQuestion.order} of {totalQuestions}
          </span>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-900 text-lg font-medium leading-relaxed">
            {currentQuestion.text}
          </p>
          {upcomingQuestions.length > 0 && (
            <div className="pt-4 border-t border-violet-100">
              <p className="text-violet-400 text-xs font-medium mb-2">Upcoming</p>
              <ul className="space-y-2">
                {upcomingQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="text-sm text-violet-400/80 line-clamp-2 blur-[2px] select-none"
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
        <Progress value={progressValue} className="h-2 bg-violet-100 [&>div]:gradient-purple" />
        <p className="text-xs text-violet-500 mt-1">
          {completedCount} of {totalQuestions} questions
        </p>
      </div>
    </div>
  );
}
