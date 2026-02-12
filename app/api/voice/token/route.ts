import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: user.id },
      include: { questions: { orderBy: { order: "asc" } } },
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const agentId = process.env.ELEVENLABS_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!agentId || !apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs agent or API key not configured" },
        { status: 503 }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("[VOICE_TOKEN_ELEVENLABS]", response.status, err);
      return NextResponse.json(
        { error: "Failed to get voice session URL" },
        { status: 502 }
      );
    }

    const body = (await response.json()) as { signed_url?: string };
    const signedUrl = body.signed_url;

    if (!signedUrl) {
      return NextResponse.json(
        { error: "No signed URL in response" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      signedUrl,
      sessionId,
      firstMessageContext: {
        role: session.role,
        interviewType: session.interviewType,
        difficulty: session.difficulty,
        firstQuestion: session.questions[0]?.text ?? "Tell me about yourself.",
      },
    });
  } catch (error) {
    console.error("[VOICE_TOKEN_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
