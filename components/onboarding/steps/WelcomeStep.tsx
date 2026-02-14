import { Mic, Sparkles } from "lucide-react";

export default function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      {/* Logo/Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 gradient-purple rounded-2xl flex items-center justify-center shadow-purple glow-purple animate-float">
          <Mic className="h-10 w-10 text-white" />
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">
          Let&apos;s set up your <span className="gradient-text-purple">interview profile</span>
        </h1>
        <p className="text-lg text-violet-700/60">
          We&apos;ll help you customize your AI interview coach experience. It only takes a few moments.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-4 pt-4">
        <div className="flex gap-4 text-left p-4 rounded-xl bg-violet-50/80 border border-violet-100/50 hover:border-violet-200 transition-colors">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl gradient-purple shadow-purple-sm">
              <span className="text-lg">🎯</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Personalized Practice</h3>
            <p className="text-sm text-violet-700/60">
              Get questions tailored to your target role and experience level
            </p>
          </div>
        </div>

        <div className="flex gap-4 text-left p-4 rounded-xl bg-violet-50/80 border border-violet-100/50 hover:border-violet-200 transition-colors">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl gradient-purple shadow-purple-sm">
              <span className="text-lg">🗣️</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Real-time Feedback</h3>
            <p className="text-sm text-violet-700/60">
              Get instant feedback on your communication and problem-solving
            </p>
          </div>
        </div>

        <div className="flex gap-4 text-left p-4 rounded-xl bg-violet-50/80 border border-violet-100/50 hover:border-violet-200 transition-colors">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl gradient-purple shadow-purple-sm">
              <span className="text-lg">📊</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Track Progress</h3>
            <p className="text-sm text-violet-700/60">
              Monitor your improvements and celebrate your wins
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
