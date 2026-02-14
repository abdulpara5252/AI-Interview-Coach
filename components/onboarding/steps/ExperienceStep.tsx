"use client";

import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ExperienceStepProps {
  selectedLevel: string;
  onLevelSelect: (level: string) => void;
}

const EXPERIENCE_OPTIONS = [
  {
    id: "junior",
    label: "Junior",
    years: "0–2 years",
    emoji: "🌱",
    description: "Building fundamentals and first projects",
    difficulty: "Easy to Medium difficulty questions",
  },
  {
    id: "mid",
    label: "Mid-Level",
    years: "2–5 years",
    emoji: "📈",
    description: "Solid experience with complex problems",
    difficulty: "Medium to Hard difficulty questions",
  },
  {
    id: "senior",
    label: "Senior",
    years: "5+ years",
    emoji: "⭐",
    description: "Deep expertise and system design",
    difficulty: "Hard to Expert difficulty questions",
  },
];

export default function ExperienceStep({
  selectedLevel,
  onLevelSelect,
}: ExperienceStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What&apos;s your <span className="gradient-text-purple">experience level</span>?
        </h2>
        <p className="text-violet-700/60">
          We&apos;ll adjust question difficulty based on your level
        </p>
      </div>

      <div className="space-y-3">
        {EXPERIENCE_OPTIONS.map((option) => (
          <Card
            key={option.id}
            onClick={() => onLevelSelect(option.id)}
            className={`p-5 cursor-pointer transition-all duration-200 rounded-xl group ${
              selectedLevel === option.id
                ? "border-2 border-violet-500 bg-violet-50 shadow-purple"
                : "border-violet-100/50 hover:border-violet-200 hover:shadow-purple-sm bg-white"
            }`}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <span className="text-4xl group-hover:scale-110 transition-transform inline-block">{option.emoji}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    {option.label}
                  </h3>
                  <span className="text-sm text-violet-700/60">
                    {option.years}
                  </span>
                  {selectedLevel === option.id && (
                    <div className="ml-auto w-6 h-6 rounded-full gradient-purple flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-violet-700/60 mb-2">
                  {option.description}
                </p>
                <div className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
                  {option.difficulty}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedLevel && (
        <div className="p-4 bg-violet-50 border border-violet-200/50 rounded-xl">
          <p className="text-sm text-violet-800">
            ✓ Experience level set to{" "}
            <strong>
              {EXPERIENCE_OPTIONS.find((o) => o.id === selectedLevel)?.label}
            </strong>
            . Questions will match your level.
          </p>
        </div>
      )}
    </div>
  );
}
