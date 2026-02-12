"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReadyStepProps {
  formData: {
    targetRole: string;
    experience: string;
    sessionDuration: number;
    voiceGender: string;
  };
}

const EXPERIENCE_LABELS: Record<string, string> = {
  junior: "Junior (0–2 years)",
  mid: "Mid-Level (2–5 years)",
  senior: "Senior (5+ years)",
};

const VOICE_LABELS: Record<string, string> = {
  male: "Male voice",
  female: "Female voice",
  neutral: "Neutral voice",
};

export default function ReadyStep({ formData }: ReadyStepProps) {
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setShowCheckmark(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center space-y-6">
      {/* Animated Checkmark */}
      <div className="flex justify-center py-4">
        <div
          className={`relative w-20 h-20 flex items-center justify-center rounded-full bg-green-50 border-2 border-green-500 transition-all duration-700 ${
            showCheckmark ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <div
            className={`absolute inset-0 rounded-full border-2 border-green-500 transition-all duration-700 ${
              showCheckmark ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
            style={{
              animation: showCheckmark ? "pulse 0s" : "pulse 2s infinite",
            }}
          />
          <svg
            className={`w-10 h-10 text-green-500 transition-all duration-500 ${
              showCheckmark ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          You're all set!
        </h1>
        <p className="text-lg text-muted-foreground">
          Your AI Interview Coach is ready to help you succeed
        </p>
      </div>

      {/* Summary Cards */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-foreground text-left">Your Setup Summary</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Target Role */}
          <Card className="p-4 border-gray-200 bg-white">
            <div className="text-left">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                TARGET ROLE
              </p>
              <p className="text-lg font-semibold text-foreground">
                {formData.targetRole}
              </p>
            </div>
          </Card>

          {/* Experience Level */}
          <Card className="p-4 border-gray-200 bg-white">
            <div className="text-left">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                EXPERIENCE LEVEL
              </p>
              <p className="text-lg font-semibold text-foreground">
                {EXPERIENCE_LABELS[formData.experience]}
              </p>
            </div>
          </Card>

          {/* Session Duration */}
          <Card className="p-4 border-gray-200 bg-white">
            <div className="text-left">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                SESSION DURATION
              </p>
              <p className="text-lg font-semibold text-foreground">
                {formData.sessionDuration} minutes
              </p>
            </div>
          </Card>

          {/* Voice Preference */}
          <Card className="p-4 border-gray-200 bg-white">
            <div className="text-left">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                VOICE PREFERENCE
              </p>
              <p className="text-lg font-semibold text-foreground">
                {VOICE_LABELS[formData.voiceGender]}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* What's Next */}
      <div className="space-y-3 pt-2">
        <h3 className="font-semibold text-foreground">What's next?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="text-left p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-2xl mb-2">🎯</div>
            <p className="font-semibold text-sm text-foreground">Get Started</p>
            <p className="text-xs text-muted-foreground">
              Choose your first interview type
            </p>
          </div>
          <div className="text-left p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-2xl mb-2">🗣️</div>
            <p className="font-semibold text-sm text-foreground">Practice</p>
            <p className="text-xs text-muted-foreground">
              Have a real interview conversation
            </p>
          </div>
          <div className="text-left p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-2xl mb-2">📊</div>
            <p className="font-semibold text-sm text-foreground">Improve</p>
            <p className="text-xs text-muted-foreground">
              Get detailed feedback and track progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
