"use client";

type Props = { score: number };

export function QualityBar({ score }: Props) {
  const pct = Math.round(score * 100);
  const color =
    score >= 0.85 ? "var(--forest-soft)"
    : score >= 0.70 ? "var(--ochre)"
    : "var(--terra)";

  const label =
    score >= 0.85 ? "High"
    : score >= 0.70 ? "Good"
    : "Fair";

  return (
    <div className="qbar-wrap">
      <div className="qbar-track">
        <div className="qbar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="qbar-label">{label} · {pct}%</span>
    </div>
  );
}
