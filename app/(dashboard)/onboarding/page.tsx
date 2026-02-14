"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

async function completeOnboarding(payload: {
  targetRole: string;
  experience: string;
  sessionDuration: number;
  voiceGender: string;
}) {
  const res = await fetch("/api/user/onboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to save");
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    targetRole: "",
    experience: "",
    sessionDuration: 30,
    voiceGender: "neutral",
  });

  const mutation = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => router.push("/dashboard"),
  });

  const handleComplete = () => {
    mutation.mutate(formData);
  };

  return (
    <OnboardingWizard
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      formData={formData}
      setFormData={setFormData}
      onComplete={handleComplete}
      isLoading={mutation.isPending}
      error={mutation.error?.message}
    />
  );
}
