import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ 
      where: { clerkId },
      select: { 
        onboardedAt: true, 
        targetRole: true, 
        experience: true 
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isOnboarded = 
      user.onboardedAt != null || 
      (!!user.targetRole && !!user.experience);

    return NextResponse.json({ 
      isOnboarded,
      onboardedAt: user.onboardedAt,
      targetRole: user.targetRole,
      experience: user.experience
    });
    
  } catch (error) {
    console.error("[ONBOARDING_STATUS_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}