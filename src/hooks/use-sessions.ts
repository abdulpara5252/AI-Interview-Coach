"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { type SessionsPageResponse } from "@/lib/types";

export function useSessions(filters: Record<string, string>) {
  return useInfiniteQuery<SessionsPageResponse>({
    queryKey: ["sessions", filters],
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    queryFn: async ({ pageParam }) => {
      const query = new URLSearchParams();
      if (filters.role) query.set("role", filters.role);
      if (filters.difficulty) query.set("difficulty", filters.difficulty);
      if (pageParam) query.set("cursor", pageParam);
      const res = await fetch(`/api/sessions?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to load sessions");
      return res.json() as Promise<SessionsPageResponse>;
    }
  });
}
