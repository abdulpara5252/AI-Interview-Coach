"use client";

import { useEffect, useRef } from "react";
import type { TranscriptEntry } from "@/types";
import { cn } from "@/lib/utils";
import { SpeakingIndicator } from "./SpeakingIndicator";

interface TranscriptPanelProps {
  entries: TranscriptEntry[];
  isSpeaking: boolean;
  isUserSpeaking: boolean;
  isConnecting: boolean;
  callStatus: string;
  className?: string;
}

function getStatusText(
  callStatus: string,
  isSpeaking: boolean,
  isUserSpeaking: boolean,
  isConnecting: boolean
): string {
  if (isConnecting || callStatus === "connecting") return "Connecting…";
  if (callStatus === "idle") return "Start the session to begin";
  if (callStatus === "ended") return "Session ended";
  if (isUserSpeaking) return "Your turn — speak your answer";
  if (isSpeaking) return "Alex is speaking…";
  return "Processing…";
}

export function TranscriptPanel({
  entries,
  isSpeaking,
  isUserSpeaking,
  isConnecting,
  callStatus,
  className,
}: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [entries]);

  const statusText = getStatusText(callStatus, isSpeaking, isUserSpeaking, isConnecting);

  return (
    <div className={cn("flex flex-col h-full min-h-0", className)}>
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Live Transcript</h3>
      <div
        ref={scrollRef}
        className={cn(
          "flex-1 flex flex-col gap-3 overflow-y-auto rounded-lg border border-slate-700/50 bg-slate-800/20 p-4 min-h-[200px]"
        )}
      >
        {entries.length === 0 && (
          <p className="text-slate-500 text-sm">Transcript will appear here as you speak.</p>
        )}
        {entries.map((e, i) => (
          <div
            key={i}
            className={cn("flex", e.speaker === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                e.speaker === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700/60 text-slate-200 border border-slate-600/50"
              )}
            >
              <span className="font-medium text-xs opacity-80">
                {e.speaker === "user" ? "You" : "Alex"}
              </span>
              <p className="mt-0.5">{e.text}</p>
            </div>
          </div>
        ))}
      </div>
      <SpeakingIndicator
        isUserSpeaking={isUserSpeaking}
        isAISpeaking={isSpeaking}
        isConnecting={callStatus === "connecting"}
        statusText={statusText}
      />
    </div>
  );
}
