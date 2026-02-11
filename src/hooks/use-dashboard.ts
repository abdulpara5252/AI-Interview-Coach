"use client";

import { useQuery } from "@tanstack/react-query";
import { type DashboardResponse } from "@/lib/types";

export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to load dashboard");
      return res.json() as Promise<DashboardResponse>;
    }
  });
}
