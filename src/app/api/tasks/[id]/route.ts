import { createClient } from "@/lib/supabase/server";
import { updateStreak } from "@/lib/streaks";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { completed } = await request.json();

    // Get the task first
    const { data: task } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update task
    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    if (completed) {
      // Add points
      await supabase.from("points_ledger").insert({
        user_id: user.id,
        task_id: id,
        points: task.points,
        type: "earned",
      });

      // Update streak
      await updateStreak(supabase, user.id, task.date);
    } else {
      // Remove points entry
      await supabase
        .from("points_ledger")
        .delete()
        .eq("task_id", id)
        .eq("user_id", user.id)
        .eq("type", "earned");
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
