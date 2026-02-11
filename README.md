# AI Interview Coach

A voice-powered full-stack SaaS interview prep platform built with Next.js App Router, Clerk, Prisma/PostgreSQL, GPT-4o, ElevenLabs voice token flow, TanStack Query, and Recharts.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Create `.env.local` from `.env.example` and fill values.
3. Prisma
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Run app
   ```bash
   npm run dev
   ```

## Key Routes

- `/` marketing landing page
- `/pricing` pricing tiers
- `/onboarding` profile + preferences setup
- `/dashboard` analytics (trend + radar + role breakdown)
- `/interview/new` create voice interview session
- `/interview/[id]` live interview page (timer, transcript, controls, keyboard shortcuts)
- `/interview/[id]/feedback` feedback report + share/public toggle
- `/sessions` session history filters + pagination
- `/sessions/[id]` detailed session transcript/metadata

## API Routes

- `/api/webhook/clerk`
- `/api/interviews` and alias `/api/session/create`
- `/api/interviews/[id]/complete` and alias `/api/session/complete`
- `/api/feedback/[id]`
- `/api/dashboard`
- `/api/sessions`, `/api/sessions/[id]`, `/api/sessions/[id]/share`
- `/api/share/[token]`
- `/api/voice/token`
