import { NextResponse } from "next/server";
import { checkSafetyTrigger, buildSafetyInterruptResponse, buildContactResponse } from "@/lib/chatEngine";
import { getServiceContext } from "@/lib/chatContext";
import { getAssistantReply } from "@/lib/llmAssistant";

const requestLog = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = requestLog.get(ip) || { count: 0, windowStart: now };

  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }

  entry.count += 1;
  requestLog.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { type: "error", message: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.slice(0, 1000) : "";
    const intentHint = typeof body?.intentHint === "string" ? body.intentHint : undefined;

    const history = Array.isArray(body?.history)
      ? body.history
          .filter((m) => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }))
      : [];

    if (!message && !intentHint) {
      return NextResponse.json({ type: "error", message: "No message provided." }, { status: 400 });
    }

    const trigger = checkSafetyTrigger(message);
    if (trigger) {
      return NextResponse.json(buildSafetyInterruptResponse(trigger));
    }

    if (intentHint === "contact") {
      return NextResponse.json(buildContactResponse());
    }
    if (intentHint === "urgent") {
      return NextResponse.json(buildSafetyInterruptResponse({ category: "request_for_person" }));
    }

    const serviceContext = await getServiceContext();
    const reply = await getAssistantReply({ message, history, serviceContext });

    return NextResponse.json({ type: "assistant", message: reply });
  } catch (err) {
    console.error("[api/chat]", err);
    return NextResponse.json(
      { type: "error", message: "Something went wrong processing that message." },
      { status: 500 }
    );
  }
}