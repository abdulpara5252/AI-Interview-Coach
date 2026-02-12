"use client";

import Link from "next/link";
import { useState } from "react";
import { useSessions } from "@/hooks/useSessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES, INTERVIEW_TYPES } from "@/types";
import { getScoreColor, getGradeColor } from "@/lib/utils";

export default function SessionsPage() {
  const [role, setRole] = useState<string>("");
  const [type, setType] = useState<string>("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useSessions({ role: role || undefined, type: type || undefined });

  const sessions = data?.pages.flatMap((p) => p.sessions) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Failed to load sessions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Session history</h1>
        <Link href="/interview/new">
          <Button>New interview</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-4">
        <Select value={role || "all"} onValueChange={(v) => setRole(v === "all" ? "" : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type || "all"} onValueChange={(v) => setType(v === "all" ? "" : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {INTERVIEW_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No sessions yet. Start your first interview.
            </p>
          ) : (
            <>
              <ul className="space-y-2">
                {sessions.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{s.role} · {s.interviewType}</p>
                      <p className="text-muted-foreground text-sm">
                        {s.difficulty} · {s.duration} min · {new Date(s.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">{s.status}</span>
                      {s.overallScore != null && (
                        <span className={getScoreColor(s.overallScore)}>{s.overallScore}%</span>
                      )}
                      {s.grade && (
                        <span className={getGradeColor(s.grade)}>{s.grade}</span>
                      )}
                      <Link href={`/interview/${s.id}/feedback`}>
                        <Button variant="outline" size="sm">Feedback</Button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
              {hasNextPage && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading…" : "Load more"}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
