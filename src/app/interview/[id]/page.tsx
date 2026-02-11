"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TranscriptLine = { speaker: "agent" | "user"; text: string; timestamp: number };

export default function LiveInterviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [question, setQuestion] = useState("Loading first question...");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => (isPaused ? s : s + 1)), 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    const mock = setInterval(() => {
      if (isPaused) return;
      const now = Date.now();
      setIsSpeaking((v) => !v);
      setTranscript((prev) => [
        ...prev,
        { speaker: "agent", text: "Could you expand on that with an example?", timestamp: now },
        { speaker: "user", text: `User response snippet at ${new Date().toLocaleTimeString()}`, timestamp: now + 1 }
      ]);
      setQuestion("Tell me about a challenging project you recently worked on.");
    }, 7000);

    return () => clearInterval(mock);
  }, [isPaused]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setIsSpeaking((v) => !v);
      }
      if (event.code === "Escape") {
        endSession("abandoned");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const endSession = async (status: "completed" | "abandoned" = "completed") => {
    await fetch(`/api/interviews/${id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, status })
    });
    router.push(`/interview/${id}/feedback`);
  };

  const time = useMemo(() => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`, [seconds]);

  return (
    <main className="space-y-4 p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge>Session Timer: {time}</Badge>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isSpeaking ? "animate-pulse bg-green-500" : "bg-muted"}`} />
          <span className="text-sm text-muted-foreground">{isSpeaking ? "Speaking" : "Listening"}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Question Panel</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p>{question}</p>
            <p className="text-xs text-muted-foreground">Shortcuts: Space = push-to-talk, Esc = end session.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Live Transcript</CardTitle></CardHeader>
          <CardContent className="max-h-[360px] space-y-2 overflow-y-auto text-sm">
            {transcript.length === 0 ? (
              <p className="text-muted-foreground">Waiting for transcript...</p>
            ) : (
              transcript.map((line, idx) => (
                <p key={`${line.timestamp}-${idx}`}>
                  <span className="font-semibold">{line.speaker}:</span> {line.text}
                </p>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setIsPaused((v) => !v)}>{isPaused ? "Resume" : "Pause"} Interview</Button>
        <Button variant="outline" onClick={() => setQuestion("Could you clarify your approach and key trade-offs?")}>Replay Last Question</Button>
        <Button onClick={() => endSession("completed")}>End Session</Button>
      </div>
    </main>
  );
}
