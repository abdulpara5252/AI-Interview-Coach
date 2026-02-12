import { useInfiniteQuery } from "@tanstack/react-query";

interface SessionItem {
  id: string;
  role: string;
  interviewType: string;
  difficulty: string;
  duration: number;
  status: string;
  overallScore: number | null;
  grade: string | null;
  createdAt: string;
}

interface SessionsResponse {
  sessions: SessionItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

async function fetchSessions({
  pageParam = 1,
  role = "",
  type = "",
}: {
  pageParam?: number;
  role?: string;
  type?: string;
}): Promise<SessionsResponse> {
  const params = new URLSearchParams({
    page: String(pageParam),
    limit: "10",
    ...(role && { role }),
    ...(type && { type }),
  });
  const res = await fetch(`/api/sessions?${params}`);
  if (!res.ok) throw new Error("Failed to load sessions");
  return res.json();
}

export function useSessions(filters: { role?: string; type?: string } = {}) {
  return useInfiniteQuery({
    queryKey: ["sessions", filters],
    queryFn: ({ pageParam }) =>
      fetchSessions({
        pageParam: pageParam as number,
        role: filters.role,
        type: filters.type,
      }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.hasMore ? last.meta.page + 1 : undefined,
    staleTime: 1000 * 60 * 2,
  });
}
