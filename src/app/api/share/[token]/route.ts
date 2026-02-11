import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { token: string } }) {
  const session = await prisma.session.findFirst({
    where: { shareToken: params.token, status: "completed", isPublic: true },
    select: {
      id: true,
      role: true,
      interviewType: true,
      difficulty: true,
      overallScore: true,
      grade: true,
      feedback: true,
      createdAt: true
    }
  });

  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(session);
}
