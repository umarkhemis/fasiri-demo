"use client";

import { Languages, MessageSquare, Sun, Moon, Clock, ArrowUpRight } from "lucide-react";
import { LogoMark } from "./Logo";
import { Mode } from "./types";

type Props = {
  mode: Mode;
  onModeSwitch: (m: Mode) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
  onHistoryOpen: () => void;
};

export function Header({ mode, onModeSwitch, theme, onThemeToggle, onHistoryOpen }: Props) {
  return (
    <>
      <div className="kente-line" />
      <header className="app-header">
        <LogoMark />

        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === "translate" ? "active" : ""}`}
            onClick={() => onModeSwitch("translate")}
          >
            <Languages size={13} />
            <span className="label">Translate</span>
          </button>
          <button
            className={`mode-btn ${mode === "chat" ? "active" : ""}`}
            onClick={() => onModeSwitch("chat")}
          >
            <MessageSquare size={13} />
            <span className="label">Chat AI</span>
          </button>
        </div>

        <div className="header-actions">
          <button
            className="icon-btn"
            onClick={onThemeToggle}
            title="Toggle theme"
          >
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          <button
            className="icon-btn hidden-mobile"
            onClick={onHistoryOpen}
            title="Translation history"
          >
            <Clock size={15} />
          </button>

          <a
            href="https://api.fasiri-ai.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn hidden-mobile"
            title="API docs"
          >
            <ArrowUpRight size={15} />
          </a>

          <a
            href="https://pypi.org/project/fasiri/"
            target="_blank"
            rel="noopener noreferrer"
            className="sdk-btn hidden-mobile"
          >
            pip install fasiri
          </a>
        </div>
      </header>
    </>
  );
}
