"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen gradient-purple-hero flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] blob-purple rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] blob-pink rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-purple-xl rounded-2xl border border-violet-100/50",
              headerTitle: "text-gray-900",
              headerSubtitle: "text-violet-600/60",
              socialButtonsBlockButton: "border-violet-200 hover:bg-violet-50",
              formButtonPrimary: "bg-violet-600 hover:bg-violet-700",
              footerActionLink: "text-violet-600 hover:text-violet-700",
            },
          }}
        />
      </div>
    </div>
  );
}
