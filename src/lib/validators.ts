import { z } from "zod";

export const onboardingSchema = z.object({
  name: z.string().trim().min(1).max(120),
  targetRole: z.string().trim().min(2).max(120),
  experience: z.string().trim().min(2).max(60),
  preferredInterview: z.enum(["technical", "behavioral", "mixed"]).default("mixed"),
  bio: z.string().trim().max(300).optional().default(""),
  companies: z.array(z.string().trim().min(1).max(80)).max(10).optional().default([])
});

export const createSessionSchema = z.object({
  role: z.string().trim().min(2).max(120),
  interviewType: z.enum(["technical", "behavioral", "mixed"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  duration: z.number().int().min(15 * 60).max(60 * 60)
});

export const completeSessionSchema = z.object({
  transcript: z
    .array(
      z.object({
        speaker: z.enum(["agent", "user"]),
        text: z.string().min(1),
        timestamp: z.number().int().nonnegative()
      })
    )
    .default([]),
  audioUrl: z.string().url().optional(),
  status: z.enum(["completed", "abandoned"]).default("completed")
});

export const toggleShareSchema = z.object({
  enabled: z.boolean()
});
