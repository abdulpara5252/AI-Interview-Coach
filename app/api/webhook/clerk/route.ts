import { Webhook } from "svix";
import { headers } from "next/headers";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("[CLERK_WEBHOOK] CLERK_WEBHOOK_SECRET is not set");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[CLERK_WEBHOOK] Signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const { id: clerkId, email_addresses, first_name, last_name, image_url } = evt.data;

  try {
    if (evt.type === "user.created") {
      const primaryEmail = email_addresses?.find((e) => e.id === evt.data.primary_email_address_id)?.email_address
        ?? email_addresses?.[0]?.email_address;
      if (!primaryEmail) {
        console.error("[CLERK_WEBHOOK] No email for user.created", clerkId);
        return new Response("No email", { status: 400 });
      }
      await prisma.user.create({
        data: {
          clerkId,
          email: primaryEmail,
          name: [first_name, last_name].filter(Boolean).join(" ") || null,
          avatarUrl: image_url ?? null,
        },
      });
    } else if (evt.type === "user.updated") {
      const primaryEmail = email_addresses?.find((e) => e.id === evt.data.primary_email_address_id)?.email_address
        ?? email_addresses?.[0]?.email_address;
      await prisma.user.updateMany({
        where: { clerkId },
        data: {
          ...(primaryEmail && { email: primaryEmail }),
          name: [first_name, last_name].filter(Boolean).join(" ") || null,
          avatarUrl: image_url ?? null,
        },
      });
    } else if (evt.type === "user.deleted") {
      if (evt.data.id) {
        await prisma.user.deleteMany({ where: { clerkId: evt.data.id } });
      }
    }
  } catch (err) {
    console.error("[CLERK_WEBHOOK] Prisma error", err);
    return new Response("Internal error", { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
