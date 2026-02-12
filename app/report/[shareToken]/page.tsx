"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedbackReport } from "@/components/feedback/FeedbackReport";

async function fetchReport(shareToken: string) {
  const res = await fetch(`/api/report/${shareToken}`);
  if (!res.ok) throw new Error("Report not found");
  return res.json();
}

export default function PublicReportPage() {
  const params = useParams();
  const shareToken = params.shareToken as string;

  const { data: session, isLoading } = useQuery({
    queryKey: ["report", shareToken],
    queryFn: () => fetchReport(shareToken),
    enabled: !!shareToken,
  });

  if (isLoading || !session) {
    return (
      <div className="container py-12">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full mt-6" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <p className="text-muted-foreground text-sm mb-6">
        Shared interview report · HirinAi
      </p>
      <FeedbackReport session={session} />
    </div>
  );
}
