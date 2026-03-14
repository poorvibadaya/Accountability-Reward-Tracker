import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const today = format(new Date(), "yyyy-MM-dd");

  const [{ count: planCount }, { data: todayTasks }, { data: streak }, { data: pointsResult }] =
    await Promise.all([
      supabase.from("plans").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("tasks").select("*").eq("user_id", user.id).eq("date", today),
      supabase.from("streaks").select("*").eq("user_id", user.id).single(),
      supabase.rpc("get_available_points", { uid: user.id }),
    ]);

  const hasPlan = (planCount ?? 0) > 0;
  const tasks = todayTasks ?? [];
  const completedToday = tasks.filter((t) => t.completed).length;
  const totalToday = tasks.length;
  const points = (pointsResult as number) ?? 0;
  const currentStreak = streak?.current_streak ?? 0;
  const longestStreak = streak?.longest_streak ?? 0;

  // Check for weekly milestone notification
  const showWeeklyMilestone =
    currentStreak >= 7 && currentStreak % 7 === 0;

  if (!hasPlan) {
    return (
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
          <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to AccTracker!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Upload your first plan to get started. Our AI will break it into
          daily tasks for you.
        </p>
        <Link
          href="/dashboard/upload"
          className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors"
        >
          Upload Your Plan
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {showWeeklyMilestone && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-semibold text-gray-900">
                {currentStreak}-day streak! Amazing!
              </p>
              <p className="text-sm text-gray-600">
                You&apos;ve been crushing it! Treat yourself —{" "}
                <Link href="/dashboard/rewards" className="text-indigo-600 font-medium hover:underline">
                  check your rewards
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">Today&apos;s Progress</p>
          <p className="text-2xl font-bold text-gray-900">
            {completedToday}/{totalToday}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">Current Streak</p>
          <p className="text-2xl font-bold text-orange-600">{currentStreak} days</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">Longest Streak</p>
          <p className="text-2xl font-bold text-gray-900">{longestStreak} days</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">Available Points</p>
          <p className="text-2xl font-bold text-yellow-600">{points}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/checklist"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Today&apos;s Checklist</h3>
            <p className="text-sm text-gray-500">{totalToday - completedToday} tasks remaining</p>
          </div>
        </Link>

        <Link
          href="/dashboard/rewards"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Rewards</h3>
            <p className="text-sm text-gray-500">{points} points available</p>
          </div>
        </Link>

        <Link
          href="/dashboard/analytics"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Analytics</h3>
            <p className="text-sm text-gray-500">View your progress</p>
          </div>
        </Link>

        <Link
          href="/dashboard/upload"
          className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Upload New Plan</h3>
            <p className="text-sm text-gray-500">Update your goals anytime</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
