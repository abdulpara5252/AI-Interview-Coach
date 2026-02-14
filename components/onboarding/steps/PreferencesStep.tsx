"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface PreferencesStepProps {
  sessionDuration: number;
  voiceGender: string;
  onSessionDurationChange: (duration: number) => void;
  onVoiceGenderChange: (gender: string) => void;
}

const DURATION_OPTIONS = [
  { value: 15, label: "15 min", description: "Quick practice" },
  { value: 30, label: "30 min", description: "Standard session" },
  { value: 45, label: "45 min", description: "Extended practice" },
  { value: 60, label: "60 min", description: "Full interview" },
];

const VOICE_OPTIONS = [
  { value: "male", label: "Male", emoji: "👨" },
  { value: "female", label: "Female", emoji: "👩" },
  { value: "neutral", label: "Neutral", emoji: "🤖" },
];

export default function PreferencesStep({
  sessionDuration,
  voiceGender,
  onSessionDurationChange,
  onVoiceGenderChange,
}: PreferencesStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Set your <span className="gradient-text-purple">preferences</span>
        </h2>
        <p className="text-violet-700/60">
          Customize your interview practice experience
        </p>
      </div>

      {/* Session Duration */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold text-gray-900 mb-3 block">
            ⏱️ Preferred session duration
          </Label>
          <p className="text-sm text-violet-700/60 mb-3">
            How long do you want each practice session to be?
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onSessionDurationChange(option.value)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-center group ${
                sessionDuration === option.value
                  ? "border-violet-500 bg-violet-50 shadow-purple"
                  : "border-violet-100 hover:border-violet-200 hover:shadow-purple-sm bg-white"
              }`}
            >
              <div className="font-bold text-gray-900">{option.label}</div>
              <div className="text-xs text-violet-700/60 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Gender */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold text-gray-900 mb-3 block">
            🎤 Voice gender preference
          </Label>
          <p className="text-sm text-violet-700/60 mb-3">
            Choose the voice you&apos;d like for your AI coach
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VOICE_OPTIONS.map((option) => (
            <Card
              key={option.value}
              onClick={() => onVoiceGenderChange(option.value)}
              className={`p-5 cursor-pointer transition-all duration-200 text-center rounded-xl group ${
                voiceGender === option.value
                  ? "border-2 border-violet-500 bg-violet-50 shadow-purple"
                  : "border-violet-100/50 hover:border-violet-200 hover:shadow-purple-sm bg-white"
              }`}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{option.emoji}</div>
              <div className="font-semibold text-gray-900">{option.label}</div>
              {voiceGender === option.value && (
                <div className="mt-2 mx-auto w-5 h-5 rounded-full gradient-purple flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-violet-50 border border-violet-200/50 rounded-xl">
        <p className="text-sm text-violet-800">
          ✓ Your preferences are set. You can change these anytime in settings.
        </p>
      </div>
    </div>
  );
}
