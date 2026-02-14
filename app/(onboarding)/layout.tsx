import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function OnboardingLayout({
  children,
}: { children: React.ReactNode }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  let user = await prisma.user.findUnique({ where: { clerkId } });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");
    const primaryEmail =
      clerkUser.emailAddresses?.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress ?? clerkUser.emailAddresses?.[0]?.emailAddress;
    if (!primaryEmail) redirect("/sign-in");
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: primaryEmail,
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
        avatarUrl: clerkUser.imageUrl ?? null,
      },
    });
  }

  const isOnboarded =
    user.onboardedAt != null || (!!user.targetRole && !!user.experience);
  if (isOnboarded) redirect("/dashboard");

  return <div className="min-h-screen">{children}</div>;
}
