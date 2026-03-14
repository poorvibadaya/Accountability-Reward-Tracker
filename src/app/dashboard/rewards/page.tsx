"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Reward, RewardRedemption } from "@/lib/types";

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pointCost, setPointCost] = useState("");
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [rewardsRes, { data: pointsResult }, { data: redemptionsData }] =
      await Promise.all([
        fetch("/api/rewards"),
        supabase.rpc("get_available_points", { uid: user.id }),
        supabase
          .from("reward_redemptions")
          .select("*, reward:rewards(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

    const rewardsData = await rewardsRes.json();
    setRewards(rewardsData.rewards ?? []);
    setPoints((pointsResult as number) ?? 0);
    setRedemptions((redemptionsData as RewardRedemption[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createReward = async () => {
    if (!title.trim() || !pointCost) return;

    const res = await fetch("/api/rewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim() || null,
        pointCost: parseInt(pointCost),
      }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      setPointCost("");
      setShowForm(false);
      fetchData();
      showMessage("success", "Reward created!");
    }
  };

  const redeemReward = async (rewardId: string, rewardTitle: string) => {
    setRedeeming(rewardId);
    setMessage(null);

    const res = await fetch("/api/rewards/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rewardId }),
    });

    const data = await res.json();

    if (res.ok) {
      setPoints(data.newBalance);
      showMessage("success", `Redeemed "${rewardTitle}"! Enjoy!`);
      fetchData();
    } else {
      showMessage("error", data.error || "Failed to redeem");
    }

    setRedeeming(null);
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="h-8 bg-gray-100 rounded w-48 mb-6 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
          <p className="text-sm text-gray-500 mt-1">
            Available: <span className="font-semibold text-yellow-600">{points} points</span>
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 text-sm"
        >
          {showForm ? "Cancel" : "Create Reward"}
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">New Reward</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Reward title (e.g., Watch Netflix)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Point cost"
                value={pointCost}
                onChange={(e) => setPointCost(e.target.value)}
                min="1"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={createReward}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rewards list */}
      {rewards.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <p className="text-gray-500 mb-4">No rewards yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-indigo-600 font-medium hover:underline"
          >
            Create your first reward
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
            >
              <div>
                <h3 className="font-medium text-gray-900">{reward.title}</h3>
                {reward.description && (
                  <p className="text-sm text-gray-500">{reward.description}</p>
                )}
                <p className="text-sm font-semibold text-yellow-600 mt-1">
                  {reward.point_cost} points
                </p>
              </div>
              <button
                onClick={() => redeemReward(reward.id, reward.title)}
                disabled={points < reward.point_cost || redeeming === reward.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  points >= reward.point_cost
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                } disabled:opacity-50`}
              >
                {redeeming === reward.id ? "..." : "Redeem"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Redemption history */}
      {redemptions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Redemption History
          </h2>
          <div className="space-y-2">
            {redemptions.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {(r.reward as unknown as Reward)?.title ?? "Reward"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm text-red-500 font-medium">
                  -{r.points_spent} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
