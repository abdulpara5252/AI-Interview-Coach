"use client";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import WelcomeStep from "./steps/WelcomeStep";
import RoleSelectionStep from "./steps/RoleSelectionStep";
import ExperienceStep from "./steps/ExperienceStep";
import PreferencesStep from "./steps/PreferencesStep";
import ReadyStep from "./steps/ReadyStep";
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react";

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

const STEP_LABELS = ["Welcome", "Role", "Experience", "Preferences", "Ready"];

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
        return true;
      case 1:
        return !!formData.targetRole;
      case 2:
        return !!formData.experience;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen gradient-purple-hero flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] blob-purple rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] blob-pink rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl animate-fade-in-scale">
        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    i < currentStep
                      ? "gradient-purple text-white shadow-purple-sm"
                      : i === currentStep
                      ? "gradient-purple-pink text-white shadow-purple glow-purple"
                      : "bg-violet-100 text-violet-400"
                  }`}
                >
                  {i < currentStep ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  i <= currentStep ? "text-violet-700" : "text-violet-400"
                }`}>
                  {label}
                </span>
              </div>
              {i < TOTAL_STEPS - 1 && (
                <div
                  className={`w-8 h-0.5 rounded-full transition-all duration-300 mb-5 sm:mb-0 ${
                    i < currentStep ? "bg-violet-500" : "bg-violet-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progressPercent} className="h-1.5 bg-violet-100" />
        </div>

        {/* Step Content Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-purple-lg border border-violet-100/50 p-8 animate-slide-in">
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
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6 justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isLoading}
            className="px-6 border-violet-200 text-violet-700 hover:bg-violet-50 rounded-xl disabled:opacity-40"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {currentStep < TOTAL_STEPS - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isLoading}
              className="px-8 gradient-purple text-white hover:opacity-90 shadow-purple-sm hover:shadow-purple rounded-xl transition-all disabled:opacity-40"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              disabled={isLoading}
              className="px-8 gradient-purple-pink text-white hover:opacity-90 shadow-purple hover:shadow-purple-lg rounded-xl transition-all disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Starting...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  Start Practicing
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
