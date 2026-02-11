import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.ELEVENLABS_API_KEY || !process.env.ELEVENLABS_AGENT_ID) {
    return NextResponse.json({ error: "ElevenLabs is not configured" }, { status: 500 });
  }

  return NextResponse.json({
    provider: "elevenlabs",
    agentId: process.env.ELEVENLABS_AGENT_ID,
    token: `dev-elevenlabs-${userId}-${Date.now()}`,
    expiresIn: 60 * 30
  });
}
