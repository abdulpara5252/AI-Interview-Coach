"use client";

import { ROLES } from "@/types";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface RoleSelectionStepProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
}

const ROLE_EMOJIS: Record<string, string> = {
  "Frontend Developer": "🎨",
  "Backend Developer": "⚙️",
  "Full Stack Developer": "🔗",
  "Product Manager": "📈",
  "Data Scientist": "📊",
  "UX/UI Designer": "✨",
  "DevOps Engineer": "🚀",
  "Mobile Developer": "📱",
};

export default function RoleSelectionStep({
  selectedRole,
  onRoleSelect,
}: RoleSelectionStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What&apos;s your <span className="gradient-text-purple">target role</span>?
        </h2>
        <p className="text-violet-700/60">
          Select the position you&apos;re preparing for
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLES.map((role) => (
          <Card
            key={role}
            onClick={() => onRoleSelect(role)}
            className={`p-4 cursor-pointer transition-all duration-200 rounded-xl group ${
              selectedRole === role
                ? "border-2 border-violet-500 bg-violet-50 shadow-purple"
                : "border-violet-100/50 hover:border-violet-200 hover:shadow-purple-sm bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl group-hover:scale-110 transition-transform">{ROLE_EMOJIS[role] || "💼"}</span>
              <span className="font-semibold text-gray-900 flex-1">{role}</span>
              {selectedRole === role && (
                <div className="w-6 h-6 rounded-full gradient-purple flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {selectedRole && (
        <div className="p-4 bg-violet-50 border border-violet-200/50 rounded-xl">
          <p className="text-sm text-violet-800">
            ✓ You selected <strong>{selectedRole}</strong>. We&apos;ll tailor questions to match this role.
          </p>
        </div>
      )}
    </div>
  );
}
