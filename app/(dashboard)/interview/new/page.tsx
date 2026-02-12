"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES, INTERVIEW_TYPES, DIFFICULTIES } from "@/types";
import { ArrowRight, Microphone, Loader2 } from "lucide-react";

async function createSession(payload: {
  role: string;
  interviewType: string;
  difficulty: string;
  duration: number;
}) {
  const res = await fetch("/api/session/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to create session");
  }
  return res.json() as Promise<{ sessionId: string }>;
}

const DURATIONS = [15, 30, 45, 60] as const;

const DIFFICULTY_CONFIG = {
  easy: {
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    badge: "bg-green-100 text-green-700",
    title: "Easy",
    description: "Fundamental concepts, junior-level questions",
  },
  medium: {
    color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    badge: "bg-yellow-100 text-yellow-700",
    title: "Medium",
    description: "Mid-level complexity, intermediate experience",
  },
  hard: {
    color: "bg-red-50 border-red-200 hover:bg-red-100",
    badge: "bg-red-100 text-red-700",
    title: "Hard",
    description: "Advanced scenarios, senior-level challenges",
  },
};

export default function NewInterviewPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState(30);

  const mutation = useMutation({
    mutationFn: createSession,
    onSuccess: (data) => router.push(`/interview/${data.sessionId}`),
  });

  const isFormValid = role && interviewType && difficulty;
  const difficultyConfig = difficulty ? DIFFICULTY_CONFIG[difficulty as keyof typeof DIFFICULTY_CONFIG] : null;

  return (
    <div className="mx-auto max-w-2xl py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Microphone className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Start New Interview Session</h1>
        </div>
        <p className="text-gray-600">Set up your interview parameters and prepare for practice</p>
      </div>

      {/* Main Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-8">
            {/* Role Selection */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Target Role
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="border-gray-200 bg-white">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Interview Type */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Interview Type
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {INTERVIEW_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setInterviewType(type)}
                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                      interviewType === type
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Difficulty Level
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      difficulty === key
                        ? `${config.color.split(" ")[0]} border-blue-600 shadow-md`
                        : `${config.color} border-transparent`
                    }`}
                  >
                    <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${config.badge}`}>
                      {config.title}
                    </div>
                    <p className="text-sm text-gray-700">{config.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Session Duration
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-4 py-3 rounded-full font-medium text-sm transition-all ${
                      duration === d
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Summary */}
            {isFormValid && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Session Summary</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Role</p>
                    <p className="font-semibold text-gray-900">{role}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{interviewType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Difficulty</p>
                    <p className="font-semibold text-gray-900 capitalize">{difficulty}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">{duration} minutes</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {mutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{mutation.error.message}</p>
              </div>
            )}

            {/* CTA Button */}
            <Button
              onClick={() =>
                mutation.mutate({
                  role,
                  interviewType,
                  difficulty,
                  duration,
                })
              }
              disabled={!isFormValid || mutation.isPending}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Preparing your interview...</span>
                </>
              ) : (
                <>
                  <span>Start Interview</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
  return res.json() as Promise<{ sessionId: string }>;
}

const DURATIONS = [15, 30, 45, 60] as const;

export default function NewInterviewPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState(30);

  const mutation = useMutation({
    mutationFn: createSession,
    onSuccess: (data) => router.push(`/interview/${data.sessionId}`),
  });

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card>
        <CardHeader>
          <CardTitle>New mock interview</CardTitle>
          <CardDescription>
            Choose role, type, difficulty, and duration. We’ll generate questions and start the voice session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Interview type</Label>
            <Select value={interviewType} onValueChange={setInterviewType}>
              <SelectTrigger>
                <SelectValue placeholder="Technical / Behavioral / Mixed" />
              </SelectTrigger>
              <SelectContent>
                {INTERVIEW_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Select
              value={String(duration)}
              onValueChange={(v) => setDuration(Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((d) => (
                  <SelectItem key={d} value={String(d)}>
                    {d} min
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            disabled={!role || !interviewType || !difficulty || mutation.isPending}
            onClick={() =>
              mutation.mutate({
                role,
                interviewType,
                difficulty,
                duration,
              })
            }
          >
            {mutation.isPending ? "Creating session…" : "Start interview"}
          </Button>
          {mutation.isError && (
            <p className="text-sm text-destructive">{mutation.error.message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
