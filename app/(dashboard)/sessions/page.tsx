"use client";

import Link from "next/link";
import { useState } from "react";
import { useSessions } from "@/hooks/useSessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ROLES, INTERVIEW_TYPES } from "@/types";
import { getScoreColor, getGradeColor } from "@/lib/utils";
import { Eye, Trash2, Calendar } from "lucide-react";

const DATE_RANGES = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 3 months", days: 90 },
  { label: "All time", days: null },
];

function getRoleColor(role: string): string {
  const colorMap: Record<string, string> = {
    "Frontend Developer": "bg-blue-100 text-blue-800",
    "Backend Developer": "bg-purple-100 text-purple-800",
    "Full Stack Developer": "bg-indigo-100 text-indigo-800",
    "Product Manager": "bg-pink-100 text-pink-800",
    "Data Scientist": "bg-orange-100 text-orange-800",
    "UX/UI Designer": "bg-green-100 text-green-800",
    "DevOps Engineer": "bg-red-100 text-red-800",
    "Mobile Developer": "bg-cyan-100 text-cyan-800",
  };
  return colorMap[role] || "bg-gray-100 text-gray-800";
}

function getTypeColor(type: string): string {
  const typeColorMap: Record<string, string> = {
    technical: "bg-blue-50 text-blue-700 border-blue-200",
    behavioral: "bg-amber-50 text-amber-700 border-amber-200",
    mixed: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return typeColorMap[type] || "bg-gray-50 text-gray-700";
}

function getScoreBadgeColor(score: number | null): string {
  if (score === null) return "bg-gray-100 text-gray-800";
  if (score >= 70) return "bg-green-100 text-green-800";
  if (score >= 50) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

function formatRelativeDate(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export default function SessionsPage() {
  const [role, setRole] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [dateRange, setDateRange] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useSessions({ role: role || undefined, type: type || undefined });

  const sessions = data?.pages.flatMap((p) => p.sessions) ?? [];
  const totalCount = data?.pages[0]?.meta?.total ?? 0;
  const currentCount = sessions.length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-700 font-medium">Failed to load sessions. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Session History</h1>
          <p className="text-slate-600 mt-1">Review your interview practice sessions</p>
        </div>
        <Link href="/interview/new">
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg">
            New Interview
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select value={role || "all"} onValueChange={(v) => setRole(v === "all" ? "" : v)}>
              <SelectTrigger className="border-slate-200">
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
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {INTERVIEW_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange?.toString() || "all"} onValueChange={(v) => setDateRange(v === "all" ? null : Number(v))}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                {DATE_RANGES.filter(r => r.days).map((range) => (
                  <SelectItem key={range.days} value={range.days?.toString() || "all"}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Showing {currentCount} of {totalCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {sessions.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-4">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto" />
              </div>
              <p className="text-lg font-medium text-slate-900">No sessions yet</p>
              <p className="text-slate-600 mt-1 mb-4">Start your first interview to build your practice history</p>
              <Link href="/interview/new">
                <Button className="bg-blue-600 hover:bg-blue-700">Start Your First Interview</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sessions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <Badge className={`${getRoleColor(s.role)} border-0`}>
                          {s.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={getTypeColor(s.interviewType)}>
                          {s.interviewType.charAt(0).toUpperCase() + s.interviewType.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {s.overallScore !== null ? (
                          <Badge className={`${getScoreBadgeColor(s.overallScore)} border-0 text-sm font-semibold`}>
                            {s.overallScore}%
                          </Badge>
                        ) : (
                          <span className="text-slate-500 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {s.grade ? (
                          <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ${getGradeColor(s.grade)}`}>
                            {s.grade}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{s.duration} min</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatRelativeDate(s.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/interview/${s.id}/feedback`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setDeleteId(s.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {sessions.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {currentCount} of {totalCount} sessions
          </p>
          {hasNextPage && (
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="rounded-lg"
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete session?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The session and all associated feedback will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // TODO: Implement delete API call
                setDeleteId(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
