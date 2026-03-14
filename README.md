# Accountability Reward Tracker

A productivity system that converts your goal documents into daily tasks using AI, tracks completion with points and streaks, and lets you redeem custom rewards. Inspired by the Strava motivation loop.

**Core flow:** Upload Plan → AI extracts tasks → Daily checklist → Complete tasks → Points & streaks → Redeem rewards

## Features

- **Google OAuth** — Sign in with Google
- **Plan Upload** — Upload `.txt`, `.md`, or `.pdf` goal files
- **AI Task Extraction** — LLM parses your plan into structured daily tasks (with manual editing fallback)
- **Daily Checklist** — Check off tasks, navigate by date, add ad-hoc tasks
- **Points System** — Earn points per task (5/10/20 based on difficulty)
- **Custom Rewards** — Define rewards and redeem them with earned points
- **Streak Tracking** — Current and longest streak with daily consistency tracking
- **Analytics Dashboard** — GitHub-style activity heatmap, weekly progress chart, points growth chart
- **Weekly Milestone Notifications** — Celebratory banner at every 7-day streak milestone

## Tech Stack

- **Frontend + Backend:** Next.js 16 (App Router, API Routes)
- **Database + Auth + Storage:** Supabase (Postgres, Google OAuth, file storage)
- **AI:** OpenRouter (Gemma 3N free tier) with Gemini Flash fallback
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Google Cloud Console](https://console.cloud.google.com) OAuth client
- An [OpenRouter](https://openrouter.ai) API key (free)
- Optionally, a [Google AI Studio](https://ai.dev) Gemini API key (free)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/poorvibadaya/Accountability-Reward-Tracker.git
   cd Accountability-Reward-Tracker
   npm install
   ```

2. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL migration in `supabase/migrations/001_initial_schema.sql` via the SQL Editor
   - Enable Google OAuth in Authentication > Providers > Google
   - Set the redirect URI in Google Cloud Console to `https://<your-project>.supabase.co/auth/v1/callback`

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENROUTER_API_KEY=your_openrouter_key
   GEMINI_API_KEY=your_gemini_key  # optional fallback
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

1. Push to GitHub
2. Connect the repo to [Vercel](https://vercel.com)
3. Add the environment variables in Vercel dashboard
4. Update the Supabase Site URL and redirect URLs to your production domain

## Project Structure

```
src/
  app/
    page.tsx                    # Landing page
    auth/                       # Login + OAuth callback
    dashboard/                  # Dashboard, upload, checklist, rewards, analytics
    api/                        # API routes (upload, parse, tasks, rewards, analytics)
  components/                   # UI components
  lib/
    supabase/                   # Supabase client configs
    gemini.ts                   # LLM integration (OpenRouter + Gemini)
    streaks.ts                  # Streak calculation logic
    types.ts                    # TypeScript types
supabase/
  migrations/                   # Database schema
```

## Database Schema

6 tables with Row Level Security:
- `plans` — Uploaded plan files
- `tasks` — Daily tasks with completion status
- `points_ledger` — Append-only points transaction log
- `rewards` — User-defined rewards
- `reward_redemptions` — Redemption history
- `streaks` — Per-user streak tracking
