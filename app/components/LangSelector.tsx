"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Volume2 } from "lucide-react";
import { Lang, LANGS, PROVIDER_BADGE, PROVIDER_DOT } from "./types";

type Props = { value: Lang; onChange: (l: Lang) => void };

export function LangSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const grouped = LANGS.reduce<Record<string, Lang[]>>((acc, l) => {
    (acc[l.region] ??= []).push(l);
    return acc;
  }, {});

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="lang-btn" onClick={() => setOpen(!open)}>
        <div
          className={`lang-region-dot ${PROVIDER_DOT[value.provider] ?? ""}`}
        />
        <Globe size={13} color="var(--forest-soft)" />
        <span style={{ fontWeight: 500 }}>{value.name}</span>
        <span style={{ color: "var(--mist)", fontSize: 12 }} className="hidden-mobile">
          {value.native}
        </span>
        <ChevronDown
          size={12}
          color="var(--mist)"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        />
      </button>

      {open && (
        <div className="lang-dropdown fade-in">
          <div className="lang-dropdown-inner">
            {Object.entries(grouped).map(([region, langs]) => (
              <div key={region}>
                <p className="lang-region-header">{region}</p>
                {langs.map((l) => (
                  <button
                    key={l.code}
                    className={`lang-option ${l.code === value.code ? "active" : ""}`}
                    onClick={() => { onChange(l); setOpen(false); }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div
                        className={`lang-region-dot ${PROVIDER_DOT[l.provider] ?? ""}`}
                        style={{ width: 6, height: 6 }}
                      />
                      <span className="lang-option-name">{l.name}</span>
                      <span className="lang-option-native">{l.native}</span>
                    </span>
                    <span className="lang-option-right">
                      {l.tts && (
                        <span title="TTS available">
                          <Volume2 size={11} color="var(--forest-soft)" />
                        </span>
                      )}
                      <span className={`provider-badge ${PROVIDER_BADGE[l.provider]}`}>
                        {l.provider}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
