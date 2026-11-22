"use client";
import { useEffect, useMemo, useState } from "react";
import { NamedCursor, BF } from "./Build";
import { DEPTS } from "../data";

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const COLORS = DEPTS.map((d) => d.color);

type Win = { x: number; y: number; w: number; h: number; c: string; d: number; dur: number };
type Bld = { x: number; y: number; w: number; h: number; roof: "flat" | "gable" | "step"; wins: Win[] };

function useCity() {
  return useMemo(() => {
    const r = rng(42);
    const blds: Bld[] = [];
    let x = 0;
    while (x < 1200) {
      const w = 90 + Math.floor(r() * 90);
      const h = 120 + Math.floor(r() * 230);
      const y = 420 - h;
      const roof = r() < 0.28 ? "gable" : r() < 0.5 ? "step" : "flat";
      const cols = Math.max(2, Math.floor((w - 20) / 22));
      const rows = Math.max(3, Math.floor((h - 30) / 26));
      const wins: Win[] = [];
      const cw = (w - 20) / cols;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          wins.push({
            x: x + 10 + i * cw + 3,
            y: y + 18 + j * 26,
            w: cw - 6,
            h: 14,
            c: COLORS[Math.floor(r() * COLORS.length)],
            d: r() * 12,
            dur: 6 + r() * 8,
          });
        }
      }
      blds.push({ x, y, w, h, roof, wins });
      x += w + 8 + Math.floor(r() * 14);
    }
    return blds;
  }, []);
}

const EVENTS = [
  { a: "Leak", c: "#2F6BFF", t: "Seller lead booked", s: "12 Oak St" },
  { a: "Rent", c: "#0E9F6E", t: "Promise to pay logged", s: "Unit 4B" },
  { a: "Ledger", c: "#D97706", t: "37 bills coded", s: "Maple Court" },
  { a: "Desk", c: "#0E9F6E", t: "Resident answered", s: "2:14 am" },
  { a: "LP", c: "#E0457B", t: "Q3 update drafted", s: "Fund II" },
  { a: "Draw", c: "#0891B2", t: "Draw #3 checked", s: "Elm rehab" },
  { a: "Tax", c: "#0E9F6E", t: "Appeal packet ready", s: "+$18k value gap" },
];

const STEPS = ["Seller leads answered", "Rent reminders sent", "Books reconciled", "Drafting investor update…"];
const CREW = [
  { n: "Leak", c: "#2F6BFF" },
  { n: "Desk", c: "#0E9F6E" },
  { n: "Ledger", c: "#D97706" },
  { n: "LP", c: "#E0457B" },
];

