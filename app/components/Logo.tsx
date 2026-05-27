"use client";

export function KenteMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      {/* Base square */}
      <rect width="28" height="28" rx="8" fill="#1a3a2a" />
      {/* Gold top stripe */}
      <rect x="0" y="0" width="28" height="8" rx="8" fill="#c07c2a" />
      <rect x="0" y="4" width="28" height="4" fill="#c07c2a" />
      {/* Green left column */}
      <rect x="0" y="8" width="9" height="20" fill="#2d5c42" />
      {/* Terra accent */}
      <rect x="9" y="16" width="19" height="5" fill="#9b3a1e" />
    </svg>
  );
}

export function LogoMark() {
  return (
    <div className="logo-mark">
      <KenteMark size={34} />
      <div className="logo-text">
        <span className="logo-name">fasiri</span>
        <span className="logo-sub hidden-mobile">African Language AI</span>
      </div>
    </div>
  );
}
