"use client";

import { X, Clock } from "lucide-react";
import { HistoryEntry, PROVIDER_BADGE } from "./types";

type Props = {
  open: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
};

export function HistoryPanel({ open, onClose, history, onRestore }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`history-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`history-panel ${open ? "open" : ""}`}>
        <div className="history-header">
          <span className="history-title">History</span>
          <button className="icon-btn" onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div className="history-empty">
              <Clock size={24} style={{ margin: "0 auto 10px", display: "block", opacity: 0.3 }} />
              <p>No translations yet.</p>
              <p style={{ fontSize: 11, marginTop: 4, color: "var(--mist)", opacity: 0.7 }}>
                Your recent translations will appear here.
              </p>
            </div>
          ) : (
            history.slice().reverse().map((entry) => (
              <button
                key={entry.id}
                className="history-item"
                onClick={() => { onRestore(entry); onClose(); }}
              >
                <span className="history-input">{entry.input}</span>
                {entry.output && (
                  <span className="history-translation">{entry.output}</span>
                )}
                <span className="history-meta">
                  <span className="history-lang">{entry.lang.name}</span>
                  <span className={`provider-badge ${PROVIDER_BADGE[entry.lang.provider]}`}>
                    {entry.lang.provider}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
