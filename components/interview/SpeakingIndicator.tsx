"use client";

import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";

interface SpeakingIndicatorProps {
  isUserSpeaking: boolean;
  isAISpeaking: boolean;
  isConnecting: boolean;
  statusText: string;
  className?: string;
}

export function SpeakingIndicator({
  isUserSpeaking,
  isAISpeaking,
  isConnecting,
  statusText,
  className,
}: SpeakingIndicatorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-6",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Pulsing circle when user is speaking */}
        {isUserSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-blue-500/30 animate-ping" />
            <div className="absolute h-16 w-16 rounded-full bg-blue-500/50" />
          </div>
        )}
        {/* Waveform bars when AI is speaking */}
        {isAISpeaking && !isUserSpeaking && (
          <div className="flex items-center justify-center gap-1 h-16">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-blue-500 animate-pulse"
                style={{
                  height: `${24 + Math.sin(i * 0.8) * 16}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
        {/* Idle/connecting: mic icon in circle */}
        {!isUserSpeaking && !isAISpeaking && (
          <div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full border-2 border-slate-600 bg-slate-800/50",
              isConnecting && "border-blue-500/50 animate-pulse"
            )}
          >
            <Mic className="h-8 w-8 text-slate-400" />
          </div>
        )}
      </div>
      <p className="text-sm text-slate-400">{statusText}</p>
    </div>
  );
}
