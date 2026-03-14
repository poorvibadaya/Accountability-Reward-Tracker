"use client";

import { useEffect, useState } from "react";
import type { AnalyticsData } from "@/lib/types";
import Heatmap from "@/components/analytics/heatmap";
import WeeklyChart from "@/components/analytics/weekly-chart";
import PointsChart from "@/components/analytics/points-chart";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await fetch("/api/analytics?range=365");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="h-8 bg-gray-100 rounded w-48 mb-6 animate-pulse" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-gray-500">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">Tasks Completed</p>
          <p className="text-2xl font-bold text-gray-900">
            {data.stats.totalTasksCompleted}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">Total Points</p>
          <p className="text-2xl font-bold text-yellow-600">
            {data.stats.totalPoints}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">Current Streak</p>
          <p className="text-2xl font-bold text-orange-600">
            {data.stats.currentStreak} days
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">Longest Streak</p>
          <p className="text-2xl font-bold text-gray-900">
            {data.stats.longestStreak} days
          </p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Activity Heatmap
        </h2>
        <Heatmap data={data.heatmap} />
      </div>

      {/* Charts side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Progress
          </h2>
          <WeeklyChart data={data.weekly} />
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Points Growth
          </h2>
          <PointsChart data={data.pointsGrowth} />
        </div>
      </div>
    </div>
  );
}
