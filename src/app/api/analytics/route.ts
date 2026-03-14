import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { format, subDays, startOfWeek } from "date-fns";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = parseInt(searchParams.get("range") || "365");
    const startDate = format(subDays(new Date(), range), "yyyy-MM-dd");

    // Fetch all tasks in range
    const { data: tasks } = await supabase
      .from("tasks")
      .select("date, completed")
      .eq("user_id", user.id)
      .gte("date", startDate)
      .order("date");

    // Fetch points ledger
    const { data: ledger } = await supabase
      .from("points_ledger")
      .select("points, type, created_at")
      .eq("user_id", user.id)
      .gte("created_at", new Date(startDate).toISOString())
      .order("created_at");

    // Fetch streak
    const { data: streak } = await supabase
      .from("streaks")
      .select("current_streak, longest_streak")
      .eq("user_id", user.id)
      .single();

    // Build heatmap data
    const heatmapMap = new Map<string, { completed: number; total: number }>();
    (tasks ?? []).forEach((t) => {
      const existing = heatmapMap.get(t.date) || { completed: 0, total: 0 };
      existing.total += 1;
      if (t.completed) existing.completed += 1;
      heatmapMap.set(t.date, existing);
    });
    const heatmap = Array.from(heatmapMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));

    // Build weekly data
    const weeklyMap = new Map<string, { completed: number; total: number }>();
    (tasks ?? []).forEach((t) => {
      const weekStart = format(startOfWeek(new Date(t.date), { weekStartsOn: 1 }), "yyyy-MM-dd");
      const existing = weeklyMap.get(weekStart) || { completed: 0, total: 0 };
      existing.total += 1;
      if (t.completed) existing.completed += 1;
      weeklyMap.set(weekStart, existing);
    });
    const weekly = Array.from(weeklyMap.entries())
      .map(([week, data]) => ({ week, ...data }))
      .slice(-12);

    // Build points growth
    let cumulative = 0;
    const pointsMap = new Map<string, number>();
    (ledger ?? []).forEach((entry) => {
      const day = format(new Date(entry.created_at), "yyyy-MM-dd");
      const delta = entry.type === "earned" ? entry.points : -entry.points;
      cumulative += delta;
      pointsMap.set(day, cumulative);
    });
    const pointsGrowth = Array.from(pointsMap.entries()).map(
      ([date, cumulative]) => ({ date, cumulative })
    );

    // Stats
    const totalTasksCompleted = (tasks ?? []).filter((t) => t.completed).length;

    return NextResponse.json({
      heatmap,
      weekly,
      pointsGrowth,
      stats: {
        totalPoints: cumulative,
        totalTasksCompleted,
        currentStreak: streak?.current_streak ?? 0,
        longestStreak: streak?.longest_streak ?? 0,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
