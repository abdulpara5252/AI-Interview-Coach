"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedbackReport } from "@/components/feedback/FeedbackReport";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function fetchFeedback(sessionId: string) {
  const res = await fetch(`/api/feedback/${sessionId}`);
  if (!res.ok) throw new Error("Failed to load feedback");
  return res.json();
}

export default function FeedbackPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const { data: session, isLoading } = useQuery({
    queryKey: ["feedback", sessionId],
    queryFn: () => fetchFeedback(sessionId),
    enabled: !!sessionId,
    staleTime: Infinity,
  });

  const handleShare = () => {
    if (session?.shareToken) {
      const url = `${typeof window !== "undefined" ? window.location.origin : ""}/report/${session.shareToken}`;
      void navigator.clipboard.writeText(url);
    }
  };

  if (isLoading || !session) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/sessions">
          <Button variant="ghost">← Back to sessions</Button>
        </Link>
      </div>
      <FeedbackReport session={session} onShare={handleShare} />
    </div>
  );
}
