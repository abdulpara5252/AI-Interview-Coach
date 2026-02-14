"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface Session {
  id: string;
  role: string;
  interviewType: string;
  overallScore: number | null;
  grade: string | null;
  createdAt: string;
  duration: number;
}

interface RecentSessionsTableProps {
  sessions: Session[];
}

function getScoreColor(score: number) {
  if (score >= 80) return "bg-violet-100 text-violet-800";
  if (score >= 70) return "bg-purple-100 text-purple-800";
  if (score >= 50) return "bg-amber-100 text-amber-800";
  return "bg-rose-100 text-rose-800";
}

function getGradeColor(grade: string) {
  const gradeColorMap: Record<string, string> = {
    A: "bg-violet-100 text-violet-800",
    B: "bg-purple-100 text-purple-800",
    C: "bg-amber-100 text-amber-800",
    D: "bg-orange-100 text-orange-800",
    F: "bg-rose-100 text-rose-800",
  };
  return gradeColorMap[grade] || "bg-gray-100 text-gray-800";
}

export function RecentSessionsTable({ sessions }: RecentSessionsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-violet-100">
            <th className="text-left py-3 px-4 font-semibold text-violet-700">Role</th>
            <th className="text-left py-3 px-4 font-semibold text-violet-700">Type</th>
            <th className="text-left py-3 px-4 font-semibold text-violet-700">Score</th>
            <th className="text-left py-3 px-4 font-semibold text-violet-700">Grade</th>
            <th className="text-left py-3 px-4 font-semibold text-violet-700">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-violet-700">Duration</th>
            <th className="text-left py-3 px-4 font-semibold text-violet-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr
              key={session.id}
              className="border-b border-violet-50 hover:bg-violet-50/50 transition-colors"
            >
              <td className="py-4 px-4 text-gray-900 font-medium">{session.role}</td>
              <td className="py-4 px-4">
                <Badge
                  variant="outline"
                  className="capitalize bg-violet-50 text-violet-700 border-violet-200"
                >
                  {session.interviewType}
                </Badge>
              </td>
              <td className="py-4 px-4">
                {session.overallScore != null ? (
                  <Badge className={getScoreColor(session.overallScore)}>
                    {session.overallScore}%
                  </Badge>
                ) : (
                  <span className="text-violet-400">—</span>
                )}
              </td>
              <td className="py-4 px-4">
                {session.grade ? (
                  <Badge className={getGradeColor(session.grade)}>
                    {session.grade}
                  </Badge>
                ) : (
                  <span className="text-violet-400">—</span>
                )}
              </td>
              <td className="py-4 px-4 text-violet-700/60">
                {new Date(session.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="py-4 px-4 text-violet-700/60">{session.duration} min</td>
              <td className="py-4 px-4">
                <Link href={`/interview/${session.id}/feedback`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:bg-violet-100 hover:text-violet-700 rounded-lg"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
