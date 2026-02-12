"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
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
  AlertDialogTrigger,
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

  if (isLoading || !session) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
          <Skeleton className="h-48" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[voice.currentQuestionIndex] ?? session.questions[0];
  const nextQuestion = session.questions[voice.currentQuestionIndex + 1];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SessionTimer
            durationSeconds={session.duration * 60}
            isActive={voice.callStatus === "active"}
            onExpire={voice.stopSession}
          />
          <span className="text-muted-foreground text-sm">
            Question {voice.currentQuestionIndex + 1} of {session.questions.length}
          </span>
          <Badge variant={voice.callStatus === "active" ? "default" : "secondary"}>
            {voice.callStatus}
          </Badge>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              End session
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End interview?</AlertDialogTitle>
              <AlertDialogDescription>
                Your transcript will be saved and we’ll generate your feedback report.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={voice.stopSession}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                End & get feedback
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {voice.callStatus === "idle" && (
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="mb-4">Ready when you are. Click below to start the voice interview.</p>
          <Button
            onClick={voice.startSession}
            disabled={voice.callStatus === "connecting"}
          >
            {voice.callStatus === "connecting" ? "Connecting…" : "Start interview"}
          </Button>
          {voice.error && (
            <p className="mt-4 text-sm text-destructive">{voice.error}</p>
          )}
        </div>
      )}

      {(voice.callStatus === "active" || voice.callStatus === "ended") && (
        <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
          <QuestionCard
            currentQuestion={currentQuestion ?? { text: "", order: 0 }}
            totalQuestions={session.questions.length}
            upcomingPreview={nextQuestion?.text}
          />
          <div>
            <h3 className="mb-2 text-sm font-medium">Live transcript</h3>
            <TranscriptPanel
              entries={voice.transcript}
              isSpeaking={voice.isSpeaking}
              isUserSpeaking={voice.isUserSpeaking}
            />
          </div>
        </div>
      )}

      {completing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="font-medium">Generating your feedback…</p>
            <p className="text-muted-foreground text-sm mt-1">You’ll be redirected in a moment.</p>
          </div>
        </div>
      )}
    </div>
  );
}
