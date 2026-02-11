import { POST as completeById } from "@/app/api/interviews/[id]/complete/route";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { sessionId?: string; transcript?: unknown; audioUrl?: string; status?: "completed" | "abandoned" };
  if (!body.sessionId) {
    return Response.json({ error: "sessionId is required" }, { status: 400 });
  }

  return completeById(
    new Request(req.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: body.transcript ?? [], audioUrl: body.audioUrl, status: body.status ?? "completed" })
    }),
    { params: { id: body.sessionId } }
  );
}
