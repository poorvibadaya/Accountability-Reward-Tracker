import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rewardId } = await request.json();

    if (!rewardId) {
      return NextResponse.json(
        { error: "Reward ID required" },
        { status: 400 }
      );
    }

    // Use admin client to call the atomic redemption function
    const adminClient = createAdminClient();
    const { data: newBalance, error } = await adminClient.rpc("redeem_reward", {
      uid: user.id,
      rid: rewardId,
    });

    if (error) {
      const message = error.message.includes("Insufficient")
        ? "Not enough points"
        : error.message.includes("not found")
        ? "Reward not found"
        : "Redemption failed";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ newBalance });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
