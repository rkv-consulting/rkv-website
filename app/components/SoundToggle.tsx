"use client";
import { useEffect, useState } from "react";
import * as sfx from "./sfx";

export function SoundToggle() {
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    setMuted(sfx.isMuted());
    // Try to start audio right away; browsers that block it start it on the first tap, click, key or scroll.
    sfx.unlock();
    const EVTS = ["pointerdown", "touchstart", "touchend", "mousedown", "click", "keydown", "wheel", "scroll"] as const;
    const unlock = () => {
      sfx.unlock();
      if (sfx.isRunning()) EVTS.forEach((t) => window.removeEventListener(t, unlock, true));
    };
    let lastEl: Element | null = null;
    const over = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element).closest?.("a, button, summary, select, input, textarea");
      if (el && el !== lastEl) sfx.hover();
      lastEl = el;
    };
    const click = (e: MouseEvent) => {
      if ((e.target as Element).closest?.("a, button, summary")) sfx.press();
    };
    EVTS.forEach((t) => window.addEventListener(t, unlock, { capture: true, passive: true }));
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("click", click, true);
    return () => {
      EVTS.forEach((t) => window.removeEventListener(t, unlock, true));
      document.removeEventListener("pointerover", over);
      document.removeEventListener("click", click, true);
    };
  }, []);
  return (
    <button type="button" className="sound-toggle" aria-pressed={!muted} aria-label={muted ? "Turn sound on" : "Turn sound off"}
      onClick={() => {
        // If audio was still waiting to start, this press just starts it (sound stays on).
        const wasRunning = sfx.isRunning();
        sfx.unlock();
        const m = wasRunning || muted ? !muted : false;
        sfx.setMuted(m); setMuted(m);
        if (!m) setTimeout(sfx.chime, 60);
      }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" />
        {muted ? <path d="m22 9-6 6M16 9l6 6" /> : <><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></>}
      </svg>
    </button>
  );
}
