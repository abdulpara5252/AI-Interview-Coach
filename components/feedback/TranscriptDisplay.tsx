"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TranscriptEntry } from "@/types";
import { User, Bot } from "lucide-react";

interface TranscriptDisplayProps {
  transcript: TranscriptEntry[];
  className?: string;
}

export function TranscriptDisplay({ transcript, className }: TranscriptDisplayProps) {
  if (!transcript || transcript.length === 0) {
    return (
      <Card className={cn("border-violet-100/50 shadow-purple-sm rounded-2xl", className)}>
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Conversation Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-violet-500 text-center py-8">
            No transcript available for this session.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group consecutive messages from the same speaker
  const groupedTranscript = transcript.reduce((groups, entry) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.speaker === entry.speaker) {
      lastGroup.entries.push(entry);
    } else {
      groups.push({
        speaker: entry.speaker,
        entries: [entry],
      });
    }
    return groups;
  }, [] as { speaker: "ai" | "user"; entries: TranscriptEntry[] }[]);

  return (
    <Card className={cn("border-violet-100/50 shadow-purple-sm rounded-2xl", className)}>
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div>
          Conversation Transcript
        </CardTitle>
        <p className="text-sm text-violet-700/60">
          Full conversation between you and the AI interviewer
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] overflow-y-auto pr-2 space-y-4">
          {groupedTranscript.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className={cn(
                "flex",
                group.speaker === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3",
                  group.speaker === "user"
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                    : "bg-violet-50 border border-violet-100 text-gray-800"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {group.speaker === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs font-medium",
                      group.speaker === "user"
                        ? "bg-white/20 text-white"
                        : "bg-violet-100 text-violet-700"
                    )}
                  >
                    {group.speaker === "user" ? "You" : "Claire"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {group.entries.map((entry, entryIndex) => (
                    <p key={entryIndex} className="text-sm leading-relaxed">
                      {entry.text}
                    </p>
                  ))}
                </div>
                {group.entries[group.entries.length - 1]?.timestamp && (
                  <p
                    className={cn(
                      "text-xs mt-2 opacity-80",
                      group.speaker === "user" ? "text-violet-100" : "text-violet-500"
                    )}
                  >
                    {new Date(group.entries[group.entries.length - 1].timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}