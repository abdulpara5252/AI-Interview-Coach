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

    const body = await req.json();
    const targetRole = typeof body.targetRole === "string" ? body.targetRole.trim() : "";
    const experience = typeof body.experience === "string" ? body.experience.trim() : "";
    const sessionDuration = typeof body.sessionDuration === "number" ? body.sessionDuration : 30;
    const voiceGender = typeof body.voiceGender === "string" ? body.voiceGender.trim() : "neutral";

    if (!targetRole || !ROLES.includes(targetRole as (typeof ROLES)[number])) {
      return NextResponse.json({ error: "Invalid target role" }, { status: 400 });
    }
    if (!experience || !EXPERIENCE_LEVELS.includes(experience as (typeof EXPERIENCE_LEVELS)[number])) {
      return NextResponse.json({ error: "Invalid experience level" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        targetRole, 
        experience,
        sessionDuration,
        voiceGender,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ONBOARDING_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
