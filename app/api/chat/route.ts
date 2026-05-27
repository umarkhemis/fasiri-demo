import { NextRequest, NextResponse } from "next/server";

const FASIRI_BASE  = process.env.FASIRI_BASE_URL ?? "https://api.fasiri-ai.com";
const FASIRI_KEY   = process.env.FASIRI_API_KEY  ?? "";
const GROQ_API_KEY = process.env.GROQ_API_KEY    ?? "";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

const SYSTEM_PROMPT = `You are Fasiri Assistant, a helpful AI that specialises in African culture, languages, history, and anything else users need help with. You are knowledgeable, warm, and concise. Keep responses clear and under 150 words unless the user asks for detail.`;

type HistoryMessage = { role: "user" | "assistant"; content: string };

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
        (err as { cause: Error }).cause?.message?.includes("Timeout"));
    if (retries > 0 && isTimeout) {
      console.warn(`Fasiri timeout - retrying (${retries} left)…`);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

export async function POST(req: NextRequest) {
  if (!GROQ_API_KEY || !FASIRI_KEY) {
    return NextResponse.json({ error: "Chat service not configured. Check GROQ_API_KEY and FASIRI_API_KEY." }, { status: 503 });
  }

  const { message, history, target_lang, lang_name } = await req.json();

  // 1. Get reply from Groq
  const messages: HistoryMessage[] = [
    ...(history ?? []),
    { role: "user", content: message },
  ];

  let englishReply = "";

  try {
    const groqRes = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 512,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.json().catch(() => ({}));
      console.error("Groq error:", err);
      return NextResponse.json({ error: "AI service temporarily unavailable." }, { status: 503 });
    }

    const groqData = await groqRes.json();
    englishReply = groqData.choices?.[0]?.message?.content ?? "";
  } catch (err) {
    console.error("Groq fetch error:", err);
    return NextResponse.json({ error: "AI service temporarily unavailable." }, { status: 503 });
  }

  // 2. Translate via Fasiri (best-effort — chat still works if translation times out)
  let translatedReply: string | null = null;
  let provider: string | null = null;
  let qualityScore: number | null = null;
  let latencyMs: number | null = null;

  if (target_lang && target_lang !== "en") {
    try {
      const tRes = await fetchWithRetry(`${FASIRI_BASE}/api/v1/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${FASIRI_KEY}`,
        },
        body: JSON.stringify({ text: englishReply, target_lang, source_lang: "en", provider: "auto" }),
      });

      if (tRes.ok) {
        const tData = await tRes.json();
        translatedReply = tData.translated_text;
        provider        = tData.provider;
        qualityScore    = tData.quality_score;
        latencyMs       = tData.latency_ms;
      }
    } catch (err) {
      console.error("Translation error (non-fatal):", err);
    }
  }

  return NextResponse.json({
    english_reply:    englishReply,
    translated_reply: translatedReply,
    lang_name,
    provider,
    quality_score:  qualityScore,
    latency_ms:     latencyMs,
  });
}
