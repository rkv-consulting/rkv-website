export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#0A0A0A" />
      <path d="M7.5 16.5 16 9l8.5 7.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.6 14.2v11.2l3-2.9 2.1 4.1 2-1-2.1-4 4.1-.3z" fill="#fff" stroke="#0A0A0A" strokeWidth=".8" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <a href="/#top" className="logo" aria-label="RKV Consulting home">
      <LogoMark />
      <span>RKV <small>Consulting</small></span>
    </a>
  );
}

export function CursorIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2 1.5v13.2l3.6-3.4 2.5 5 2.3-1.1-2.5-4.9 5-.4z" fill={color} stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
