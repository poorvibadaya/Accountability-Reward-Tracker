import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

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
    const date = searchParams.get("date");

    let query = supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (date) {
      query = query.eq("date", date);
    }

    const { data: tasks, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tasks, planId } = await request.json();

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { error: "No tasks provided" },
        { status: 400 }
      );
    }

    const taskRows = tasks.map(
      (t: { title: string; description?: string; date: string; points: number }) => ({
        user_id: user.id,
        plan_id: planId || null,
        title: t.title,
        description: t.description || null,
        date: t.date,
        points: t.points || 10,
      })
    );

    const { data, error } = await supabase
      .from("tasks")
      .insert(taskRows)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tasks: data });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
