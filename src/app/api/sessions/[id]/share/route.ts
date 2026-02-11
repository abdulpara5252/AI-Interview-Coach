import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAppUser } from "@/lib/auth";
import { toggleShareSchema } from "@/lib/validators";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const result = await requireAppUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const parsed = toggleShareSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid share payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const session = await prisma.session.findFirst({ where: { id: params.id, userId: result.user.id } });
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const updated = await prisma.session.update({
    where: { id: params.id },
    data: { isPublic: parsed.data.enabled }
  });

  return NextResponse.json({
    shareToken: updated.shareToken,
    isPublic: updated.isPublic,
    publicUrl: updated.isPublic ? `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/share/${updated.shareToken}` : null
  });
}
