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
  if (score >= 80) return "bg-green-100 text-green-800";
  if (score >= 70) return "bg-blue-100 text-blue-800";
  if (score >= 50) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

function getGradeColor(grade: string) {
  const gradeColorMap: Record<string, string> = {
    A: "bg-green-100 text-green-800",
    B: "bg-blue-100 text-blue-800",
    C: "bg-yellow-100 text-yellow-800",
    D: "bg-orange-100 text-orange-800",
    F: "bg-red-100 text-red-800",
  };
  return gradeColorMap[grade] || "bg-gray-100 text-gray-800";
}

export function RecentSessionsTable({ sessions }: RecentSessionsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Role</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Score</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Grade</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Duration</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, idx) => (
            <tr
              key={session.id}
              className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                idx === sessions.length - 1 ? "" : ""
              }`}
            >
              <td className="py-4 px-4 text-slate-900 font-medium">{session.role}</td>
              <td className="py-4 px-4">
                <Badge
                  variant="outline"
                  className="capitalize bg-slate-100 text-slate-700 border-slate-200"
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
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="py-4 px-4">
                {session.grade ? (
                  <Badge className={getGradeColor(session.grade)}>
                    {session.grade}
                  </Badge>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="py-4 px-4 text-slate-600">
                {new Date(session.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="py-4 px-4 text-slate-600">{session.duration} min</td>
              <td className="py-4 px-4">
                <Link href={`/interview/${session.id}/feedback`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:bg-blue-100 hover:text-blue-700"
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
