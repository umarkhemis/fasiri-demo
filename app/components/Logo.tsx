"use client";

export function KenteMark({ size = 28 }: { size?: number }) {
  const b = Math.round(size * 0.27);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <rect x={0} y={0}        width={b}         height={size}       rx={2} fill="#2D7D46" />
      <rect x={0} y={0}        width={size}      height={b}          rx={2} fill="#C8860A" />
      <rect x={0} y={size*0.5} width={size*0.78} height={b}          rx={2} fill="#B91C1C" />
      <rect x={b} y={b}        width={b}         height={size*0.5-b} rx={0} fill="#2D7D46" />
    </svg>
  );
}

export function LogoMark() {
  return (
    <div className="logo-mark">
      <KenteMark size={34} />
      <div className="logo-text">
        <span className="logo-name">asiri</span>
        <span className="logo-sub hidden-mobile">African Language AI</span>
      </div>
    </div>
  );
}
