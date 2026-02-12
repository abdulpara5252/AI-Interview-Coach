"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  currentQuestion: { text: string; order: number };
  totalQuestions: number;
  upcomingPreview?: string;
  className?: string;
}

export function QuestionCard({
  currentQuestion,
  totalQuestions,
  upcomingPreview,
  className,
}: QuestionCardProps) {
  const progress = totalQuestions > 0 ? (currentQuestion.order / totalQuestions) * 100 : 0;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <span className="text-muted-foreground text-sm">
          Question {currentQuestion.order} of {totalQuestions}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground font-medium">{currentQuestion.text}</p>
        <Progress value={progress} className="h-2" />
        {upcomingPreview && (
          <p className="text-muted-foreground text-sm line-clamp-2">{upcomingPreview}</p>
        )}
      </CardContent>
    </Card>
  );
}
