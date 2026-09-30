import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

export async function GET() {
  try {
    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: "Reply with exactly: Haven House OpenAI connection working.",
    });

    return NextResponse.json({ ok: true, output: response.output_text });
  } catch (err) {
    console.error("[test-openai]", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Something went wrong calling OpenAI." },
      { status: 500 }
    );
  }
}