"use client";
import { useEffect, useRef, useState } from "react";
import { CursorIcon } from "./Logo";
import { DEPTS } from "../data";

const RING_COLORS = ["#2F6BFF", "#0E9F6E", "#D97706", "#E0457B", "#0891B2", "#0B1215", "#14A385", "#5B8CFF", "#F59E0B", "#10B981", "#EF6A9A", "#22B8CF"];
const TOTAL_TASKS = 640;

/** Wraps a block so it shows as a dashed frame until it scrolls into view, then "builds". */
export function BF({ size, className = "", children, as = "div", id }: { size?: string; className?: string; children: React.ReactNode; as?: "div" | "article" | "li"; id?: string }) {
  const Tag = as as "div";
  return (
    <Tag className={`bf ${className}`} data-size={size} id={id}>
      <span className="handle tl" aria-hidden="true" />
      <span className="handle tr" aria-hidden="true" />
      <span className="handle bl" aria-hidden="true" />
      <span className="handle br" aria-hidden="true" />
      {children}
    </Tag>
  );
}

/** Runs the scroll-to-build, the pointer swarm and the floating build line. */
export function BuildController() {
  const [built, setBuilt] = useState(0);
  const [total, setTotal] = useState(1);
  const [done, setDone] = useState(false);
  const [secs, setSecs] = useState(0);
  const start = useRef<number>(0);
  const swarm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    start.current = performance.now();
    const frames = Array.from(document.querySelectorAll<HTMLElement>(".bf"));
    setTotal(frames.length);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = () => setBuilt(document.querySelectorAll(".bf.built").length);

    if (reduce) {
      frames.forEach((f) => f.classList.add("built"));
      count();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = 220 + Math.random() * 380;
            window.setTimeout(() => {
              el.classList.add("built");
              count();
            }, delay);
            io.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    frames.forEach((f) => io.observe(f));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        frames.forEach((f) => f.classList.add("built"));
        count();
      }
    };
    window.addEventListener("keydown", onKey);

    const onReplay = () => {
      frames.forEach((f) => {
        f.classList.remove("built");
        io.observe(f);
      });
      start.current = performance.now();
      setDone(false);
      count();
    };
    window.addEventListener("rkv:replay", onReplay);
    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("rkv:replay", onReplay);
    };
  }, []);

  useEffect(() => {
    if (total > 1 && built >= total && !done) {
      setDone(true);
      setSecs((performance.now() - start.current) / 1000);
    }
  }, [built, total, done]);

  // Swarm ring: eases toward the pointer, settles on it when the pointer rests.
  useEffect(() => {
    const el = swarm.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) {
      (el.parentElement as HTMLElement).style.display = "none";
      return;
    }
    let tx = window.innerWidth * 0.72, ty = window.innerHeight * 0.32;
    let x = tx, y = ty, raf = 0, last = performance.now();
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; last = performance.now(); };
    const tick = (t: number) => {
      const idle = t - last > 700;
      const k = idle ? 0.08 : 0.025;
      const ox = idle ? 0 : 90, oy = idle ? 0 : 60;
      x += (tx + ox - x) * k;
      y += (ty + oy - y) * k;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); };
  }, []);

  const tasks = Math.round((built / Math.max(total, 1)) * TOTAL_TASKS);
  return (
    <>
      <div className="swarm-layer" aria-hidden="true"><div className="swarm" ref={swarm}>
        <div className="ring">
          {RING_COLORS.map((c, i) => {
            const a = (i / RING_COLORS.length) * Math.PI * 2;
            const x = 60 + Math.cos(a) * 52 - 8;
            const y = 60 + Math.sin(a) * 52 - 8;
            return (
              <svg key={i} viewBox="0 0 18 18" style={{ left: x, top: y, transform: `rotate(${(a * 180) / Math.PI + 135}deg)` }}>
                <path d="M2 1.5v13.2l3.6-3.4 2.5 5 2.3-1.1-2.5-4.9 5-.4z" fill={c} stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            );
          })}
        </div>
      </div></div>
      <div className="buildline" role="status" aria-live="polite">
        <span className="avs" aria-hidden="true">
          {DEPTS.map((d) => <i key={d.id} style={{ background: d.color }} />)}
        </span>
        <span className="hide-xs">21 agents</span>
        {done ? (
          <span>Ran {TOTAL_TASKS} tasks in {secs.toFixed(1)}s</span>
        ) : (
          <>
            <span>{tasks} / {TOTAL_TASKS} tasks</span>
            <span className="prog hide-xs"><span style={{ width: `${(tasks / TOTAL_TASKS) * 100}%` }} /></span>
          </>
        )}
        <button type="button" onClick={() => window.dispatchEvent(new Event("rkv:replay"))}>Replay</button>
      </div>
    </>
  );
}

export function NamedCursor({ name, color, style }: { name: string; color: string; style?: React.CSSProperties }) {
  return (
    <div className="acur" style={style} aria-hidden="true">
      <CursorIcon color={color} />
      <span style={{ background: color }}>{name}</span>
    </div>
  );
}
