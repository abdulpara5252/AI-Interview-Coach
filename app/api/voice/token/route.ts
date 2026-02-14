import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    console.log("[VOICE_TOKEN] Starting voice token request");
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.log("[VOICE_TOKEN] Unauthorized - no clerkId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      console.log("[VOICE_TOKEN] User not found:", clerkId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    console.log("[VOICE_TOKEN] Request for sessionId:", sessionId);
    
    if (!sessionId) {
      console.log("[VOICE_TOKEN] Missing sessionId parameter");
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId: user.id },
      include: { questions: { orderBy: { order: "asc" } } },
    });
    if (!session) {
      console.log("[VOICE_TOKEN] Session not found:", sessionId);
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const agentId = process.env.ELEVENLABS_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;
    console.log("[VOICE_TOKEN] Using agent:", agentId?.substring(0, 15) + "...");

    if (!agentId || !apiKey) {
      console.log("[VOICE_TOKEN] Missing ElevenLabs config");
      return NextResponse.json(
        { error: "ElevenLabs agent or API key not configured" },
        { status: 503 }
      );
    }

    const elevenLabsUrl = `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`;
    console.log("[VOICE_TOKEN] Calling ElevenLabs API:", elevenLabsUrl);

    // For GET request, we pass parameters via query string or headers
    // The agent should be configured in ElevenLabs dashboard with:
    // - Personality: Professional interviewer named Claire
    // - System prompt: You are Claire, an AI interview coach conducting realistic mock interviews...
    // - Dynamic context will be passed via metadata

    const response = await fetch(elevenLabsUrl, {
      method: "GET",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    console.log("[VOICE_TOKEN] ElevenLabs response status:", response.status);
    if (!response.ok) {
      const err = await response.text();
      console.error("[VOICE_TOKEN_ELEVENLABS]", response.status, err);
      return NextResponse.json(
        { error: `ElevenLabs API error: ${err}` },
        { status: 502 }
      );
    }

    const body = (await response.json()) as { signed_url?: string };
    const signedUrl = body.signed_url;
    console.log("[VOICE_TOKEN] Signed URL received:", signedUrl ? "YES" : "NO");

    if (!signedUrl) {
      console.error("[VOICE_TOKEN] No signed URL in response:", body);
      return NextResponse.json(
        { error: "No signed URL in response" },
        { status: 502 }
      );
    }

    // Generate a unique conversation ID for tracking
    const conversationId = `conv_${sessionId}_${Date.now()}`;
    
    // Store conversation metadata for later reference
    console.log("[VOICE_TOKEN] Session context:", {
      sessionId,
      conversationId,
      role: session.role,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
      questionCount: session.questions.length,
    });

    return NextResponse.json({
      signedUrl,
      sessionId,
      conversationId,
      // Pass interview context to client for ElevenLabs agent configuration
      interviewContext: {
        role: session.role,
        interviewType: session.interviewType,
        difficulty: session.difficulty,
        questions: session.questions.map(q => q.text),
        firstQuestion: session.questions[0]?.text ?? "Tell me about yourself.",
      },
    });
  } catch (error) {
    console.error("[VOICE_TOKEN_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
