"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";

interface WeeklyChartProps {
  data: { week: string; completed: number; total: number }[];
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data yet
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    incomplete: d.total - d.completed,
    label: format(new Date(d.week), "MMM d"),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="completed" stackId="a" fill="#4f46e5" name="Completed" />
        <Bar
          dataKey="incomplete"
          stackId="a"
          fill="#e5e7eb"
          name="Incomplete"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
