import { NextResponse } from "next/server";
import { searchServices, cleanQuery, MIN_QUERY } from "@/lib/serviceSearch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Tiny in-memory limiter (per server instance): 60 searches/minute per IP.
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 60;
}

// Public endpoint: returns service names/descriptions that are already public on the site.
// Search terms are NOT stored or logged.
export async function GET(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many searches. Please wait a moment." }, { status: 429 });
  }

  const q = cleanQuery(new URL(request.url).searchParams.get("q"));
  if (q.length < MIN_QUERY) {
    return NextResponse.json({ ok: true, results: [] });
  }

  try {
    const results = await searchServices(q);
    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error("[api/search]", err);
    return NextResponse.json({ ok: false, error: "Search is unavailable right now." }, { status: 500 });
  }
}
