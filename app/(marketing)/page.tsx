"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SignIn, SignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Mic, TrendingUp, BarChart3, ArrowRight, Check, Play } from "lucide-react";

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

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      quote: "HirinAi helped me practice interviews in a realistic way. The AI feedback was incredibly detailed and helped me improve my communication skills.",
      avatar: "SC",
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      quote: "The structured feedback on all four dimensions really helped me understand my strengths and weaknesses. Highly recommend!",
      avatar: "MJ",
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist",
      quote: "Being able to practice anytime, anywhere with instant feedback is a game-changer. I felt so much more confident in my actual interviews.",
      avatar: "ER",
    },
  ];

  const features = [
    {
      icon: Mic,
      title: "Realistic Voice Interviews",
      description: "Practice with an AI interviewer that sounds and responds like a real human. Get comfortable with voice communication.",
    },
    {
      icon: BarChart3,
      title: "Instant Detailed Feedback",
      description: "Scored on 4 dimensions: content accuracy, communication, problem-solving, and confidence.",
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "See your improvement over time with beautiful analytics and historical trend tracking.",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: "0",
      features: ["5 sessions per month", "Basic feedback", "Score tracking", "1 role practice"],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      description: "For serious candidates",
      price: "12",
      features: [
        "Unlimited sessions",
        "Detailed feedback",
        "All 8 interview roles",
        "3 difficulty levels",
        "Analytics dashboard",
        "Export reports",
      ],
      cta: "Start Pro",
      popular: true,
    },
    {
      name: "Team",
      description: "For interview preparation groups",
      price: "29",
      features: [
        "Everything in Pro",
        "Up to 10 team members",
        "Team analytics",
        "Admin dashboard",
        "Priority support",
        "Custom interview questions",
      ],
      cta: "Start Team",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">HirinAi</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 font-medium">
                How it Works
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 font-medium">
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-slate-900 hover:bg-slate-100" onClick={openSignIn}>
                Sign In
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg" onClick={openSignUp}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-20 pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                  Practice Interviews with an AI That Actually Listens
                </h1>
                <p className="text-xl text-slate-600">
                  Real voice conversations. Real feedback. Get ready for your dream job.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8"
                  onClick={openSignUp}
                >
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50 rounded-lg px-8"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl p-8 text-white shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium">Recording...</span>
                  </div>
                  <div className="h-12 flex items-center gap-1 bg-white/20 rounded-lg px-4">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-blue-300 rounded-full"
                        style={{
                          height: `${Math.random() * 60 + 20}%`,
                          animation: `pulse 0.5s ease-in-out infinite`,
                          animationDelay: `${i * 0.05}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-sm">
                    <p className="font-medium mb-2">Interviewer:</p>
                    <p className="text-blue-100">Tell me about a time you led a complex project...</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-sm">
                    <p className="font-medium mb-2">Your Answer:</p>
                    <p className="text-blue-100">I led a team of 5 engineers to rebuild our API infrastructure...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why HirinAi?</h2>
            <p className="text-xl text-slate-600">Everything you need to ace your interviews</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-8 border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Three simple steps to better interviews</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Choose Your Role", description: "Pick from 8 interview types and difficulty levels" },
              { step: "2", title: "Talk to Alex", description: "Have a realistic voice conversation with your AI interviewer" },
              { step: "3", title: "Get Feedback", description: "Receive detailed scoring and actionable insights instantly" },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Loved by Candidates</h2>
            <p className="text-xl text-slate-600">Join thousands who have improved with HirinAi</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 border-slate-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 italic">"{testimonial.quote}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600">Choose the plan that fits your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 transition-all ${
                  plan.popular
                    ? "border-blue-600 border-2 shadow-xl scale-105"
                    : "border-slate-200 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900">${plan.price}</span>
                  {plan.price !== "0" && <span className="text-slate-600 ml-2">/month</span>}
                </div>
                <Button
                  onClick={openSignUp}
                  className={`w-full mb-8 rounded-lg ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-900"
                  }`}
                >
                  {plan.cta}
                </Button>
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-900 py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to ace your next interview?</h2>
          <p className="text-xl text-blue-100 mb-8">Start practicing with HirinAi today — completely free</p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 rounded-lg px-8 font-bold"
            onClick={openSignUp}
          >
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mic className="h-5 w-5" />
                <span className="font-bold text-white">HirinAi</span>
              </div>
              <p className="text-sm">AI-powered interview practice</p>
            </div>
            <div>
              <p className="font-bold text-white mb-4">Product</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Roles</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-4">Company</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 HirinAi. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Dialogs */}
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
