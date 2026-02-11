import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAppUser } from "@/lib/auth";
import { onboardingSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const result = await requireAppUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const parsed = onboardingSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid onboarding payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const { preferredInterview, ...userData } = parsed.data;

  const user = await prisma.user.update({
    where: { id: result.user.id },
    data: {
      ...userData,
      preferences: {
        upsert: {
          create: { preferredInterview },
          update: { preferredInterview }
        }
      }
    },
    include: { preferences: true }
  });

  return NextResponse.json(user);
}
