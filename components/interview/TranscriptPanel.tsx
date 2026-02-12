"use client";

import { useEffect, useRef } from "react";
import type { TranscriptEntry } from "@/types";
import { cn } from "@/lib/utils";

interface TranscriptPanelProps {
  entries: TranscriptEntry[];
  isSpeaking: boolean;
  isUserSpeaking: boolean;
  className?: string;
}

export function TranscriptPanel({
  entries,
  isSpeaking,
  isUserSpeaking,
  className,
}: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [entries]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex flex-col gap-3 overflow-y-auto rounded-lg border bg-card p-4 min-h-[200px] max-h-[400px]",
        className
      )}
    >
      {entries.length === 0 && (
        <p className="text-muted-foreground text-sm">Transcript will appear here as you speak.</p>
      )}
      {entries.map((e, i) => (
        <div
          key={i}
          className={cn(
            "flex",
            e.speaker === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[85%] rounded-lg px-3 py-2 text-sm",
              e.speaker === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <span className="font-medium text-xs opacity-80">
              {e.speaker === "user" ? "You" : "saraha"}
            </span>
            <p className="mt-0.5">{e.text}</p>
          </div>
        </div>
      ))}
      {isSpeaking && (
        <div className="flex justify-start">
          <span className="text-muted-foreground text-xs animate-pulse">saraha is speaking…</span>
        </div>
      )}
      {isUserSpeaking && (
        <div className="flex justify-end">
          <span className="text-muted-foreground text-xs animate-pulse">You're speaking…</span>
        </div>
      )}
    </div>
  );
}
