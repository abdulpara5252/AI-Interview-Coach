"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SignIn, SignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  useEffect(() => {
    const auth = searchParams.get("auth");
    if (auth === "signin") {
      setSignInOpen(true);
      setSignUpOpen(false);
    } else if (auth === "signup") {
      setSignUpOpen(true);
      setSignInOpen(false);
    }
  }, [searchParams]);

  const openSignIn = () => {
    setSignInOpen(true);
    setSignUpOpen(false);
    router.replace("/?auth=signin", { scroll: false });
  };
  const openSignUp = () => {
    setSignUpOpen(true);
    setSignInOpen(false);
    router.replace("/?auth=signup", { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="container flex h-16 items-center justify-between">
        <span className="font-bold text-xl">HirinAi</span>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" className="text-white hover:bg-white/10" onClick={openSignIn}>
            Sign in
          </Button>
          <Button className="bg-white text-slate-900 hover:bg-slate-100" onClick={openSignUp}>
            Get started
          </Button>
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
          <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100" onClick={openSignUp}>
            Start practicing
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={openSignIn}>
            Sign in
          </Button>
        </div>
      </main>

      <Dialog
        open={signInOpen}
        onOpenChange={(open) => {
          setSignInOpen(open);
          if (!open) router.replace("/", { scroll: false });
        }}
      >
        <DialogContent className="max-w-[380px] p-0 gap-0 overflow-hidden border-0 bg-transparent shadow-none">
          <div className="flex justify-center rounded-lg bg-background shadow-xl">
            <SignIn
              routing="hash"
              afterSignInUrl="/dashboard"
              signUpUrl="/?auth=signup"
              appearance={{
                elements: {
                  rootBox: "w-full shadow-none",
                  card: "shadow-none w-full",
                },
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={signUpOpen}
        onOpenChange={(open) => {
          setSignUpOpen(open);
          if (!open) router.replace("/", { scroll: false });
        }}
      >
        <DialogContent className="max-w-[380px] p-0 gap-0 overflow-hidden border-0 bg-transparent shadow-none">
          <div className="flex justify-center rounded-lg bg-background shadow-xl">
            <SignUp
              routing="hash"
              afterSignUpUrl="/onboarding"
              signInUrl="/?auth=signin"
              appearance={{
                elements: {
                  rootBox: "w-full shadow-none",
                  card: "shadow-none w-full",
                },
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
