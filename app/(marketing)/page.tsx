import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, TrendingUp, BarChart3, ArrowRight, Check, Play, Sparkles, Star, Zap, Target, Shield, Users } from "lucide-react";

export default function LandingPage() {

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      quote: "HerinAI helped me practice interviews in a realistic way. The AI feedback was incredibly detailed and helped me improve my communication skills.",
      avatar: "SC",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      quote: "The structured feedback on all four dimensions really helped me understand my strengths and weaknesses. Highly recommend!",
      avatar: "MJ",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist",
      quote: "Being able to practice anytime, anywhere with instant feedback is a game-changer. I felt so much more confident in my actual interviews.",
      avatar: "ER",
      rating: 5,
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
      {/* ═══════════ Navigation ═══════════ */}
      <nav className="sticky top-0 z-50 glass border-b border-violet-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="gradient-purple p-2 rounded-xl shadow-purple-sm">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl gradient-text-purple">HerinAI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-violet-700/80 hover:text-violet-900 font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-violet-700/80 hover:text-violet-900 font-medium transition-colors">
                How it Works
              </a>
              <a href="#pricing" className="text-violet-700/80 hover:text-violet-900 font-medium transition-colors">
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-violet-700 hover:text-violet-900 hover:bg-violet-50"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  className="gradient-purple text-white hover:opacity-90 shadow-purple-sm hover:shadow-purple rounded-xl transition-all"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════ Hero Section ═══════════ */}
      <section className="relative overflow-hidden gradient-purple-hero pt-20 pb-32">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] blob-purple rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] blob-pink rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blob-purple rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100/80 text-violet-700 text-sm font-medium border border-violet-200/50">
                <Sparkles className="h-4 w-4" />
                AI-Powered Interview Coaching
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-gray-900">Ace Your</span>
                  <br />
                  <span className="gradient-text-purple-pink">Next Interview</span>
                  <br />
                  <span className="text-gray-900">with AI</span>
                </h1>
                <p className="text-xl text-violet-700/70 max-w-lg leading-relaxed">
                  Real voice conversations. Real feedback. Practice with an AI that actually listens and helps you land your dream job.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    className="gradient-purple-pink text-white shadow-purple hover:shadow-purple-lg rounded-xl px-8 h-13 text-base font-semibold transition-all hover:opacity-90"
                  >
                    Start Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-700 rounded-xl px-8 h-13 text-base font-semibold transition-all hover:opacity-90 shadow-purple-sm hover:shadow-purple-md"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex -space-x-2">
                  {["SC", "MJ", "ER", "JK"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full gradient-purple border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-violet-700/70">
                  <span className="font-bold text-violet-900">2,500+</span> candidates practicing
                </div>
              </div>
            </div>

            {/* Right: Interactive Card */}
            <div className="relative animate-fade-in-scale">
              <div className="absolute inset-0 gradient-purple rounded-3xl blur-xl opacity-20 scale-105"></div>
              <div className="relative gradient-purple-dark rounded-3xl p-8 text-white shadow-purple-xl overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative space-y-5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                    <span className="text-sm font-medium text-violet-200">Recording...</span>
                  </div>
                  {/* Waveform */}
                  <div className="h-12 flex items-center gap-1 bg-white/10 rounded-xl px-4">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-violet-300/70 rounded-full"
                        style={{
                          height: `${Math.random() * 60 + 20}%`,
                          animation: `pulse 0.5s ease-in-out infinite`,
                          animationDelay: `${i * 0.05}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-sm backdrop-blur-sm">
                    <p className="font-semibold mb-2 text-violet-200">Interviewer:</p>
                    <p className="text-violet-100">Tell me about a time you led a complex project...</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-sm">
                    <p className="font-semibold mb-2 text-violet-200">Your Answer:</p>
                    <p className="text-violet-100">I led a team of 5 engineers to rebuild our API infrastructure...</p>
                  </div>
                  {/* Score preview */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex-1 bg-white/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-violet-300">Score</p>
                      <p className="text-2xl font-bold">87</p>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-violet-300">Grade</p>
                      <p className="text-2xl font-bold">B+</p>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-violet-300">Rank</p>
                      <p className="text-2xl font-bold">Top 15%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ Features Section ═══════════ */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100/80 text-violet-700 text-sm font-medium border border-violet-200/50 mb-6">
              <Zap className="h-4 w-4" />
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why <span className="gradient-text-purple">HerinAI</span>?
            </h2>
            <p className="text-xl text-violet-700/60 max-w-2xl mx-auto">
              Everything you need to ace your interviews, powered by advanced AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group p-8 border-violet-100/50 hover:border-violet-200 bg-white hover:shadow-purple-lg transition-all duration-300 rounded-2xl"
                >
                  <div className="gradient-purple w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-purple-sm group-hover:shadow-purple transition-shadow">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-violet-700/60 leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ How It Works ═══════════ */}
      <section id="how-it-works" className="py-24 gradient-purple-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100/80 text-violet-700 text-sm font-medium border border-violet-200/50 mb-6">
              <Target className="h-4 w-4" />
              How It Works
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Three Simple <span className="gradient-text-purple">Steps</span>
            </h2>
            <p className="text-xl text-violet-700/60">From setup to success in minutes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Choose Your Role", description: "Pick from 7 interview types and difficulty levels tailored to your experience" },
              { step: "2", title: "Talk to Saraha", description: "Have a realistic voice conversation with your AI interviewer in real-time" },
              { step: "3", title: "Get Feedback", description: "Receive detailed scoring across 4 dimensions and actionable insights instantly" },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-purple-sm border border-violet-100/50 hover:shadow-purple-lg transition-all duration-300">
                  <div className="gradient-purple text-white rounded-2xl w-14 h-14 flex items-center justify-center font-bold text-xl mb-6 shadow-purple-sm group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-violet-700/60 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-violet-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Testimonials ═══════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100/80 text-violet-700 text-sm font-medium border border-violet-200/50 mb-6">
              <Users className="h-4 w-4" />
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by <span className="gradient-text-purple">Candidates</span>
            </h2>
            <p className="text-xl text-violet-700/60">Join thousands who have improved with HerinAI</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 border-violet-100/50 hover:shadow-purple-lg transition-all duration-300 rounded-2xl bg-white">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-violet-700/70 mb-6 leading-relaxed italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="gradient-purple rounded-full w-12 h-12 flex items-center justify-center text-white font-bold shadow-purple-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-violet-700/60">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Pricing ═══════════ */}
      <section id="pricing" className="py-24 gradient-purple-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100/80 text-violet-700 text-sm font-medium border border-violet-200/50 mb-6">
              <Shield className="h-4 w-4" />
              Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, <span className="gradient-text-purple">Transparent</span> Pricing
            </h2>
            <p className="text-xl text-violet-700/60">Choose the plan that fits your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative p-8 transition-all duration-300 rounded-2xl ${
                  plan.popular
                    ? "border-2 border-violet-500 shadow-purple-xl scale-105 bg-white"
                    : "border-violet-100/50 hover:shadow-purple-lg bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="gradient-purple-pink text-white text-sm font-bold px-5 py-1.5 rounded-full shadow-purple">
                      Most Popular
                    </div>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-violet-700/60 text-sm mb-6">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  {plan.price !== "0" && <span className="text-violet-700/60 ml-2">/month</span>}
                </div>
                <Link href="/sign-in" className="block w-full mb-8">
                  <Button
                    className={`w-full rounded-xl h-12 font-semibold transition-all ${
                      plan.popular
                        ? "gradient-purple text-white shadow-purple hover:shadow-purple-lg hover:opacity-90"
                        : "border-2 border-violet-200 bg-white hover:bg-violet-50 text-violet-700"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full gradient-purple flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-violet-900/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ Final CTA ═══════════ */}
      <section className="relative overflow-hidden gradient-purple-dark py-20 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to ace your next interview?</h2>
          <p className="text-xl text-violet-200 mb-10 max-w-2xl mx-auto">
            Start practicing with HerinAI today — completely free. No credit card required.
          </p>
          <Link href="/sign-in">
            <Button
              size="lg"
              className="bg-white text-violet-700 hover:bg-violet-50 rounded-xl px-10 h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ═══════════ Footer ═══════════ */}
      <footer className="bg-gray-950 text-violet-300/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="gradient-purple p-1.5 rounded-lg">
                  <Mic className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-white">HerinAI</span>
              </div>
              <p className="text-sm leading-relaxed">AI-powered interview practice for every job seeker</p>
            </div>
            <div>
              <p className="font-bold text-white mb-4">Product</p>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roles</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-4">Company</p>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-4">Legal</p>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-violet-900/30 pt-8 text-center text-sm">
            <p>&copy; 2026 HerinAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
