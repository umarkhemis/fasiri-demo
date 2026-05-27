import { NextRequest, NextResponse } from "next/server";

const FASIRI_BASE = process.env.FASIRI_BASE_URL ?? "https://api.fasiri-ai.com";
const FASIRI_KEY  = process.env.FASIRI_API_KEY  ?? "";

export async function POST(req: NextRequest) {
  if (!FASIRI_KEY) {
    return NextResponse.json({ error: "TTS service not configured." }, { status: 503 });
  }

  const { text, language } = await req.json();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(`${FASIRI_BASE}/api/v1/speech/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FASIRI_KEY}`,
      },
      body: JSON.stringify({ text, language }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.detail?.message ?? "TTS failed." },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    clearTimeout(timer);
    console.error("TTS fetch error:", err);
    return NextResponse.json(
      { error: "TTS service is unavailable - please try again in a moment." },
      { status: 503 }
    );
  }
}
