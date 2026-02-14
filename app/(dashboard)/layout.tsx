import { auth, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { DashboardWrapper } from "@/components/dashboard/DashboardWrapper";

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  let user = await prisma.user.findUnique({ where: { clerkId } });

  // JIT user sync: create in DB if Clerk user exists but DB row doesn't
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return (
        <div className="flex min-h-screen items-center justify-center gradient-purple-subtle">
          <p className="text-muted-foreground">User not found. Please try signing in again.</p>
        </div>
      );
    }
    const primaryEmail =
      clerkUser.emailAddresses?.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress ?? clerkUser.emailAddresses?.[0]?.emailAddress;
    if (!primaryEmail) {
      return (
        <div className="flex min-h-screen items-center justify-center gradient-purple-subtle">
          <p className="text-muted-foreground">No email on account. Please try signing in again.</p>
        </div>
      );
    }
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: primaryEmail,
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
        avatarUrl: clerkUser.imageUrl ?? null,
      },
    });
  }

  // Check onboarding status
  const isOnboarded =
    user.onboardedAt != null || (!!user.targetRole && !!user.experience);
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";

  // If not onboarded → force them to /onboarding, no other page allowed
  if (!isOnboarded && !pathname.startsWith("/onboarding")) {
    redirect("/onboarding");
  }

  // During onboarding: render WITHOUT navbar (clean full-screen wizard)
  // Check if we're in the onboarding route
  const isInOnboardingRoute = pathname.startsWith("/onboarding");
  
  if (!isOnboarded && isInOnboardingRoute) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }
  
  // If user just completed onboarding and was redirected to dashboard,
  // make sure they see the full layout with navbar
  if (!isOnboarded && !isInOnboardingRoute) {
    // This shouldn't happen, but if it does, redirect to onboarding
    redirect("/onboarding");
  }

  // Determine active nav link
  const activeLink =
    pathname.startsWith("/interview") ? "interview" :
    pathname.startsWith("/sessions") ? "sessions" :
    pathname.startsWith("/profile") ? "profile" :
    "dashboard";

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", key: "dashboard" },
    { href: "/interview/new", label: "New Interview", key: "interview", isSpecial: true },
    { href: "/sessions", label: "Sessions", key: "sessions" },
    { href: "/profile", label: "Profile", key: "profile" },
  ];

  return (
    <DashboardWrapper>
      <div className="min-h-screen gradient-purple-subtle">
        {/* Header */}
        <header className="sticky top-0 z-50 glass border-b border-violet-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              {/* Logo — fixed width left */}
              <div className="flex-1 flex items-center">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                  <div className="gradient-purple p-2 rounded-xl shadow-purple-sm group-hover:shadow-purple transition-shadow">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <span className="font-bold text-xl gradient-text-purple hidden sm:inline">HerinAI</span>
                </Link>
              </div>

              {/* Navigation — centered */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = activeLink === link.key;
                  if (link.isSpecial) {
                    return (
                      <Link
                        key={link.key}
                        href={link.href}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? "gradient-purple-pink text-white shadow-purple"
                            : "text-violet-700 hover:bg-violet-50 border border-violet-200"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  }
                  return (
                    <Link
                      key={link.key}
                      href={link.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-violet-100 text-violet-900 font-semibold"
                          : "text-violet-700 hover:bg-violet-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* User Button — fixed width right */}
              <div className="flex-1 flex items-center justify-end gap-3">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9 ring-2 ring-violet-200 ring-offset-2",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </DashboardWrapper>
  );
}
