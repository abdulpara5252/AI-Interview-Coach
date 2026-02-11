import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAppUser } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const result = await requireAppUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const session = await prisma.session.findFirst({
    where: { id: params.id, userId: result.user.id },
    include: {
      questions: { orderBy: { order: "asc" } },
      answers: { orderBy: { createdAt: "asc" } }
    }
  });

  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  return NextResponse.json(session);
}
