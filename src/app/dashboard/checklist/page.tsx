"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { format, addDays, subDays } from "date-fns";
import type { Task } from "@/lib/types";

export default function ChecklistPage() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPoints, setNewPoints] = useState(10);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/tasks?date=${date}`);
    const data = await res.json();
    setTasks(data.tasks ?? []);
    setLoading(false);
  }, [date]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTask = async (taskId: string, completed: boolean) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed, completed_at: completed ? new Date().toISOString() : null } : t
      )
    );

    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    if (!res.ok) {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed: !completed } : t
        )
      );
    }
  };

  const addTask = async () => {
    if (!newTitle.trim()) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tasks: [{ title: newTitle.trim(), date, points: newPoints }],
      }),
    });

    if (res.ok) {
      setNewTitle("");
      setShowAddForm(false);
      fetchTasks();
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Daily Checklist</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setDate(format(subDays(new Date(date), 1), "yyyy-MM-dd"))
            }
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() =>
              setDate(format(addDays(new Date(date), 1), "yyyy-MM-dd"))
            }
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>
              {completedCount} of {tasks.length} completed
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Task list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 mb-4">No tasks for this date</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-indigo-600 font-medium hover:underline"
          >
            Add a task
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-4 p-4 bg-white rounded-xl border transition-all ${
                task.completed
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 hover:border-indigo-200"
              }`}
            >
              <button
                onClick={() => toggleTask(task.id, !task.completed)}
                className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                  task.completed
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 hover:border-indigo-400"
                }`}
              >
                {task.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium ${
                    task.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-500 truncate">
                    {task.description}
                  </p>
                )}
              </div>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  task.completed
                    ? "bg-green-100 text-green-700"
                    : "bg-indigo-50 text-indigo-600"
                }`}
              >
                {task.points} pts
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add task button / form */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add a task
        </button>
      ) : (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Task title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <select
              value={newPoints}
              onChange={(e) => setNewPoints(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5 pts</option>
              <option value={10}>10 pts</option>
              <option value={20}>20 pts</option>
            </select>
            <button
              onClick={addTask}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
