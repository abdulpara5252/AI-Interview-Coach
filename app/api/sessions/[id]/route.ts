import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const session = await prisma.session.findFirst({
      where: { id, userId: user.id },
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const body = await req.json();
    const isPublic = typeof body.isPublic === "boolean" ? body.isPublic : undefined;
    if (isPublic === undefined) {
      return NextResponse.json({ error: "isPublic required" }, { status: 400 });
    }

    await prisma.session.update({
      where: { id },
      data: { isPublic },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SESSIONS_PATCH_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
