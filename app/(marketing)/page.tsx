import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="container flex h-16 items-center justify-between">
        <span className="font-bold text-xl">HirinAi</span>
        <nav className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-white text-slate-900 hover:bg-slate-100">
              Get started
            </Button>
          </Link>
        </nav>
      </header>
      <main className="container flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          AI Interview Coach
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Practice technical and behavioral interviews with a voice-powered AI coach.
          Get structured feedback, track your scores, and improve with every session.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/sign-up">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              Start practicing
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Sign in
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
