import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-12">
      <section className="space-y-6 text-center">
        <h1 className="text-4xl font-bold">AI Interview Coach</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Voice-powered mock interviews with instant GPT-4o feedback and progress analytics for real career growth.
        </p>
        <div className="flex justify-center gap-4">
          <Link className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-white" href="/dashboard">Go to Dashboard</Link>
          <Link className="inline-flex h-10 items-center rounded-md border px-4 text-sm font-medium" href="/interview/new">Start Interview</Link>
          <Link className="inline-flex h-10 items-center rounded-md border px-4 text-sm font-medium" href="/pricing">See Pricing</Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Voice Interview Agent", "Natural conversation pressure with transcript + timing controls."],
          ["AI Feedback Engine", "Weighted scoring across content, communication, problem solving, and confidence."],
          ["Analytics Dashboard", "Trend lines, dimension radar, and role breakdown to track momentum."]
        ].map(([title, desc]) => (
          <Card key={title}><CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{desc}</CardContent></Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>What users say</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>“This felt like a real onsite loop, and the feedback was actually useful.” — Frontend Candidate</p>
            <p>“I improved my behavioral storytelling in two weeks.” — PM Candidate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Why now?</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Human mock interviews are expensive and hard to schedule. AI Interview Coach gives instant, repeatable practice anytime.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
