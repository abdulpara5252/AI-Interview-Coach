import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const { userId } = auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { clerkId: userId }, include: { preferences: true } });

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Card>
        <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Name: {user?.name ?? "-"}</p>
          <p>Email: {user?.email ?? "-"}</p>
          <p>Target role: {user?.targetRole ?? "-"}</p>
          <p>Experience: {user?.experience ?? "-"}</p>
          <p>Bio: {user?.bio ?? "-"}</p>
          <p>Target companies: {user?.companies?.join(", ") || "-"}</p>
          <p>Preferred duration: {user?.preferences?.preferredDuration ?? 30} mins</p>
          <p>Preferred interview: {user?.preferences?.preferredInterview ?? "mixed"}</p>
          <p>Push-to-talk: {user?.preferences?.pushToTalk ? "Enabled" : "Disabled"}</p>
        </CardContent>
      </Card>
    </main>
  );
}
