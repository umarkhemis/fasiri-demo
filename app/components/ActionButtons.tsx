"use client";

import { useState } from "react";
import { Copy, Check, Volume2, Share2, Loader } from "lucide-react";

export function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <button className={`action-btn ${done ? "copy-done" : ""}`} onClick={copy}>
      {done ? <Check size={12} /> : <Copy size={12} />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

export function TTSBtn({ text, lang }: { text: string; lang: string }) {
  const [busy, setBusy] = useState(false);
  const play = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: lang }),
      });
      const data = await res.json();
      if (data.audio_url) {
        new Audio(data.audio_url).play();
      } else if (data.audio_base64) {
        const buf = Uint8Array.from(atob(data.audio_base64), (c) => c.charCodeAt(0));
        const url = URL.createObjectURL(new Blob([buf], { type: "audio/mpeg" }));
        const a = new Audio(url);
        a.play();
        a.onended = () => URL.revokeObjectURL(url);
      }
    } finally {
      setBusy(false);
    }
  };
  return (
    <button className="action-btn tts" onClick={play} disabled={busy}>
      {busy ? <Loader size={12} className="spin" /> : <Volume2 size={12} />}
      Listen
    </button>
  );
}

export function ShareBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const share = async () => {
    if (navigator.share) {
      await navigator.share({ text, title: "Translated by Fasiri" }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    }
  };
  return (
    <button className={`action-btn ${done ? "copy-done" : ""}`} onClick={share}>
      {done ? <Check size={12} /> : <Share2 size={12} />}
      Share
    </button>
  );
}
