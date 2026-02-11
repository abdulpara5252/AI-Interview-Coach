import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type ClerkEvent = {
  type: string;
  data: {
    id: string;
    first_name?: string;
    last_name?: string;
    image_url?: string;
    email_addresses?: Array<{ email_address?: string }>;
  };
};

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let event: ClerkEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature
    }) as ClerkEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    await prisma.user.upsert({
      where: { clerkId: event.data.id },
      create: {
        clerkId: event.data.id,
        email: event.data.email_addresses?.[0]?.email_address ?? `${event.data.id}@example.com`,
        name: `${event.data.first_name ?? ""} ${event.data.last_name ?? ""}`.trim(),
        avatarUrl: event.data.image_url,
        preferences: { create: {} }
      },
      update: {
        email: event.data.email_addresses?.[0]?.email_address ?? undefined,
        name: `${event.data.first_name ?? ""} ${event.data.last_name ?? ""}`.trim(),
        avatarUrl: event.data.image_url
      }
    });
  }

  if (event.type === "user.deleted") {
    await prisma.user.delete({ where: { clerkId: event.data.id } }).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}
