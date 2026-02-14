"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { getScoreColor, getGradeColor } from "@/lib/utils";
import { QuestionFeedback } from "./QuestionFeedback";
import { TranscriptDisplay } from "./TranscriptDisplay";
import { AudioPlayer } from "./AudioPlayer";
import { SessionSummary } from "./SessionSummary";
import { CheckCircle2, TrendingUp, Copy, Share2, Lock, Globe, Loader2 } from "lucide-react";

interface SessionFeedback {
  id: string;
  overallScore: number | null;
  grade: string | null;
  feedback: unknown;
  userId: string;
  role: string;
  interviewType: string;
  difficulty: string;
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
  transcript?: { speaker: "ai" | "user"; text: string; timestamp: string }[] | null;
  audioUrl?: string | null;
  conversationId?: string | null;
  shareToken: string | null;
  isPublic: boolean;
  user?: { name: string | null }; // Made optional to prevent undefined errors
}

interface FeedbackReportProps {
  session: SessionFeedback;
  onShare?: () => void;
}

const SCORE_COLORS = {
  contentAccuracy: "text-violet-600",
  communication: "text-fuchsia-600",
  problemSolving: "text-emerald-600",
  confidence: "text-amber-600",
};

const SCORE_BG_COLORS = {
  contentAccuracy: "bg-violet-50 border-violet-200",
  communication: "bg-fuchsia-50 border-fuchsia-200",
  problemSolving: "bg-emerald-50 border-emerald-200",
  confidence: "bg-amber-50 border-amber-200",
};

