"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type FeedbackReport } from "@/lib/types";

export default function FeedbackPage() {
  const { id } = useParams<{ id: string }>();
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<FeedbackReport>({
    queryKey: ["feedback", id],
    queryFn: async () => {
      const res = await fetch(`/api/feedback/${id}`);
      if (!res.ok) throw new Error("Failed to fetch feedback");
      return res.json() as Promise<FeedbackReport>;
    }
  });

  if (isLoading) return <main className="p-8">Loading feedback...</main>;
  if (isError || !data) {
    return (
      <main className="space-y-2 p-8">
        <p className="text-sm text-red-600">Failed to load feedback.</p>
        <Button variant="outline" onClick={() => refetch()}>Retry</Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-8">
      <Card>
        <CardHeader><CardTitle>Interview Feedback</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Overall Score</p>
            <Progress value={data.overallScore} />
            <p className="text-3xl font-bold">{data.overallScore}/100 {data.grade ? `(${data.grade})` : ""}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(data.dimensions).map(([k, v]) => (
              <Badge key={k}>{k}: {String(v)}</Badge>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-lg">Strengths</CardTitle></CardHeader>
              <CardContent><ul className="list-disc pl-5">{data.strengths.map((i) => <li key={i}>{i}</li>)}</ul></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Improvements</CardTitle></CardHeader>
              <CardContent><ul className="list-disc pl-5">{data.improvements.map((i) => <li key={i}>{i}</li>)}</ul></CardContent>
            </Card>
          </div>

          <p>Filler words: <strong>{data.fillerWords}</strong></p>

          <Accordion
            items={data.perQuestion.map((q, idx) => ({
              title: `Q${idx + 1}: ${q.question}`,
              content: `Score ${q.score} - ${q.feedback}`
            }))}
          />

          <div className="flex items-center gap-3">
            <Button
              onClick={async () => {
                const res = await fetch(`/api/sessions/${id}/share`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ enabled: true })
                });
                const json = (await res.json()) as { publicUrl?: string | null };
                setShareUrl(json.publicUrl ?? null);
              }}
            >
              Share Report
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await fetch(`/api/sessions/${id}/share`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ enabled: false })
                });
                setShareUrl(null);
              }}
            >
              Make Private
            </Button>
            {shareUrl ? <a className="text-sm text-blue-600 underline" href={shareUrl}>{shareUrl}</a> : null}
          </div>

          {data.resources?.length ? (
            <div className="space-y-2">
              <p className="font-medium">Recommended resources</p>
              <ul className="list-disc pl-5 text-sm">
                {data.resources.map((resource) => <li key={resource}><a href={resource} className="text-blue-600 underline">{resource}</a></li>)}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
