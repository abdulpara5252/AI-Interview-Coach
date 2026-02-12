export default function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      {/* Logo/Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-2xl font-bold text-white">AI</span>
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Let's set up your interview profile
        </h1>
        <p className="text-lg text-muted-foreground">
          We'll help you customize your AI interview coach experience. It only takes a few moments.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-4 pt-4">
        <div className="flex gap-3 text-left">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50">
              <span className="text-lg">🎯</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Personalized Practice</h3>
            <p className="text-sm text-muted-foreground">
              Get questions tailored to your target role and experience level
            </p>
          </div>
        </div>

        <div className="flex gap-3 text-left">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50">
              <span className="text-lg">🗣️</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Real-time Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Get instant feedback on your communication and problem-solving
            </p>
          </div>
        </div>

        <div className="flex gap-3 text-left">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50">
              <span className="text-lg">📊</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your improvements and celebrate your wins
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
