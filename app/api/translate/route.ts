import { NextRequest, NextResponse } from "next/server";

const FASIRI_BASE = process.env.FASIRI_BASE_URL ?? "https://api.fasiri-ai.com";
const FASIRI_KEY  = process.env.FASIRI_API_KEY  ?? "";

// Render free tier spins down — retry up to 2 times with 30s timeout each
async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err: unknown) {
    clearTimeout(timer);
    const isTimeout =
      (err instanceof Error && (err.name === "AbortError" || err.message.includes("Timeout"))) ||
      (typeof err === "object" && err !== null && "cause" in err &&
        err.cause instanceof Error && err.cause.message.includes("Timeout"));

    if (retries > 0 && isTimeout) {
      console.warn(`Fasiri timeout — retrying (${retries} left)…`);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

export async function POST(req: NextRequest) {
  if (!FASIRI_KEY) {
    return NextResponse.json({ error: "Translation service not configured." }, { status: 503 });
  }

  const { text, target_lang, source_lang = "en" } = await req.json();

  if (!text?.trim() || !target_lang) {
    return NextResponse.json({ error: "text and target_lang are required." }, { status: 400 });
  }

  try {
    const res = await fetchWithRetry(`${FASIRI_BASE}/api/v1/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FASIRI_KEY}`,
      },
      body: JSON.stringify({ text: text.trim(), target_lang, source_lang, provider: "auto" }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.detail?.message ?? "Translation failed. Please try again." },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Translate fetch error:", err);
    return NextResponse.json(
      { error: "The translation service is waking up - please try again in a moment." },
      { status: 503 }
    );
  }
}
