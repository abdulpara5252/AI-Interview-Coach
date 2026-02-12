"use client";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import WelcomeStep from "./steps/WelcomeStep";
import RoleSelectionStep from "./steps/RoleSelectionStep";
import ExperienceStep from "./steps/ExperienceStep";
import PreferencesStep from "./steps/PreferencesStep";
import ReadyStep from "./steps/ReadyStep";

interface OnboardingWizardProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: {
    targetRole: string;
    experience: string;
    sessionDuration: number;
    voiceGender: string;
  };
  setFormData: (data: any) => void;
  onComplete: () => void;
  isLoading: boolean;
  error?: string;
}

const TOTAL_STEPS = 5;

export default function OnboardingWizard({
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  onComplete,
  isLoading,
  error,
}: OnboardingWizardProps) {
  const progressPercent = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return true; // Welcome step always valid
      case 1:
        return !!formData.targetRole;
      case 2:
        return !!formData.experience;
      case 3:
        return true; // Preferences always has defaults
      case 4:
        return true; // Ready step always valid
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Step {currentStep + 1} of {TOTAL_STEPS}
            </h2>
            <p className="text-xs text-muted-foreground">{Math.round(progressPercent)}%</p>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          {currentStep === 0 && <WelcomeStep />}
          {currentStep === 1 && (
            <RoleSelectionStep
              selectedRole={formData.targetRole}
              onRoleSelect={(role) =>
                setFormData({ ...formData, targetRole: role })
              }
            />
          )}
          {currentStep === 2 && (
            <ExperienceStep
              selectedLevel={formData.experience}
              onLevelSelect={(level) =>
                setFormData({ ...formData, experience: level })
              }
            />
          )}
          {currentStep === 3 && (
            <PreferencesStep
              sessionDuration={formData.sessionDuration}
              voiceGender={formData.voiceGender}
              onSessionDurationChange={(duration) =>
                setFormData({ ...formData, sessionDuration: duration })
              }
              onVoiceGenderChange={(gender) =>
                setFormData({ ...formData, voiceGender: gender })
              }
            />
          )}
          {currentStep === 4 && <ReadyStep formData={formData} />}

          {error && (
            <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8 justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isLoading}
            className="px-6"
          >
            Back
          </Button>
          {currentStep < TOTAL_STEPS - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isLoading}
              className="px-8 bg-primary hover:bg-primary/90"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              disabled={isLoading}
              className="px-8 bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Starting..." : "Start Practicing"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