export function Hero() {
  const city = useCity();
  const [pct, setPct] = useState(68);
  const [ev, setEv] = useState(0);
  const [pos, setPos] = useState(CREW.map((_, i) => ({ x: 120 + i * 220, y: 120 + (i % 2) * 120 })));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const a = window.setInterval(() => setPct((p) => (p >= 100 ? 12 : p + 2)), 900);
    const b = window.setInterval(() => setEv((e) => (e + 1) % EVENTS.length), 2600);
    const c = window.setInterval(() => {
      const w = Math.min(window.innerWidth - 48, 1200);
      setPos(CREW.map(() => ({ x: 40 + Math.random() * (w - 160), y: 40 + Math.random() * 300 })));
    }, 2400);
    return () => { clearInterval(a); clearInterval(b); clearInterval(c); };
  }, []);

  const doneSteps = Math.min(3, Math.floor(pct / 26));
  const e1 = EVENTS[ev], e2 = EVENTS[(ev + 3) % EVENTS.length];

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap" data-enter>
        <div className="mono hero-label">/hero · 1200 × auto</div>
        <h1 id="hero-title" className="display">
          <span className="ln">Your portfolio, run</span>
          <span className="ln">
            <span className="sel-word">
              live
              <span className="box" aria-hidden="true"><i /><i /><i /><i /></span>
              <span className="dim" aria-hidden="true">21 agents</span>
            </span>{" "}
            by AI agents.<span className="caret" aria-hidden="true" />
          </span>
        </h1>
        <p className="sub">
          RKV Consulting builds AI agents for real estate investors and investment firms. They answer seller leads, the
          resident desk and late rent, close the books and draft your investor updates. You approve what matters.
        </p>
        <div className="hero-ctas">
          <a className="btn btn-primary" href="#contact">Book a strategy call</a>
          <button type="button" className="btn btn-ghost" onClick={() => window.dispatchEvent(new Event("rkv:replay"))}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
            Watch the agents work
          </button>
        </div>
        <div className="mono hero-hint">Scroll to build · Move your mouse and the crew follows · Esc skips</div>

        <BF size="Portfolio · 1200 × 560" className="stage-bf">
          <div className="stage">
            <div className="stage-grid" />
            <svg className="city" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
              <defs>
                <linearGradient id="bg-b" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="1" stopColor="#eef2f0" />
                </linearGradient>
              </defs>
              {city.map((b, i) => (
                <g key={i}>
                  {b.roof === "gable" && <path d={`M${b.x - 4} ${b.y + 2} L${b.x + b.w / 2} ${b.y - 34} L${b.x + b.w + 4} ${b.y + 2} Z`} fill="#fff" stroke="#cfd6d3" />}
                  {b.roof === "step" && <rect x={b.x + b.w * 0.2} y={b.y - 18} width={b.w * 0.6} height={20} fill="#fff" stroke="#cfd6d3" />}
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="url(#bg-b)" stroke="#cfd6d3" />
                  {b.wins.map((w, j) => (
                    <rect key={j} className="win" x={w.x} y={w.y} width={w.w} height={w.h} rx="2" fill="#e6ebe9"
                      style={{ ["--c" as string]: w.c, animationDelay: `${w.d}s`, animationDuration: `${w.dur}s` }} />
                  ))}
                </g>
              ))}
            </svg>

            <div className="stage-chip" key={`a${ev}`} style={{ right: 40, top: 40, animation: "feedIn .5s both" }}>
              <i style={{ width: 8, height: 8, borderRadius: 4, background: e1.c, display: "inline-block" }} />
              <b>{e1.a}</b> {e1.t} · {e1.s}
            </div>
            <div className="stage-chip hide-sm" key={`b${ev}`} style={{ right: 120, top: 92, animation: "feedIn .5s .3s both" }}>
              <i style={{ width: 8, height: 8, borderRadius: 4, background: e2.c, display: "inline-block" }} />
              <b>{e2.a}</b> {e2.t} · {e2.s}
            </div>

            {mounted && CREW.map((c, i) => (
              <NamedCursor key={c.n} name={c.n} color={c.c} style={{ left: 0, top: 0, transform: `translate(${pos[i].x}px, ${pos[i].y}px)` }} />
            ))}

            <div className="status">
              <div className="row">
                <span className="live"><span className="dot" /> live run · your portfolio</span>
                <span>{pct}%</span>
              </div>
              <div className="bar"><span style={{ width: `${pct}%` }} /></div>
              <div className="avs">
                {DEPTS.map((d) => <i key={d.id} style={{ background: d.color }} />)}
                <span style={{ marginLeft: 6 }}>21 agents · 6 departments</span>
              </div>
              <ul className="checks">
                {STEPS.map((s, i) => (
                  <li key={s} style={{ opacity: i <= doneSteps ? 1 : 0.4 }}>
                    {i < doneSteps ? <span className="ok">✓</span> : <span className="run">●</span>} {i < doneSteps ? s.replace("…", "") : s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </BF>
      </div>
      <style>{`
        .win { animation-name: winLight; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
        @keyframes winLight { 0%, 70%, 100% { fill: #e6ebe9; } 78%, 92% { fill: var(--c); } }
      `}</style>
    </section>
  );
}
