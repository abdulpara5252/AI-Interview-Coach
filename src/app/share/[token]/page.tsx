import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SharePage({ params }: { params: { token: string } }) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/share/${params.token}`, { cache: "no-store" });

  if (!res.ok) {
    return <main className="p-8">Report not found.</main>;
  }

  const data = await res.json();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Card>
        <CardHeader><CardTitle>Shared Interview Report</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Role: {data.role}</p>
          <p>Type: {data.interviewType}</p>
          <p>Difficulty: {data.difficulty}</p>
          <p>Overall score: {data.overallScore ?? "N/A"}</p>
          <p>Grade: {data.grade ?? "N/A"}</p>
        </CardContent>
      </Card>
    </main>
  );
}
