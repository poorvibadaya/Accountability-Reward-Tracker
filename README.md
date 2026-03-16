# Accountability Reward Tracker

> Turn your plans into daily wins. Upload your goals, let AI break them into actionable tasks, track your progress with streaks & points, and reward yourself for staying consistent.

**[Live Demo](https://accgoals.vercel.app)**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)

## How It Works

1. **Upload Your Plan** — Drop a `.txt`, `.md`, or `.pdf` file containing your goals
2. **AI Extracts Tasks** — The LLM intelligently parses your plan into structured daily tasks with difficulty ratings
3. **Daily Checklist** — Check off tasks as you complete them, navigate between dates, add ad-hoc tasks
4. **Earn Points & Streaks** — Every completed task earns points (5/10/20 based on difficulty). Complete at least one task daily to build your streak
5. **Redeem Rewards** — Define your own rewards (Netflix night, new gadget, day off) and redeem them with earned points

## Features

- **Google OAuth** — One-click sign in with Google
- **AI-Powered Task Extraction** — Upload a plan and let AI do the heavy lifting (with manual editing fallback)
- **Smart Daily Checklist** — Date-navigable checklist with real-time completion tracking
- **Points System** — Earn 5/10/20 points per task based on Easy/Medium/Hard difficulty
- **Custom Rewards** — Define your own rewards and redeem them with earned points
- **Streak Tracking** — Current streak, longest streak, and daily consistency tracking
- **Analytics Dashboard** — GitHub-style activity heatmap, weekly progress chart, and points growth graph
- **Weekly Milestones** — Celebratory banners at every 7-day streak milestone
- **Fully Responsive** — Works seamlessly on desktop and mobile
- **Animated Landing Page** — Framer Motion animations with glassmorphic UI elements

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, API Routes) |
| **Database & Auth** | Supabase (Postgres, Google OAuth, File Storage) |
| **AI** | OpenRouter (Gemma 3N) + Google Gemini Flash fallback |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Fonts** | Inter + Outfit (Google Fonts) |
| **Deployment** | Vercel |

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
   ```env
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
4. Update the Supabase **Site URL** and **Redirect URLs** to your production domain

## Project Structure

```
src/
  app/
    page.tsx                    # Animated landing page
    demo/                       # Demo signup page
    auth/                       # Login + OAuth callback
    dashboard/                  # Dashboard, upload, checklist, rewards, analytics
    api/                        # API routes (upload, parse, tasks, rewards, analytics)
  components/
    ui/                         # Reusable UI components (button, input, checkboxes, background-paths)
    dashboard/                  # Dashboard-specific components (nav-sidebar, stats-bar)
    analytics/                  # Chart components (heatmap, weekly-chart, points-chart)
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

| Table | Purpose |
|-------|---------|
| `plans` | Uploaded plan files |
| `tasks` | Daily tasks with completion status |
| `points_ledger` | Append-only points transaction log |
| `rewards` | User-defined rewards |
| `reward_redemptions` | Redemption history |
| `streaks` | Per-user streak tracking |

## License

MIT
