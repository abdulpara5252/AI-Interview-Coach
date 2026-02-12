"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Set your preferences
        </h2>
        <p className="text-muted-foreground">
          Customize your interview practice experience
        </p>
      </div>

      {/* Session Duration */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold text-foreground mb-3 block">
            ⏱️ Preferred session duration
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            How long do you want each practice session to be?
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onSessionDurationChange(option.value)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                sessionDuration === option.value
                  ? "border-primary bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white"
              }`}
            >
              <div className="font-bold text-foreground">{option.label}</div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Gender */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold text-foreground mb-3 block">
            🎤 Voice gender preference
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Choose the voice you'd like for your AI coach
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VOICE_OPTIONS.map((option) => (
            <Card
              key={option.value}
              onClick={() => onVoiceGenderChange(option.value)}
              className={`p-4 cursor-pointer transition-all duration-200 text-center ${
                voiceGender === option.value
                  ? "border-primary border-2 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="text-3xl mb-2">{option.emoji}</div>
              <div className="font-semibold text-foreground">{option.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-900">
          ✓ Your preferences are set. You can change these anytime in settings.
        </p>
      </div>
    </div>
  );
}
