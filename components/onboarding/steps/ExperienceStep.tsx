"use client";

import { Card } from "@/components/ui/card";

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
        <h2 className="text-2xl font-bold text-foreground mb-2">
          What's your experience level?
        </h2>
        <p className="text-muted-foreground">
          We'll adjust question difficulty based on your level
        </p>
      </div>

      <div className="space-y-3">
        {EXPERIENCE_OPTIONS.map((option) => (
          <Card
            key={option.id}
            onClick={() => onLevelSelect(option.id)}
            className={`p-5 cursor-pointer transition-all duration-200 ${
              selectedLevel === option.id
                ? "border-primary border-2 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <span className="text-4xl">{option.emoji}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="font-bold text-lg text-foreground">
                    {option.label}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {option.years}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {option.description}
                </p>
                <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  {option.difficulty}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedLevel && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm text-blue-900">
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
