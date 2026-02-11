"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSessions } from "@/hooks/use-sessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SessionsPage() {
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const query = useSessions({ role, difficulty, interviewType });

  const items = useMemo(() => query.data?.pages.flatMap((p) => p.items) ?? [], [query.data]);

  return (
    <main className="space-y-4 p-8">
      <h1 className="text-2xl font-bold">Session History</h1>
      <div className="grid gap-2 md:grid-cols-3">
        <Input placeholder="Filter by role" value={role} onChange={(e) => setRole(e.target.value)} />
        <Input placeholder="Filter by difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
        <Input placeholder="Filter by type" value={interviewType} onChange={(e) => setInterviewType(e.target.value)} />
      </div>

      {query.isError ? <p className="text-sm text-red-600">Failed to load sessions.</p> : null}
      {query.isLoading ? <p className="text-sm text-muted-foreground">Loading sessions...</p> : null}

      <div className="grid gap-3">
        {items.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {session.role} • {session.interviewType}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>{session.difficulty} • {session.status}</p>
              <p>Score {session.overallScore ?? "N/A"}</p>
              <Link className="text-blue-600 underline" href={`/sessions/${session.id}`}>View details</Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={() => query.fetchNextPage()} disabled={!query.hasNextPage || query.isFetchingNextPage}>
        {query.isFetchingNextPage ? "Loading..." : "Load More"}
      </Button>
    </main>
  );
}
