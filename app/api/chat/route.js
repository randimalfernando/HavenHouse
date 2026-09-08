import { NextResponse } from "next/server";
import { processMessage } from "@/lib/chatEngine";

// This route is fully stateless: it reads only the single incoming request
// body, computes a response, and returns it. It does not write to a
// database, file, cache, or log any message content. There is no
// CHAT_SESSION or CHAT_MESSAGE table anywhere in this codebase.

// Very small in-memory rate limiter (per server instance) since there is no
// auth layer on this endpoint. Not persisted; resets on server restart.
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

    if (!message && !intentHint) {
      return NextResponse.json(
        { type: "error", message: "No message provided." },
        { status: 400 }
      );
    }

    const result = processMessage({ message, intentHint });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { type: "error", message: "Something went wrong processing that message." },
      { status: 500 }
    );
  }
}
