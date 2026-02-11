import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function requireAppUser() {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized", status: 401 as const };
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return { error: "User not found. Please complete sign up sync.", status: 404 as const };
  }

  return { user };
}
