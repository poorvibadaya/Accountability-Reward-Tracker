import { createClient } from "@/lib/supabase/server";
import { parsePlanToTasks } from "@/lib/gemini";
import { NextResponse } from "next/server";

async function extractPdfText(buffer: Buffer): Promise<string> {
  // pdf-parse v1 tries to read a test file on import, so we must
  // import the inner module directly to avoid that behavior
  const { default: pdfParse } = await import("pdf-parse/lib/pdf-parse.js");
  const data = await pdfParse(buffer);
  return data.text;
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

    const { planId } = await request.json();

    const { data: plan } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .eq("user_id", user.id)
      .single();

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("plans")
      .download(plan.file_url);

    if (downloadError || !fileData) {
      return NextResponse.json(
        { error: "Failed to download file" },
        { status: 500 }
      );
    }

    let text: string;
    const fileName = plan.original_filename?.toLowerCase() ?? "";

    if (fileName.endsWith(".pdf")) {
      const buffer = Buffer.from(await fileData.arrayBuffer());
      text = await extractPdfText(buffer);
    } else {
      text = await fileData.text();
    }

    if (!text.trim()) {
      return NextResponse.json(
        { tasks: [], error: "File appears to be empty" },
        { status: 200 }
      );
    }

    const tasks = await parsePlanToTasks(text);
    return NextResponse.json({ tasks });
  } catch (err) {
    console.error("Parse tasks error:", err);
    return NextResponse.json(
      {
        tasks: [],
        error: "AI parsing failed. Please add tasks manually.",
      },
      { status: 200 }
    );
  }
}
