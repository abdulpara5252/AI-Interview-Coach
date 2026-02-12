import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number) {
  if (score >= 70) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  return "text-red-500";
}

export function getScoreBadgeVariant(
  score: number
): "default" | "secondary" | "destructive" {
  if (score >= 70) return "default";
  if (score >= 50) return "secondary";
  return "destructive";
}

export function getGradeColor(grade: string) {
  if (["A+", "A"].includes(grade)) return "text-green-500";
  if (["B+", "B"].includes(grade)) return "text-blue-500";
  if (["C+", "C"].includes(grade)) return "text-yellow-500";
  return "text-red-500";
}
