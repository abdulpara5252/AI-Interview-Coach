"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { getScoreColor, getGradeColor } from "@/lib/utils";
import { QuestionFeedback } from "./QuestionFeedback";
import { CheckCircle2, TrendingUp, Copy, Share2, Lock, Globe } from "lucide-react";

interface SessionFeedback {
  id: string;
  overallScore: number | null;
  grade: string | null;
  feedback: unknown;
  userId: string;
  role: string;
  createdAt: string;
  duration: number;
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
  user: { name: string | null };
}

interface FeedbackReportProps {
  session: SessionFeedback;
  onShare?: () => void;
}

const SCORE_COLORS = {
  contentAccuracy: "text-blue-600",
  communication: "text-purple-600",
  problemSolving: "text-green-600",
  confidence: "text-orange-600",
};

const SCORE_BG_COLORS = {
  contentAccuracy: "bg-blue-50 border-blue-200",
  communication: "bg-purple-50 border-purple-200",
  problemSolving: "bg-green-50 border-green-200",
  confidence: "bg-orange-50 border-orange-200",
};

function getScoreBarColor(score: number) {
  if (score >= 70) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

function getGradeGradient(grade: string) {
  const gradeMap: Record<string, string> = {
    A: "from-green-600 to-green-400",
    B: "from-blue-600 to-blue-400",
    C: "from-yellow-600 to-yellow-400",
    D: "from-orange-600 to-orange-400",
    F: "from-red-600 to-red-400",
  };
  return gradeMap[grade] || "from-gray-600 to-gray-400";
}

export function FeedbackReport({ session, onShare }: FeedbackReportProps) {
  const score = session.overallScore ?? 0;
  const grade = session.grade ?? "—";
  const [isPublic, setIsPublic] = useState(session.isPublic);
  const [copied, setCopied] = useState(false);

  const allStrengths = session.answers
    .flatMap((a) => a.feedback?.strengths || [])
    .slice(0, 3);

  const allImprovements = session.answers
    .flatMap((a) => a.feedback?.improvements || [])
    .slice(0, 3);

  const totalFillerWords = session.answers.reduce(
    (sum, a) => sum + (a.feedback?.fillerWords.count || 0),
    0
  );

  const allFillerExamples = [
    ...new Set(
      session.answers.flatMap((a) => a.feedback?.fillerWords.examples || [])
    ),
  ].slice(0, 5);

  const avgScores = {
    contentAccuracy:
      Math.round(
        session.answers.reduce((sum, a) => sum + (a.feedback?.scores.contentAccuracy || 0), 0) /
          Math.max(session.answers.length, 1)
      ) || 0,
    communication:
      Math.round(
        session.answers.reduce((sum, a) => sum + (a.feedback?.scores.communication || 0), 0) /
          Math.max(session.answers.length, 1)
      ) || 0,
    problemSolving:
      Math.round(
        session.answers.reduce((sum, a) => sum + (a.feedback?.scores.problemSolving || 0), 0) /
          Math.max(session.answers.length, 1)
      ) || 0,
    confidence:
      Math.round(
        session.answers.reduce((sum, a) => sum + (a.feedback?.scores.confidence || 0), 0) /
          Math.max(session.answers.length, 1)
      ) || 0,
  };

  const handleCopyLink = () => {
    if (session?.shareToken) {
      const url = `${typeof window !== "undefined" ? window.location.origin : ""}/report/${session.shareToken}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="space-y-2">
            <p className="text-sm text-slate-300">Candidate</p>
            <h1 className="text-3xl font-bold">{session.user.name || "Candidate"}</h1>
            <p className="text-slate-300">{session.role}</p>
          </div>
          <div className="space-y-3 md:col-span-2 md:text-right">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center md:justify-end">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <span className="text-sm text-slate-300">Date:</span>
                <span className="font-semibold">{formatDate(session.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <span className="text-sm text-slate-300">Duration:</span>
                <span className="font-semibold">{session.duration} min</span>
              </div>
              <div
                className={`bg-gradient-to-r ${getGradeGradient(grade)} rounded-lg px-4 py-2 font-bold text-lg`}
              >
                Grade: {grade}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animated Circular Score */}
        <Card className="lg:col-span-1 border-0 shadow-md">
          <CardContent className="pt-8 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 mb-6">
              <svg
                className="transform -rotate-90 w-full h-full"
                viewBox="0 0 120 120"
              >
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#f0f4f8"
                  strokeWidth="6"
                />
                {/* Progress circle with gradient */}
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="6"
                  strokeDasharray={`${(score / 100) * 339.29} 339.29`}
                  strokeLinecap="round"
                  style={{
                    transition: "stroke-dasharray 0.8s ease-in-out",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-slate-900">{score}</p>
                  <p className="text-sm text-slate-500">/ 100</p>
                </div>
              </div>
            </div>
            <p className="text-center text-slate-600 font-medium">Overall Score</p>
          </CardContent>
        </Card>

        {/* Score Dimensions */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(avgScores).map(([key, value]) => {
              const displayKey = key
                .replace(/([A-Z])/g, " $1")
                .trim()
                .split(" ")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

              return (
                <div
                  key={key}
                  className={`p-3 rounded-lg border ${
                    SCORE_BG_COLORS[key as keyof typeof SCORE_BG_COLORS]
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold ${SCORE_COLORS[key as keyof typeof SCORE_COLORS]}`}>
                      {displayKey}
                    </span>
                    <span className="text-2xl font-bold text-slate-900">{value}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(value)}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allStrengths.length > 0 ? (
              allStrengths.map((strength, i) => (
                <div key={i} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-slate-700">{strength}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No strengths recorded yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Improvements */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allImprovements.length > 0 ? (
              allImprovements.map((improvement, i) => (
                <div key={i} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-slate-700">{improvement}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No improvements needed.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filler Words Card */}
      {totalFillerWords > 0 && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-lg">Filler Words Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 rounded-full p-4">
                <p className="text-2xl font-bold text-orange-600">{totalFillerWords}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Total Filler Words</p>
                <p className="text-sm text-slate-600">Words like "um", "uh", "like", etc.</p>
              </div>
            </div>
            {allFillerExamples.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Examples found:</p>
                <div className="flex flex-wrap gap-2">
                  {allFillerExamples.map((word, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-yellow-200 text-slate-800 rounded-full text-sm font-medium"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Question Breakdown */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Question Breakdown</CardTitle>
          <p className="text-sm text-slate-600 mt-2">
            Click to expand each question and see detailed feedback
          </p>
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

      {/* Share Section */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-slate-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-lg">Share Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="w-5 h-5 text-blue-600" />
              ) : (
                <Lock className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <p className="font-semibold text-slate-900">
                  {isPublic ? "Public" : "Private"} Report
                </p>
                <p className="text-sm text-slate-600">
                  {isPublic
                    ? "Anyone with the link can view this report"
                    : "Only you can access this report"}
                </p>
              </div>
            </div>
            <Button
              variant={isPublic ? "default" : "outline"}
              onClick={() => setIsPublic(!isPublic)}
              className="rounded-lg"
            >
              {isPublic ? "Make Private" : "Make Public"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCopyLink}
              className="flex-1 rounded-lg gap-2"
              variant="outline"
              disabled={!session.shareToken}
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button className="flex-1 rounded-lg gap-2" variant="outline">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
