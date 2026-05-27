"use client";

import { Mode } from "./types";

type Props = {
  mode: Mode;
  onSuggestion: (s: string) => void;
};

const TRANSLATE_SUGG = [
  "Good morning",
  "How are you?",
  "Thank you very much",
  "Welcome home",
  "Where is the hospital?",
  "My name is David",
];

const CHAT_SUGG = [
  "Tell me about Uganda",
  "What is Luganda?",
  "Teach me a greeting",
  "African history",
  "What crops grow in West Africa?",
];

export function WelcomeScreen({ mode, onSuggestion }: Props) {
  const sugg = mode === "translate" ? TRANSLATE_SUGG : CHAT_SUGG;

  return (
    <div className="welcome fade-in">
      <div className="welcome-hero">
        <div className="welcome-badge">
          <span className="welcome-badge-dot" />
          Live
        </div>
        <h2 className="welcome-title">
          {mode === "translate" ? (
            <>Speak in <em>19+ African</em> Languages</>
          ) : (
            <>Chat with AI, reply in <em>your language</em></>
          )}
        </h2>
        <p className="welcome-desc">
          {mode === "translate"
            ? "Type any English text - get an instant, quality-scored translation powered by Sunbird AI, Khaya AI, or HuggingFace."
            : "Ask anything. Every AI response is translated into your chosen African language in real time using Grok + Fasiri."}
        </p>
      </div>

      <div className="stats-row">
        {[["19+", "Languages"], ["3", "Providers"], ["1", "API"]].map(([v, l]) => (
          <div key={l} className="stat-item">
            <div className="stat-num">{v}</div>
            <div className="stat-lbl">{l}</div>
          </div>
        ))}
      </div>

      <div style={{ width: "100%" }}>
        <p className="suggestions-label" style={{ textAlign: "center" }}>
          Try one of these
        </p>
        <div className="suggestions">
          {sugg.map((s) => (
            <button key={s} className="suggestion-chip" onClick={() => onSuggestion(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
