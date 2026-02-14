"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookOpen, MessageCircle, Trophy, Target } from "lucide-react";

interface Answer {
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
}

interface SessionSummaryProps {
  session: {
    id: string;
    overallScore: number | null;
    grade: string | null;
    userId: string;
    role: string;
    interviewType: string;
    difficulty: string;
    createdAt: string;
    duration: number;
    questions: { id: string; text: string; order: number }[];
    answers: Answer[];
    shareToken: string | null;
    isPublic: boolean;
    user?: { name: string | null };
  };
  className?: string;
}

export function SessionSummary({ session, className }: SessionSummaryProps) {
  const totalQuestions = session.questions.length;
  const answeredQuestions = session.answers.filter((a: Answer) => a.score !== null).length;
  const completionRate = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  
  // Extract key insights from feedback
  const allStrengths = session.answers
    .flatMap((a: Answer) => a.feedback?.strengths || [])
    .filter(Boolean)
    .slice(0, 3);
    
  const allImprovements = session.answers
    .flatMap((a: Answer) => a.feedback?.improvements || [])
    .filter(Boolean)
    .slice(0, 3);

  const totalFillerWords = session.answers.reduce(
    (sum: number, a: Answer) => sum + (a.feedback?.fillerWords?.count || 0),
    0
  );

  return (
    <Card className={cn("border-violet-100/50 shadow-purple-sm rounded-2xl", className)}>
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-600" />
          Session Summary
        </CardTitle>
        <p className="text-sm text-violet-700/60">
          Key highlights and performance overview
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-violet-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-violet-700">{totalQuestions}</div>
            <div className="text-sm text-violet-600">Questions</div>
          </div>
          
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-700">{answeredQuestions}</div>
            <div className="text-sm text-emerald-600">Answered</div>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-700">{completionRate}%</div>
            <div className="text-sm text-amber-600">Completion</div>
          </div>
          
          {session.overallScore !== null && (
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{Math.round(session.overallScore)}</div>
              <div className="text-sm text-purple-600">Score</div>
            </div>
          )}
        </div>

        {/* Performance Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          {allStrengths.length > 0 && (
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-emerald-800">Key Strengths</h3>
              </div>
              <ul className="space-y-2">
                {allStrengths.map((strength: string, i: number) => (
                  <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {allImprovements.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-800">Focus Areas</h3>
              </div>
              <ul className="space-y-2">
                {allImprovements.map((improvement: string, i: number) => (
                  <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Filler Words Summary */}
        {totalFillerWords > 0 && (
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-rose-600" />
                <span className="font-semibold text-rose-800">Communication Patterns</span>
              </div>
              <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                {totalFillerWords} filler words
              </Badge>
            </div>
            <p className="text-sm text-rose-700">
              You used {totalFillerWords} filler words during the session. 
              Try pausing briefly instead of saying "um" or "uh" to improve fluency.
            </p>
          </div>
        )}

        {/* Session Context */}
        <div className="bg-violet-50 rounded-xl p-4">
          <h3 className="font-semibold text-violet-800 mb-2">Session Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-violet-600">Role:</span>
              <span className="ml-2 font-medium text-violet-800">{session.role}</span>
            </div>
            <div>
              <span className="text-violet-600">Type:</span>
              <span className="ml-2 font-medium text-violet-800 capitalize">{session.interviewType}</span>
            </div>
            <div>
              <span className="text-violet-600">Difficulty:</span>
              <span className="ml-2 font-medium text-violet-800 capitalize">{session.difficulty}</span>
            </div>
            <div>
              <span className="text-violet-600">Duration:</span>
              <span className="ml-2 font-medium text-violet-800">{session.duration} min</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}