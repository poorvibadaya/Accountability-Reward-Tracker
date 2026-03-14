"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import type { ParsedTask } from "@/lib/types";

export default function UploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [tasks, setTasks] = useState<ParsedTask[]>([]);
  const [planId, setPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualDate, setManualDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [manualPoints, setManualPoints] = useState(10);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setTasks([]);
    setUploading(true);

    try {
      // Upload file
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Upload failed");
      }

      setPlanId(uploadData.plan.id);
      setUploading(false);
      setParsing(true);

      // Parse tasks with AI
      const parseRes = await fetch("/api/parse-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: uploadData.plan.id }),
      });
      const parseData = await parseRes.json();

      if (parseData.error) {
        setError(parseData.error);
        setShowManual(true);
      }

      if (parseData.tasks?.length > 0) {
        setTasks(parseData.tasks);
      } else if (!parseData.error) {
        setError("No tasks were extracted. Please add tasks manually.");
        setShowManual(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setShowManual(true);
    } finally {
      setUploading(false);
      setParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTask = (index: number, field: keyof ParsedTask, value: string | number) => {
    setTasks(
      tasks.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      )
    );
  };

  const addManualTask = () => {
    if (!manualTitle.trim()) return;
    setTasks([
      ...tasks,
      {
        title: manualTitle.trim(),
        date: manualDate,
        points: manualPoints,
      },
    ]);
    setManualTitle("");
  };

  const saveTasks = async () => {
    if (tasks.length === 0) return;
    setSaving(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, planId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save tasks");
      }

      router.push("/dashboard/checklist");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Plan</h1>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-indigo-400 bg-indigo-50"
            : "border-gray-300 hover:border-indigo-300 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <svg
          className="w-12 h-12 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {uploading ? (
          <p className="text-indigo-600 font-medium">Uploading...</p>
        ) : parsing ? (
          <p className="text-indigo-600 font-medium">
            AI is extracting tasks...
          </p>
        ) : (
          <>
            <p className="text-gray-600 font-medium">
              {isDragActive
                ? "Drop your file here"
                : "Drag & drop your plan file, or click to browse"}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Supports .txt, .md, .pdf (max 5MB)
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          {error}
        </div>
      )}

      {/* Manual task entry */}
      {(showManual || tasks.length > 0) && (
        <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Add Task Manually</h3>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Task title"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === "Enter" && addManualTask()}
            />
            <input
              type="date"
              value={manualDate}
              onChange={(e) => setManualDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={manualPoints}
              onChange={(e) => setManualPoints(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5 pts (Easy)</option>
              <option value={10}>10 pts (Medium)</option>
              <option value={20}>20 pts (Hard)</option>
            </select>
            <button
              onClick={addManualTask}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Task preview */}
      {tasks.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Extracted Tasks ({tasks.length})
            </h2>
            <button
              onClick={saveTasks}
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Confirm & Save"}
            </button>
          </div>

          <div className="space-y-2">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => updateTask(index, "title", e.target.value)}
                    className="w-full text-sm font-medium text-gray-900 border-0 focus:outline-none focus:ring-0 p-0"
                  />
                </div>
                <input
                  type="date"
                  value={task.date}
                  onChange={(e) => updateTask(index, "date", e.target.value)}
                  className="text-xs text-gray-500 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <select
                  value={task.points}
                  onChange={(e) =>
                    updateTask(index, "points", Number(e.target.value))
                  }
                  className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value={5}>5 pts</option>
                  <option value={10}>10 pts</option>
                  <option value={20}>20 pts</option>
                </select>
                <button
                  onClick={() => removeTask(index)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={saveTasks}
              disabled={saving}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Confirm & Save All Tasks"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
