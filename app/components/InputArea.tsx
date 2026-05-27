"use client";

import { useRef, type KeyboardEvent, type ChangeEvent } from "react";
import { Send, Loader, RotateCcw } from "lucide-react";
import { LangSelector } from "./LangSelector";
import { Lang, Mode } from "./types";

const MAX_CHARS = 500;

type Props = {
  mode: Mode;
  lang: Lang;
  onLangChange: (l: Lang) => void;
  input: string;
  onInputChange: (v: string) => void;
  onSubmit: (text: string) => void;
  loading: boolean;
  hasMessages: boolean;
  onClear: () => void;
};

export function InputArea({
  mode, lang, onLangChange, input, onInputChange, onSubmit,
  loading, hasMessages, onClear,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(input);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length > MAX_CHARS) return;
    onInputChange(val);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px";
  };

  const charPct = input.length / MAX_CHARS;
  const counterClass =
    charPct >= 1 ? "char-counter limit"
    : charPct >= 0.8 ? "char-counter warn"
    : "char-counter";

  return (
    <div className="input-area">
      {/* Toolbar */}
      <div className="input-toolbar">
        <div className="input-toolbar-left">
          <LangSelector value={lang} onChange={onLangChange} />
          {hasMessages && (
            <button className="clear-btn" onClick={onClear}>
              <RotateCcw size={12} />
              Clear
            </button>
          )}
        </div>
        {input.length > 0 && (
          <span className={counterClass}>
            {input.length}/{MAX_CHARS}
          </span>
        )}
      </div>

      {/* Input row */}
      <div className="input-row">
        <textarea
          ref={textareaRef}
          className="input-box"
          value={input}
          placeholder={
            mode === "translate"
              ? `Translate to ${lang.name}…`
              : `Ask anything — reply in ${lang.name}…`
          }
          rows={1}
          onChange={handleChange}
          onKeyDown={handleKey}
        />
        <button
          className="send-btn"
          onClick={() => onSubmit(input)}
          disabled={!input.trim() || loading}
          title="Send (Enter)"
        >
          {loading
            ? <Loader size={17} className="spin" />
            : <Send size={17} />}
        </button>
      </div>

      {/* Footer */}
      <div className="input-footer">
        <span className="input-hint">
          <span className="hint-kbd">↵</span>
          {mode === "translate" ? " to translate" : " to send"}
          <span style={{ marginLeft: 8 }} className="hidden-mobile">
            <span className="hint-kbd">⇧↵</span> new line
          </span>
        </span>
        <div className="footer-links">
          <a
            href="https://umarkhemis.github.io/fasiri"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Docs
          </a>
          <a
            href="https://fasiri.readthedocs.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          <a
            href="https://pypi.org/project/fasiri/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            style={{ color: "var(--forest-soft)" }}
          >
            pip install fasiri
          </a>
        </div>
      </div>
    </div>
  );
}
