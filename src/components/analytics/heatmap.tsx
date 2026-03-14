"use client";

import { format, subDays, startOfWeek, addDays } from "date-fns";

interface HeatmapProps {
  data: { date: string; completed: number; total: number }[];
}

export default function Heatmap({ data }: HeatmapProps) {
  const dataMap = new Map(data.map((d) => [d.date, d]));
  const today = new Date();
  const startDate = startOfWeek(subDays(today, 364), { weekStartsOn: 0 });

  // Build grid: 53 weeks x 7 days
  const weeks: { date: Date; key: string }[][] = [];
  let currentDate = startDate;

  while (currentDate <= today) {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekKey = format(weekStart, "yyyy-MM-dd");

    let week = weeks.find(
      (w) => w.length > 0 && format(startOfWeek(w[0].date, { weekStartsOn: 0 }), "yyyy-MM-dd") === weekKey
    );

    if (!week) {
      week = [];
      weeks.push(week);
    }

    week.push({ date: new Date(currentDate), key: format(currentDate, "yyyy-MM-dd") });
    currentDate = addDays(currentDate, 1);
  }

  const getColor = (dateStr: string) => {
    const entry = dataMap.get(dateStr);
    if (!entry || entry.total === 0) return "bg-gray-100";
    const pct = entry.completed / entry.total;
    if (pct === 0) return "bg-gray-100";
    if (pct <= 0.33) return "bg-green-200";
    if (pct <= 0.66) return "bg-green-400";
    return "bg-green-600";
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-[2px]">
        {/* Day labels */}
        <div className="flex flex-col gap-[2px] mr-1">
          {dayLabels.map((label, i) => (
            <div
              key={label}
              className="h-[12px] text-[9px] text-gray-400 flex items-center"
            >
              {i % 2 === 1 ? label : ""}
            </div>
          ))}
        </div>

        {/* Grid */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[2px]">
            {Array.from({ length: 7 }, (_, di) => {
              const dayEntry = week.find(
                (d) => d.date.getDay() === di
              );
              if (!dayEntry) {
                return <div key={di} className="w-[12px] h-[12px]" />;
              }
              const entry = dataMap.get(dayEntry.key);
              const tooltip = entry
                ? `${dayEntry.key}: ${entry.completed}/${entry.total} completed`
                : `${dayEntry.key}: no tasks`;
              return (
                <div
                  key={di}
                  className={`w-[12px] h-[12px] rounded-sm ${getColor(dayEntry.key)}`}
                  title={tooltip}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-3 text-[10px] text-gray-400">
        <span>Less</span>
        <div className="w-[12px] h-[12px] rounded-sm bg-gray-100" />
        <div className="w-[12px] h-[12px] rounded-sm bg-green-200" />
        <div className="w-[12px] h-[12px] rounded-sm bg-green-400" />
        <div className="w-[12px] h-[12px] rounded-sm bg-green-600" />
        <span>More</span>
      </div>
    </div>
  );
}
