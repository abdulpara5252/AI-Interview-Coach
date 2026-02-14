import { redirect } from "next/navigation";

export default function SignUpPage() {
  // All auth flows go through Sign In — Clerk auto-creates accounts for new users
  redirect("/sign-in");
}
