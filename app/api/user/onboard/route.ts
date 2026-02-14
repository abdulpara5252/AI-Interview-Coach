import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ROLES, EXPERIENCE_LEVELS } from "@/types";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Body must be an object" }, { status: 400 });
    }

    const targetRole = typeof body.targetRole === "string" ? body.targetRole.trim() : "";
    const experience = typeof body.experience === "string" ? body.experience.trim() : "";
    const rawDuration = body.sessionDuration;
    const preferredDuration =
      typeof rawDuration === "number"
        ? rawDuration
        : typeof rawDuration === "string"
          ? parseInt(String(rawDuration), 10)
          : 30;
    const safeDuration =
      Number.isFinite(preferredDuration) && preferredDuration >= 5 && preferredDuration <= 120
        ? preferredDuration
        : 30;
    const voiceGender =
      typeof body.voiceGender === "string" ? body.voiceGender.trim() || "neutral" : "neutral";

    if (!targetRole || !ROLES.includes(targetRole as (typeof ROLES)[number])) {
      return NextResponse.json({ error: "Invalid target role" }, { status: 400 });
    }
    if (
      !experience ||
      !EXPERIENCE_LEVELS.includes(experience as (typeof EXPERIENCE_LEVELS)[number])
    ) {
      return NextResponse.json({ error: "Invalid experience level" }, { status: 400 });
    }

    // Success = User (targetRole, experience, onboardedAt) + UserPreference row
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          targetRole,
          experience,
          onboardedAt: new Date(),
        },
      }),
      prisma.userPreference.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          preferredDuration: safeDuration,
          voiceGender,
        },
        update: {
          preferredDuration: safeDuration,
          voiceGender,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[USER_ONBOARD_ERROR]", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      {
        error: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { details: message }),
      },
      { status: 500 }
    );
  }
}
