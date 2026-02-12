import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ shareToken: string }> }
) {
  try {
    const { shareToken } = await params;
    const session = await prisma.session.findFirst({
      where: { shareToken, isPublic: true },
      include: {
        questions: { orderBy: { order: "asc" } },
        answers: { include: { question: true }, orderBy: { createdAt: "asc" } },
      },
    });
    if (!session) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    return NextResponse.json(session);
  } catch (error) {
    console.error("[REPORT_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
