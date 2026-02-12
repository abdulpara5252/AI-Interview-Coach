"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";
import { SessionTimer } from "@/components/interview/SessionTimer";
import { TranscriptPanel } from "@/components/interview/TranscriptPanel";
import { QuestionCard } from "@/components/interview/QuestionCard";
import type { TranscriptEntry } from "@/types";

async function fetchSession(sessionId: string) {
  const res = await fetch(`/api/session/${sessionId}`);
  if (!res.ok) throw new Error("Session not found");
  return res.json() as Promise<{
    id: string;
    duration: number;
    status: string;
    questions: { id: string; text: string; order: number }[];
  }>;
}

async function completeSession(sessionId: string, transcript: TranscriptEntry[]) {
  const res = await fetch("/api/session/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      transcript: transcript.map((e) => ({ speaker: e.speaker, text: e.text })),
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to complete");
  }
}

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [completing, setCompleting] = useState(false);
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const completedRef = useRef(false);

  const { data: session, isLoading } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSession(sessionId),
    enabled: !!sessionId,
  });

  const onSessionEnd = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setCompleting(true);
    setEndDialogOpen(false);
    completeSession(sessionId, transcript)
      .then(() => router.push(`/interview/${sessionId}/feedback`))
      .catch(() => {
        completedRef.current = false;
        setCompleting(false);
      });
  }, [sessionId, transcript, router]);

  const voice = useVoiceAgent({
    sessionId,
    questions: session?.questions ?? [],
    onTranscriptUpdate: (entry) => setTranscript((t) => [...t, entry]),
    onSessionEnd,
  });

  // Keyboard: Esc → End Session dialog, Space → toggle mic (UI state; actual mute depends on voice API)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (voice.callStatus === "active" || voice.callStatus === "connecting") {
          setEndDialogOpen(true);
        }
      }
      const target = e.target as HTMLElement;
      const isInput = /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable;
      if (e.key === " " && !isInput) {
        e.preventDefault();
        setMicMuted((m) => !m);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [voice.callStatus]);

  if (isLoading || !session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-6">
          <Skeleton className="h-10 w-48 bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6">
            <Skeleton className="h-80 bg-slate-800" />
            <Skeleton className="h-80 bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion =
    session.questions[voice.currentQuestionIndex] ?? session.questions[0];
  const upcomingQuestions = session.questions
    .slice(voice.currentQuestionIndex + 1)
    .map((q) => ({ text: q.text }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top bar */}
      <header className="flex-shrink-0 border-b border-slate-800 bg-slate-900/80 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <SessionTimer
              durationSeconds={session.duration * 60}
              isActive={voice.callStatus === "active"}
              onExpire={voice.stopSession}
            />
            <span className="text-slate-400 text-sm">
              Question {voice.currentQuestionIndex + 1} of {session.questions.length}
            </span>
            <Badge
              variant={voice.callStatus === "active" ? "default" : "secondary"}
              className={
                voice.callStatus === "active"
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-0"
                  : "bg-slate-700 text-slate-300 border-slate-600"
              }
            >
              {voice.callStatus}
            </Badge>
            {micMuted && (
              <span className="text-xs text-amber-400">Mic muted (Space to toggle)</span>
            )}
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setEndDialogOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            End Session
          </Button>
        </div>
      </header>

      {/* Main: start CTA or two panels */}
      <main className="flex-1 flex flex-col min-h-0 p-6">
        {(voice.callStatus === "idle" || voice.callStatus === "connecting") && (
          <div className="flex-1 flex items-center justify-center">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-8 text-center max-w-md">
              <p className="text-slate-300 mb-6">
                Ready when you are. Click below to start the voice interview.
              </p>
              <Button
                onClick={voice.startSession}
                disabled={voice.callStatus === "connecting"}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {voice.callStatus === "connecting" ? "Connecting…" : "Start interview"}
              </Button>
              {voice.error && (
                <p className="mt-4 text-sm text-red-400">{voice.error}</p>
              )}
            </div>
          </div>
        )}

        {(voice.callStatus === "active" || voice.callStatus === "ended") && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 min-h-0">
            <div className="min-h-0 flex flex-col">
              <QuestionCard
                currentQuestion={currentQuestion ?? { text: "", order: 0 }}
                totalQuestions={session.questions.length}
                upcomingQuestions={upcomingQuestions}
              />
            </div>
            <div className="min-h-0 flex flex-col">
              <TranscriptPanel
                entries={voice.transcript}
                isSpeaking={voice.isSpeaking}
                isUserSpeaking={voice.isUserSpeaking}
                isConnecting={false}
                callStatus={voice.callStatus}
              />
            </div>
          </div>
        )}
      </main>

      {/* End Session confirmation — Esc opens this */}
      <AlertDialog open={endDialogOpen} onOpenChange={setEndDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>End Session?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Your transcript will be saved and we&apos;ll generate your feedback report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={voice.stopSession}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              End & get feedback
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Completion overlay */}
      {completing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-8 text-center shadow-xl">
            <p className="font-medium text-slate-100">Great work! Generating your feedback…</p>
            <p className="text-slate-400 text-sm mt-1">You&apos;ll be redirected in a moment.</p>
          </div>
        </div>
      )}
    </div>
  );
}
