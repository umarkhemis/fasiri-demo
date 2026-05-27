"use client";

import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { TranslateMsg, ChatMsg, PROVIDER_BADGE } from "./types";
import { QualityBar } from "./QualityBar";
import { CopyBtn, TTSBtn, ShareBtn } from "./ActionButtons";

// ── Loading skeleton ──────────────────────────────────────────────────────

function SkeletonBubble() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="shimmer-line" style={{ width: "88%" }} />
      <div className="shimmer-line" style={{ width: "65%" }} />
      <div className="shimmer-line" style={{ width: "42%" }} />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="typing-dots">
      <span /><span /><span />
    </div>
  );
}

// ── Translate bubble ──────────────────────────────────────────────────────

export function TranslateCard({ msg }: { msg: TranslateMsg }) {
  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* User input */}
      <div className="msg-row user">
        <div className="bubble bubble-user">{msg.input}</div>
      </div>

      {/* Translation result */}
      <div className="msg-row assistant">
        <div className="bubble bubble-ai">
          {msg.error ? (
            <p style={{ color: "var(--terra)", fontSize: 14, margin: 0, fontStyle: "italic" }}>
              {msg.error}
            </p>
          ) : !msg.translation ? (
            <SkeletonBubble />
          ) : (
            <>
              <p className="bubble-main-text">{msg.translation}</p>
              <div className="meta-row">
                {msg.provider && (
                  <span className={`provider-badge ${PROVIDER_BADGE[msg.provider] ?? ""}`}>
                    {msg.provider}
                  </span>
                )}
                <span className="latency-tag">{msg.lang.name}</span>
                {msg.latency && (
                  <span className="latency-tag">{msg.latency}ms</span>
                )}
              </div>
              {msg.quality !== undefined && <QualityBar score={msg.quality} />}
              <div className="action-bar">
                <CopyBtn text={msg.translation} />
                {msg.lang.tts && <TTSBtn text={msg.translation} lang={msg.lang.code} />}
                <ShareBtn text={msg.translation} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Chat bubble ───────────────────────────────────────────────────────────

export function ChatBubble({ msg }: { msg: ChatMsg }) {
  const [enOpen, setEnOpen] = useState(false);

  if (msg.role === "user") {
    return (
      <div className="msg-row user fade-up">
        <div className="bubble bubble-user">{msg.english}</div>
      </div>
    );
  }

  return (
    <div className="msg-row assistant fade-up">
      <div className="bubble bubble-ai">
        {msg.loading ? (
          <TypingIndicator />
        ) : msg.error ? (
          <p style={{ color: "var(--terra)", fontSize: 14, margin: 0, fontStyle: "italic" }}>
            {msg.error}
          </p>
        ) : (
          <>
            <p className="bubble-main-text">
              {msg.translated ?? msg.english}
            </p>

            {msg.translated && (
              <div style={{ marginTop: 10 }}>
                <button className="en-toggle" onClick={() => setEnOpen(!enOpen)}>
                  <BookOpen size={11} />
                  <span>{enOpen ? "Hide English" : "View in English"}</span>
                  <ChevronDown
                    size={11}
                    style={{
                      transform: enOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.15s",
                    }}
                  />
                </button>
                {enOpen && <p className="en-text">{msg.english}</p>}
              </div>
            )}

            <div className="meta-row">
              {msg.provider && (
                <span className={`provider-badge ${PROVIDER_BADGE[msg.provider] ?? ""}`}>
                  {msg.provider}
                </span>
              )}
              {msg.latency && (
                <span className="latency-tag">{msg.latency}ms</span>
              )}
            </div>
            {msg.quality !== undefined && msg.translated && (
              <QualityBar score={msg.quality} />
            )}
            <div className="action-bar">
              <CopyBtn text={msg.translated ?? msg.english} />
              {msg.lang.tts && msg.translated && (
                <TTSBtn text={msg.translated} lang={msg.lang.code} />
              )}
              <ShareBtn text={msg.translated ?? msg.english} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
