"use client";

import { ROLES } from "@/types";
import { Card } from "@/components/ui/card";

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
        <h2 className="text-2xl font-bold text-foreground mb-2">
          What's your target role?
        </h2>
        <p className="text-muted-foreground">
          Select the position you're preparing for
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLES.map((role) => (
          <Card
            key={role}
            onClick={() => onRoleSelect(role)}
            className={`p-4 cursor-pointer transition-all duration-200 ${
              selectedRole === role
                ? "border-primary border-2 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{ROLE_EMOJIS[role] || "💼"}</span>
              <span className="font-semibold text-foreground">{role}</span>
            </div>
          </Card>
        ))}
      </div>

      {selectedRole && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm text-blue-900">
            ✓ You selected <strong>{selectedRole}</strong>. We'll tailor questions to match this role.
          </p>
        </div>
      )}
    </div>
  );
}
