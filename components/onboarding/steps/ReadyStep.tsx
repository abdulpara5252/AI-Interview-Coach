"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

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
    const timer = setTimeout(() => setShowCheckmark(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center space-y-6">
      {/* Animated Checkmark */}
      <div className="flex justify-center py-4">
        <div
          className={`relative w-20 h-20 flex items-center justify-center rounded-full gradient-purple shadow-purple glow-purple transition-all duration-700 ${
            showCheckmark ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <svg
            className={`w-10 h-10 text-white transition-all duration-500 ${
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
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">
          You&apos;re all <span className="gradient-text-purple">set!</span>
        </h1>
        <p className="text-lg text-violet-700/60">
          Your AI Interview Coach is ready to help you succeed
        </p>
      </div>

      {/* Summary Cards */}
      <div className="bg-violet-50/80 rounded-2xl p-6 space-y-4 border border-violet-100/50">
        <h3 className="font-semibold text-gray-900 text-left">Your Setup Summary</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4 border-violet-100/50 bg-white rounded-xl shadow-purple-sm">
            <div className="text-left">
              <p className="text-xs text-violet-500 font-semibold mb-1 uppercase tracking-wider">
                Target Role
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {formData.targetRole}
              </p>
            </div>
          </Card>

          <Card className="p-4 border-violet-100/50 bg-white rounded-xl shadow-purple-sm">
            <div className="text-left">
              <p className="text-xs text-violet-500 font-semibold mb-1 uppercase tracking-wider">
                Experience Level
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {EXPERIENCE_LABELS[formData.experience]}
              </p>
            </div>
          </Card>

          <Card className="p-4 border-violet-100/50 bg-white rounded-xl shadow-purple-sm">
            <div className="text-left">
              <p className="text-xs text-violet-500 font-semibold mb-1 uppercase tracking-wider">
                Session Duration
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {formData.sessionDuration} minutes
              </p>
            </div>
          </Card>

          <Card className="p-4 border-violet-100/50 bg-white rounded-xl shadow-purple-sm">
            <div className="text-left">
              <p className="text-xs text-violet-500 font-semibold mb-1 uppercase tracking-wider">
                Voice Preference
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {VOICE_LABELS[formData.voiceGender]}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* What's Next */}
      <div className="space-y-3 pt-2">
        <h3 className="font-semibold text-gray-900">What&apos;s next?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="text-left p-4 bg-violet-50/80 rounded-xl border border-violet-100/50 hover:border-violet-200 transition-colors">
            <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-purple-sm mb-3">
              <span className="text-lg">🎯</span>
            </div>
            <p className="font-semibold text-sm text-gray-900">Get Started</p>
            <p className="text-xs text-violet-700/60 mt-1">
              Choose your first interview type
            </p>
          </div>
          <div className="text-left p-4 bg-violet-50/80 rounded-xl border border-violet-100/50 hover:border-violet-200 transition-colors">
            <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-purple-sm mb-3">
              <span className="text-lg">🗣️</span>
            </div>
            <p className="font-semibold text-sm text-gray-900">Practice</p>
            <p className="text-xs text-violet-700/60 mt-1">
              Have a real interview conversation
            </p>
          </div>
          <div className="text-left p-4 bg-violet-50/80 rounded-xl border border-violet-100/50 hover:border-violet-200 transition-colors">
            <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-purple-sm mb-3">
              <span className="text-lg">📊</span>
            </div>
            <p className="font-semibold text-sm text-gray-900">Improve</p>
            <p className="text-xs text-violet-700/60 mt-1">
              Get detailed feedback and track progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
