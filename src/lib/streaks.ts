import { SupabaseClient } from "@supabase/supabase-js";
import { format, subDays } from "date-fns";

export async function updateStreak(
  supabase: SupabaseClient,
  userId: string,
  taskDate: string
) {
  const { data: streak } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  const yesterday = format(subDays(new Date(taskDate), 1), "yyyy-MM-dd");

  let currentStreak: number;
  let longestStreak: number;

  if (!streak) {
    currentStreak = 1;
    longestStreak = 1;
    await supabase.from("streaks").insert({
      user_id: userId,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_active_date: taskDate,
    });
    return { currentStreak, longestStreak };
  }

  if (streak.last_active_date === taskDate) {
    return {
      currentStreak: streak.current_streak,
      longestStreak: streak.longest_streak,
    };
  }

  if (streak.last_active_date === yesterday) {
    currentStreak = streak.current_streak + 1;
  } else {
    currentStreak = 1;
  }

  longestStreak = Math.max(streak.longest_streak, currentStreak);

  await supabase
    .from("streaks")
    .update({
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_active_date: taskDate,
    })
    .eq("user_id", userId);

  return { currentStreak, longestStreak };
}
