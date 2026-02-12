export const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Product Manager",
  "Data Scientist",
  "UX/UI Designer",
  "DevOps Engineer",
  "Mobile Developer",
] as const;

export type Role = (typeof ROLES)[number];

export const EXPERIENCE_LEVELS = ["junior", "mid", "senior"] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const INTERVIEW_TYPES = [
  "technical",
  "behavioral",
  "mixed",
] as const;
export type InterviewType = (typeof INTERVIEW_TYPES)[number];

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export interface TranscriptEntry {
  speaker: "ai" | "user";
  text: string;
  timestamp: Date;
}

export interface AnswerFeedbackScores {
  contentAccuracy: number;
  communication: number;
  problemSolving: number;
  confidence: number;
}

export interface AnswerFeedback {
  scores: AnswerFeedbackScores;
  overallScore: number;
  grade: string;
  strengths: string[];
  improvements: string[];
  idealAnswerSummary: string;
  fillerWords: { count: number; examples: string[] };
  tip: string;
}

export interface DashboardStats {
  totalSessions: number;
  avgScore: number;
  currentStreak: number;
  improvementRate: number;
  scoreTrend: { date: string; avgScore: number }[];
  roleBreakdown: { role: string; count: number; avgScore: number }[];
  dimensionAverages: AnswerFeedbackScores;
  recentSessions: {
    id: string;
    role: string;
    interviewType: string;
    overallScore: number | null;
    grade: string | null;
    createdAt: string;
    duration: number;
  }[];
}
