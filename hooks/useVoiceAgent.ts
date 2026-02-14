"use client";

import { useCallback, useRef, useState } from "react";
import { Conversation } from "@elevenlabs/client";
import type { TranscriptEntry } from "@/types";

interface Question {
  id: string;
  text: string;
  order: number;
}

interface UseVoiceAgentOptions {
  sessionId: string;
  questions: Question[];
  onTranscriptUpdate: (entry: TranscriptEntry) => void;
  onSessionEnd: (audioUrl?: string) => void;
}

type CallStatus = "idle" | "connecting" | "active" | "ended";

interface ConversationMessage {
  role?: string;
  message?: string;
  source?: string;
}

export function useVoiceAgent({
  sessionId,
  onTranscriptUpdate,
  onSessionEnd,
}: UseVoiceAgentOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const conversationRef = useRef<Awaited<ReturnType<typeof Conversation.startSession>> | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  const startSession = useCallback(async () => {
    setError(null);
    setCallStatus("connecting");
    try {
      console.log("[VoiceAgent] Requesting voice token for session:", sessionId);
      const res = await fetch(`/api/voice/token?sessionId=${encodeURIComponent(sessionId)}`);
      console.log("[VoiceAgent] Token API response status:", res.status);
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("[VoiceAgent] Token API error:", data);
        throw new Error(data.error ?? `Failed to get voice session (status: ${res.status})`);
      }
      
      const data = (await res.json()) as {
        signedUrl: string;
        sessionId: string;
        conversationId: string;
        interviewContext?: {
          role: string;
          interviewType: string;
          difficulty: string;
          questions: string[];
          firstQuestion: string;
        };
      };
      console.log("[VoiceAgent] Received signed URL (first 50 chars):", data.signedUrl.substring(0, 50) + "...");
      console.log("[VoiceAgent] Conversation ID:", data.conversationId);
      console.log("[VoiceAgent] Interview context:", data.interviewContext);
      
      // Store the conversation ID for later use
      conversationIdRef.current = data.conversationId;

      const conversation = await Conversation.startSession({
        signedUrl: data.signedUrl,
        connectionType: "websocket",
        // Pass dynamic interview context to ElevenLabs agent
        ...(data.interviewContext && {
          firstMessage: `Hello! I'm Claire, your AI interviewer. Today we're going to do a ${data.interviewContext.interviewType} interview for the role of ${data.interviewContext.role} at ${data.interviewContext.difficulty} difficulty. Let's begin with our first question: ${data.interviewContext.firstQuestion}`,
          metadata: {
            role: data.interviewContext.role,
            interviewType: data.interviewContext.interviewType,
            difficulty: data.interviewContext.difficulty,
            questions: data.interviewContext.questions,
            sessionId: sessionId, // Store session ID in metadata
          },
        }),
        onConnect: () => {
          setIsConnected(true);
          setCallStatus("active");
          console.log("[VoiceAgent] Connected to ElevenLabs conversation");
        },
        onDisconnect: async () => {
          setIsConnected(false);
          setCallStatus("ended");
          
          // Try to get audio recording URL from ElevenLabs
          let audioUrl: string | undefined;
          try {
            const conversationId = conversationIdRef.current;
            if (conversationId) {
              console.log("[VoiceAgent] Fetching audio recording for conversation:", conversationId);
              
              // Call our API route to get conversation audio from ElevenLabs
              const response = await fetch(`/api/voice/audio/${conversationId}`);
              
              if (response.ok) {
                const audioData = await response.blob();
                // Create object URL for the audio blob
                audioUrl = URL.createObjectURL(audioData);
                console.log("[VoiceAgent] Audio recording retrieved successfully");
              } else {
                const errorData = await response.json().catch(() => ({}));
                console.warn("[VoiceAgent] Failed to fetch audio recording:", response.status, errorData);
                // Fallback to test audio
                audioUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav";
              }
            } else {
              console.warn("[VoiceAgent] No conversation ID captured, using test audio");
              audioUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav";
            }
          } catch (err) {
            console.warn("[VoiceAgent] Could not retrieve audio recording:", err);
            // Fallback to test audio
            audioUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav";
          }
          
          conversationRef.current = null;
          onSessionEnd(audioUrl);
          console.log("[VoiceAgent] Disconnected from ElevenLabs conversation");
        },
        onMessage: (message: ConversationMessage) => {
          const role = message.role ?? message.source ?? "agent";
          const text = typeof message.message === "string" ? message.message : String(message.message ?? "");
          
          // Log conversation events for debugging
          if (role === "agent" && text) {
            console.log("[VoiceAgent] Agent message:", text.substring(0, 100) + "...");
          } else if (role === "user" && text) {
            console.log("[VoiceAgent] User message:", text.substring(0, 100) + "...");
          }
          
          if (!text.trim()) return;
          const speaker: "ai" | "user" = role === "user" ? "user" : "ai";
          const entry: TranscriptEntry = {
            speaker,
            text,
            timestamp: new Date(),
          };
          setTranscript((prev) => [...prev, entry]);
          onTranscriptUpdate(entry);
        },
        onModeChange: (mode: { mode?: string }) => {
          const m = mode?.mode ?? "";
          if (m === "speaking") {
            setIsSpeaking(true);
            setIsUserSpeaking(false);
          } else if (m === "listening") {
            setIsSpeaking(false);
            setIsUserSpeaking(true);
          } else {
            setIsSpeaking(false);
            setIsUserSpeaking(false);
          }
        },
        onError: (err: unknown) => {
          setError(err instanceof Error ? err.message : "Voice error");
        },
        onStatusChange: (status: { status?: string }) => {
          if (status.status === "connected") {
            setIsConnected(true);
            setCallStatus("active");
          } else if (status.status === "disconnected") {
            setIsConnected(false);
            setCallStatus("ended");
          }
        },
      });

      conversationRef.current = conversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start");
      setCallStatus("idle");
    }
  }, [sessionId, onSessionEnd, onTranscriptUpdate]);

  const stopSession = useCallback(() => {
    if (conversationRef.current) {
      conversationRef.current.endSession().catch(() => {});
      conversationRef.current = null;
    }
    setIsConnected(false);
    setCallStatus("ended");
    onSessionEnd();
  }, [onSessionEnd]);

  return {
    isConnected,
    isSpeaking,
    isUserSpeaking,
    transcript,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    callStatus,
    error,
    startSession,
    stopSession,
  };
}
