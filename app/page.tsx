"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { TranslateCard, ChatBubble } from "./components/MessageBubbles";
import { InputArea } from "./components/InputArea";
import { HistoryPanel } from "./components/HistoryPanel";
import { LANGS, uid, type Mode, type Msg, type TranslateMsg, type ChatMsg, type Lang, type HistoryEntry } from "./components/types";

export default function Home() {
  const [mode, setMode]           = useState<Mode>("translate");
  const [lang, setLang]           = useState<Lang>(LANGS[0]);
  const [msgs, setMsgs]           = useState<Msg[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [theme, setTheme]         = useState<"light" | "dark">("light");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory]     = useState<HistoryEntry[]>([]);
  const bottomRef                 = useRef<HTMLDivElement>(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const chatHistory = msgs
    .filter((m): m is ChatMsg => m.kind === "chat" && !m.loading && m.role !== undefined)
    .map((m) => ({ role: m.role, content: m.english }));

  // ── Translate ───────────────────────────────────────────────────────────

  const doTranslate = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    setLoading(true);

    const ph: TranslateMsg = { id: uid(), kind: "translate", input: text, lang };
    setMsgs((p) => [...p, ph]);

    try {
      const res  = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target_lang: lang.code }),
      });
      const data = await res.json();
      setMsgs((p) =>
        p.map((m) =>
          m.id === ph.id
            ? { ...m, translation: data.translated_text, provider: data.provider, quality: data.quality_score, latency: data.latency_ms, error: data.error }
            : m
        )
      );
      // Save to history
      if (data.translated_text) {
        setHistory((h) => [
          ...h,
          { id: uid(), input: text, output: data.translated_text, lang, mode: "translate", timestamp: Date.now() },
        ]);
      }
    } catch {
      setMsgs((p) =>
        p.map((m) => m.id === ph.id ? { ...m, error: "Network error. Please try again." } : m)
      );
    } finally {
      setLoading(false);
    }
  }, [loading, lang]);

  // ── Chat ────────────────────────────────────────────────────────────────

  const doChat = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    setLoading(true);

    const userMsg: ChatMsg = { id: uid(), kind: "chat", role: "user",      english: text, lang };
    const asstPh:  ChatMsg = { id: uid(), kind: "chat", role: "assistant", english: "",   lang, loading: true };
    setMsgs((p) => [...p, userMsg, asstPh]);

    try {
      const res  = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: chatHistory, target_lang: lang.code, lang_name: lang.name }),
      });
      const data = await res.json();
      setMsgs((p) =>
        p.map((m) =>
          m.id === asstPh.id
            ? { ...m, loading: false, english: data.english_reply ?? "", translated: data.translated_reply ?? undefined, provider: data.provider ?? undefined, quality: data.quality_score ?? undefined, latency: data.latency_ms ?? undefined, error: data.error ?? undefined }
            : m
        )
      );
      if (data.translated_reply || data.english_reply) {
        setHistory((h) => [
          ...h,
          { id: uid(), input: text, output: data.translated_reply ?? data.english_reply, lang, mode: "chat", timestamp: Date.now() },
        ]);
      }
    } catch {
      setMsgs((p) =>
        p.map((m) => m.id === asstPh.id ? { ...m, loading: false, error: "Network error. Please try again." } : m)
      );
    } finally {
      setLoading(false);
    }
  }, [loading, lang, chatHistory]);

  const submit = useCallback(
    (text: string) => { if (mode === "translate") doTranslate(text); else doChat(text); },
    [mode, doTranslate, doChat]
  );

  const switchMode = (m: Mode) => { setMode(m); setMsgs([]); setInput(""); };

  const restoreHistory = (entry: HistoryEntry) => {
    setMode(entry.mode);
    setLang(entry.lang);
    setInput(entry.input);
  };

  const empty = msgs.length === 0;

  return (
    <div className="app-shell">
      <Header
        mode={mode}
        onModeSwitch={switchMode}
        theme={theme}
        onThemeToggle={() => setTheme((t) => t === "light" ? "dark" : "light")}
        onHistoryOpen={() => setHistoryOpen(true)}
      />

      {/* Messages */}
      <div className="messages">
        {empty ? (
          <WelcomeScreen mode={mode} onSuggestion={submit} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {msgs.map((m) =>
              m.kind === "translate"
                ? <TranslateCard key={m.id} msg={m} />
                : <ChatBubble   key={m.id} msg={m} />
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <InputArea
        mode={mode}
        lang={lang}
        onLangChange={setLang}
        input={input}
        onInputChange={setInput}
        onSubmit={submit}
        loading={loading}
        hasMessages={!empty}
        onClear={() => { setMsgs([]); setInput(""); }}
      />

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onRestore={restoreHistory}
      />
    </div>
  );
}
