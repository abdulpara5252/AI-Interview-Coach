"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

async function checkOnboardingStatus() {
  try {
    const res = await fetch("/api/user/onboard/status", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!res.ok) {
      throw new Error("Failed to check onboarding status");
    }
    
    const data = await res.json();
    return data.isOnboarded;
  } catch (error) {
    console.error("[DASHBOARD_WRAPPER] Error checking onboarding status:", error);
    return false;
  }
}

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  const { data: isOnboarded, isLoading } = useQuery({
    queryKey: ["onboarding-status"],
    queryFn: checkOnboardingStatus,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0,
  });

  useEffect(() => {
    if (!isLoading && isOnboarded === false) {
      setShouldRedirect(true);
    }
  }, [isOnboarded, isLoading]);

  useEffect(() => {
    if (shouldRedirect) {
      redirect("/onboarding");
    }
  }, [shouldRedirect]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-purple-subtle">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-violet-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (shouldRedirect) {
    return null; // Will redirect
  }

  return <>{children}</>;
}