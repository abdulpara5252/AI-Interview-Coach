import { useQuery } from "@tanstack/react-query";
import type { DashboardStats } from "@/types";

async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch("/api/dashboard/stats");
  if (!res.ok) throw new Error("Failed to load dashboard stats");
  return res.json();
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5,
  });
}
