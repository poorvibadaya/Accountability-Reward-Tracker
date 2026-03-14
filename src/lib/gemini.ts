import { ParsedTask } from "./types";

function buildPrompt(planText: string): string {
  const today = new Date().toISOString().split("T")[0];

  return `You are a task extraction assistant. Given the following accountability plan, extract a structured list of daily tasks.

For each task, provide:
- title: short task name (under 60 chars)
- description: optional longer description
- date: the date in YYYY-MM-DD format. If specific dates are mentioned, use them. If days of week are mentioned (Mon, Tue, etc.), map them to actual dates starting from ${today}. If no dates are given, distribute tasks across the next 30 days.
- points: difficulty rating - 5 (easy/quick), 10 (medium/standard), 20 (hard/long)

If the plan mentions recurring tasks (e.g., "workout every day"), create separate entries for each day.

Return ONLY a valid JSON array. No markdown, no explanation, no code fences.
Example: [{"title":"Run 5km","description":"Morning run in the park","date":"${today}","points":10}]

Plan:
${planText.slice(0, 15000)}`;
}

function cleanJsonResponse(text: string): string {
  return text
    .replace(/^```json?\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim();
}

async function parseWithOpenRouter(prompt: string): Promise<ParsedTask[]> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemma-3n-e4b-it:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`OpenRouter error: ${res.status} ${error}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim() ?? "[]";
  return JSON.parse(cleanJsonResponse(text));
}

async function parseWithGemini(prompt: string): Promise<ParsedTask[]> {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const text = response.text?.trim() ?? "[]";
  return JSON.parse(cleanJsonResponse(text));
}

export async function parsePlanToTasks(
  planText: string
): Promise<ParsedTask[]> {
  const prompt = buildPrompt(planText);

  // Try OpenRouter first, fall back to Gemini
  try {
    return await parseWithOpenRouter(prompt);
  } catch (err) {
    console.warn("OpenRouter failed, trying Gemini:", err);
    return await parseWithGemini(prompt);
  }
}
