"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateSessionPayload = { role: string; interviewType: string; difficulty: string; duration: number };

type CreateSessionResponse = {
  id: string;
  role: string;
  interviewType: string;
  difficulty: string;
  duration: number;
};

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation<CreateSessionResponse, Error, CreateSessionPayload>({
    mutationFn: async (payload) => {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to create session");
      return res.json() as Promise<CreateSessionResponse>;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });
      const previousDashboard = queryClient.getQueryData(["dashboard"]);
      return { previousDashboard };
    },
    onError: (_error, _vars, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(["dashboard"], context.previousDashboard);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });
}
