import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAppUser } from "@/lib/auth";

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  const result = await requireAppUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role")?.trim();
  const difficulty = searchParams.get("difficulty")?.trim();
  const interviewType = searchParams.get("interviewType")?.trim();
  const cursor = searchParams.get("cursor")?.trim();

  const items = await prisma.session.findMany({
    where: {
      userId: result.user.id,
      role: role ? { contains: role, mode: "insensitive" } : undefined,
      difficulty: difficulty ? { contains: difficulty, mode: "insensitive" } : undefined,
      interviewType: interviewType ? { contains: interviewType, mode: "insensitive" } : undefined
    },
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    select: {
      id: true,
      role: true,
      interviewType: true,
      difficulty: true,
      overallScore: true,
      status: true,
      createdAt: true
    }
  });

  return NextResponse.json({
    items: items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })),
    nextCursor: items.length === PAGE_SIZE ? items[items.length - 1]?.id ?? null : null
  });
}
