export type InterviewDimensionScores = {
  content: number;
  communication: number;
  problemSolving: number;
  confidence: number;
};

export type PerQuestionFeedback = {
  question: string;
  score: number;
  feedback: string;
  idealAnswerSummary?: string;
  tip?: string;
};

export type FeedbackReport = {
  overallScore: number;
  grade?: string;
  dimensions: InterviewDimensionScores;
  strengths: string[];
  improvements: string[];
  fillerWords: number;
  resources?: string[];
  perQuestion: PerQuestionFeedback[];
};

export type DashboardResponse = {
  sessionsCount: number;
  avgScore: number;
  improvementRate: number;
  trend: Array<{ date: string; score: number }>;
  dimensionAverage: InterviewDimensionScores;
  roleBreakdown: Array<{ role: string; avgScore: number }>;
};

export type SessionsPageResponse = {
  items: Array<{
    id: string;
    role: string;
    interviewType: string;
    difficulty: string;
    overallScore: number | null;
    createdAt: string;
    status: string;
  }>;
  nextCursor: string | null;
};
