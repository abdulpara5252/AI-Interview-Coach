"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
import { ArrowRight, Mic, Loader2, Sparkles } from "lucide-react";

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
    color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    activeColor: "bg-emerald-50 border-violet-500",
    badge: "bg-emerald-100 text-emerald-700",
    title: "Easy",
    description: "Fundamental concepts, junior-level questions",
  },
  medium: {
    color: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    activeColor: "bg-amber-50 border-violet-500",
    badge: "bg-amber-100 text-amber-700",
    title: "Medium",
    description: "Mid-level complexity, intermediate experience",
  },
  hard: {
    color: "bg-rose-50 border-rose-200 hover:bg-rose-100",
    activeColor: "bg-rose-50 border-violet-500",
    badge: "bg-rose-100 text-rose-700",
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

  return (
    <div className="mx-auto max-w-2xl py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100/80 text-violet-700 text-sm font-medium border border-violet-200/50 mb-4">
          <Sparkles className="h-4 w-4" />
          New Session
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="gradient-purple p-2.5 rounded-xl shadow-purple-sm">
            <Mic className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Start New Interview</h1>
        </div>
        <p className="text-violet-700/60 ml-14">Set up your interview parameters and prepare for practice</p>
      </div>

      {/* Main Card */}
      <Card className="border-violet-100/50 shadow-purple-sm rounded-2xl overflow-hidden">
        <CardContent className="pt-8 pb-8">
          <div className="space-y-8">
            {/* Role Selection */}
            <div>
              <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                Target Role
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="border-violet-200 bg-white hover:border-violet-300 rounded-xl h-12 focus:ring-violet-500 focus:border-violet-500">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
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
              <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                Interview Type
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {INTERVIEW_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setInterviewType(type)}
                    className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      interviewType === type
                        ? "gradient-purple text-white shadow-purple"
                        : "bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-100"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                Difficulty Level
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      difficulty === key
                        ? `${config.activeColor} shadow-purple`
                        : `${config.color} border-transparent`
                    }`}
                  >
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${config.badge}`}>
                      {config.title}
                    </div>
                    <p className="text-sm text-gray-700">{config.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                Session Duration
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-4 py-3 rounded-full font-medium text-sm transition-all duration-200 ${
                      duration === d
                        ? "gradient-purple text-white shadow-purple"
                        : "bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-100"
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-violet-100" />

            {/* Summary */}
            {isFormValid && (
              <div className="bg-violet-50/80 border border-violet-200/50 rounded-xl p-5">
                <p className="text-sm font-semibold text-gray-900 mb-3">Session Summary</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-violet-700/60">Role</p>
                    <p className="font-semibold text-gray-900">{role}</p>
                  </div>
                  <div>
                    <p className="text-violet-700/60">Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{interviewType}</p>
                  </div>
                  <div>
                    <p className="text-violet-700/60">Difficulty</p>
                    <p className="font-semibold text-gray-900 capitalize">{difficulty}</p>
                  </div>
                  <div>
                    <p className="text-violet-700/60">Duration</p>
                    <p className="font-semibold text-gray-900">{duration} minutes</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {mutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700 font-medium">{mutation.error.message}</p>
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
              className="w-full h-13 gradient-purple-pink text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-purple hover:shadow-purple-lg hover:opacity-90 transition-all text-base"
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