function getScoreBarColor(score: number) {
  if (score >= 70) return "bg-violet-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

function getGradeGradient(grade: string) {
  const gradeMap: Record<string, string> = {
    A: "from-violet-600 to-purple-400",
    B: "from-purple-600 to-fuchsia-400",
    C: "from-amber-600 to-yellow-400",
    D: "from-orange-600 to-amber-400",
    F: "from-rose-600 to-red-400",
  };
  return gradeMap[grade] || "from-gray-600 to-gray-400";
}

interface AudioSectionProps {
  session: SessionFeedback;
}

function AudioSection({ session }: AudioSectionProps) {
  const [realAudioUrl, setRealAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch real ElevenLabs audio if conversationId exists
  useEffect(() => {
    const fetchRealAudio = async () => {
      if (session.conversationId) {
        setIsLoading(true);
        setError(null);
        try {
          console.log("[Feedback] Fetching ElevenLabs audio for conversation:", session.conversationId);
          const response = await fetch(`/api/voice/audio/${session.conversationId}`);
          
          if (response.ok) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            setRealAudioUrl(audioUrl);
            console.log("[Feedback] ElevenLabs audio loaded successfully");
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.warn("[Feedback] Failed to fetch ElevenLabs audio:", response.status, errorData);
            setError("Failed to load interview recording");
          }
        } catch (err) {
          console.error("[Feedback] Error fetching ElevenLabs audio:", err);
          setError("Error loading interview recording");
        } finally {
          setIsLoading(false);
        }
      }
    };

    void fetchRealAudio();

    // Cleanup object URL on unmount
    return () => {
      if (realAudioUrl) {
        URL.revokeObjectURL(realAudioUrl);
      }
    };
  }, [session.conversationId]);

  // Determine which audio to display
  const displayAudioUrl = realAudioUrl || session.audioUrl || "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav";
  const isRealRecording = !!realAudioUrl || (!!session.conversationId && !error);
  
  // Only show audio player if we have audio or are loading
  if (!displayAudioUrl && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-4">
      {isLoading && (
        <Card className="border-violet-100/50 shadow-purple-sm rounded-2xl">
          <CardContent className="pt-6 flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 text-violet-600 animate-spin" />
            <span className="text-violet-700">Loading interview recording...</span>
          </CardContent>
        </Card>
      )}
      
      {error && (
        <Card className="border-amber-100/50 bg-amber-50 shadow-purple-sm rounded-2xl">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-amber-700">
              <Globe className="w-5 h-5" />
              <span>{error}. Showing demo audio instead.</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      <AudioPlayer 
        audioUrl={displayAudioUrl} 
        duration={session.duration * 60}
        className={isRealRecording ? "" : "opacity-75"}
      />
      
      {!isRealRecording && !isLoading && (
        <div className="text-center text-sm text-violet-500 italic">
          This is a demo recording. Complete a real interview to record your actual session.
        </div>
      )}
    </div>
  );
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
      <div className="gradient-purple-dark rounded-2xl p-8 text-white shadow-purple-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="space-y-2">
            <p className="text-sm text-violet-200">Candidate</p>
            <h1 className="text-3xl font-bold">{session.user?.name || "Candidate"}</h1>
            <p className="text-violet-200">{session.role}</p>
          </div>
          <div className="space-y-3 md:col-span-2 md:text-right">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center md:justify-end">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm">
                <span className="text-sm text-violet-200">Date:</span>
                <span className="font-semibold">{formatDate(session.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm">
                <span className="text-sm text-violet-200">Duration:</span>
                <span className="font-semibold">{session.duration} min</span>
              </div>
              <div
                className={`bg-gradient-to-r ${getGradeGradient(grade)} rounded-xl px-4 py-2 font-bold text-lg shadow-lg`}
              >
                Grade: {grade}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Summary - NEW */}
      <SessionSummary session={session} />

      {/* Transcript Display - NEW */}
      {session.transcript && Array.isArray(session.transcript) && session.transcript.length > 0 && (
        <TranscriptDisplay 
          transcript={session.transcript.map(entry => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }))} 
        />
      )}

      {/* Audio Player - NEW */}
      <AudioSection session={session} />

      {/* Overall Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-violet-100/50 shadow-purple-sm rounded-2xl">
          <CardContent className="pt-8 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 mb-6">
              <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#f5f3ff" strokeWidth="6" />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke="url(#scoreGradient)" strokeWidth="6"
                  strokeDasharray={`${(score / 100) * 339.29} 339.29`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.8s ease-in-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900">{score}</p>
                  <p className="text-sm text-violet-500">/ 100</p>
                </div>
              </div>
            </div>
            <p className="text-center text-violet-700/60 font-medium">Overall Score</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-violet-100/50 shadow-purple-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Score Breakdown</CardTitle>
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
                  className={`p-3 rounded-xl border ${
                    SCORE_BG_COLORS[key as keyof typeof SCORE_BG_COLORS]
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold ${SCORE_COLORS[key as keyof typeof SCORE_COLORS]}`}>
                      {displayKey}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">{value}%</span>
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
        <Card className="border-violet-100/50 shadow-purple-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allStrengths.length > 0 ? (
              allStrengths.map((strength, i) => (
                <div key={i} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-sm text-gray-700">{strength}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-violet-500">No strengths recorded yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-violet-100/50 shadow-purple-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allImprovements.length > 0 ? (
              allImprovements.map((improvement, i) => (
                <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-gray-700">{improvement}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-violet-500">No improvements needed.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filler Words Card */}
      {totalFillerWords > 0 && (
        <Card className="border-violet-100/50 shadow-purple-sm rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Filler Words Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 rounded-full p-4">
                <p className="text-2xl font-bold text-amber-600">{totalFillerWords}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Total Filler Words</p>
                <p className="text-sm text-violet-700/60">Words like &quot;um&quot;, &quot;uh&quot;, &quot;like&quot;, etc.</p>
              </div>
            </div>
            {allFillerExamples.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Examples found:</p>
                <div className="flex flex-wrap gap-2">
                  {allFillerExamples.map((word, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-amber-200 text-gray-800 rounded-full text-sm font-medium"
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

      {/* Detailed Feedback */}
      <Card className="border-violet-100/50 shadow-purple-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Detailed Question Feedback</CardTitle>
          <p className="text-sm text-violet-700/60 mt-2">
            Click to expand each question and see detailed analysis
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
      <Card className="border-violet-100/50 shadow-purple-sm rounded-2xl bg-gradient-to-r from-violet-50/50 to-fuchsia-50/50">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Share Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator className="bg-violet-100" />
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-violet-100">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="w-5 h-5 text-violet-600" />
              ) : (
                <Lock className="w-5 h-5 text-violet-400" />
              )}
              <div>
                <p className="font-semibold text-gray-900">
                  {isPublic ? "Public" : "Private"} Report
                </p>
                <p className="text-sm text-violet-700/60">
                  {isPublic
                    ? "Anyone with the link can view this report"
                    : "Only you can access this report"}
                </p>
              </div>
            </div>
            <Button
              variant={isPublic ? "default" : "outline"}
              onClick={() => setIsPublic(!isPublic)}
              className={`rounded-xl ${isPublic ? "gradient-purple text-white" : "border-violet-200 text-violet-700"}`}
            >
              {isPublic ? "Make Private" : "Make Public"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCopyLink}
              className="flex-1 rounded-xl gap-2 border-violet-200 text-violet-700 hover:bg-violet-50"
              variant="outline"
              disabled={!session.shareToken}
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button className="flex-1 rounded-xl gap-2 border-violet-200 text-violet-700 hover:bg-violet-50" variant="outline">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
