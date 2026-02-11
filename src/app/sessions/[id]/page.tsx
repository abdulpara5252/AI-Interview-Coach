"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      const res = await fetch(`/api/sessions/${id}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    }
  });

  if (isLoading) return <main className="p-8">Loading session...</main>;
  if (isError || !data) return <main className="p-8">Unable to load session.</main>;

  return (
    <main className="space-y-4 p-8">
      <h1 className="text-2xl font-bold">Session Detail</h1>
      <Card>
        <CardHeader><CardTitle>{data.role} • {data.interviewType}</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Status: {data.status}</p>
          <p>Difficulty: {data.difficulty}</p>
          <p>Score: {data.overallScore ?? "N/A"} {data.grade ? `(${data.grade})` : ""}</p>
          <p>Created: {new Date(data.createdAt).toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Transcript</CardTitle></CardHeader>
        <CardContent className="max-h-80 space-y-2 overflow-y-auto text-sm">
          {(data.transcript ?? []).length === 0 ? <p>No transcript saved.</p> : (data.transcript as any[]).map((row, i) => <p key={i}><strong>{row.speaker}:</strong> {row.text}</p>)}
        </CardContent>
      </Card>
    </main>
  );
}
