"use client";
/*
 * Hero film: one deal moving through the crew, from a 2 am seller text to the owner's Monday brief.
 * Built with Remotion so the same composition can be rendered to MP4 for social later.
 */
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const FPS = 30;
export const SCENE = 150; // 5 s per scene
export const CHAPTERS = [
  { code: "Leak", title: "Seller lead answered", time: "2:14 am" },
  { code: "Comp", title: "Deal underwritten", time: "2:21 am" },
  { code: "DD", title: "Diligence chased", time: "Tue 9:00" },
  { code: "LP", title: "Investors updated", time: "Fri 4:00" },
  { code: "Brain", title: "Your Monday brief", time: "Mon 7:00" },
];
export const DURATION = SCENE * CHAPTERS.length;
export const W = 1200;
export const H = 600;

const INK = "#0a0a0a";
const MUTED = "#6b6b6b";
const LINE = "#e6e6e6";
const MONO = "var(--font-mono), ui-monospace, monospace";
const DISPLAY = "var(--font-display), var(--font-body), sans-serif";
const BODY = "var(--font-body), system-ui, sans-serif";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const typed = (text: string, f: number, start: number, cps = 1.4) => text.slice(0, Math.max(0, Math.floor((f - start) * cps)));

function Cursor({ x, y, label, dark = false }: { x: number; y: number; label: string; dark?: boolean }) {
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x}px, ${y}px)`, display: "flex", alignItems: "flex-start", zIndex: 5 }}>
      <svg width="20" height="20" viewBox="0 0 18 18">
        <path d="M2 1.5v13.2l3.6-3.4 2.5 5 2.3-1.1-2.5-4.9 5-.4z" fill={dark ? "#fff" : INK} stroke={dark ? INK : "#fff"} strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span style={{ marginTop: 15, marginLeft: -2, font: `600 12px/1.45 ${BODY}`, background: dark ? "#fff" : INK, color: dark ? INK : "#fff", padding: "1px 8px", borderRadius: 999 }}>{label}</span>
    </div>
  );
}

/** Moves a cursor along waypoints [frame, x, y]. */
function path(f: number, pts: [number, number, number][]) {
  const fr = pts.map((p) => p[0]);
  const ease = { ...clamp, easing: Easing.bezier(0.4, 0, 0.2, 1) };
  return { x: interpolate(f, fr, pts.map((p) => p[1]), ease), y: interpolate(f, fr, pts.map((p) => p[2]), ease) };
}

function Panel({ children, f, w = 620, h = 400, title, sub }: { children: React.ReactNode; f: number; w?: number; h?: number; title: string; sub: string }) {
  const { fps } = useVideoConfig();
  const inS = spring({ frame: f, fps, config: { damping: 200 }, durationInFrames: 22 });
  const out = interpolate(f, [SCENE - 14, SCENE], [0, 1], clamp);
  return (
    <div style={{
      position: "absolute", left: 96, top: 104, width: w, height: h, borderRadius: 18, background: "rgba(255,255,255,0.92)",
      border: `1px solid ${LINE}`, boxShadow: "0 1px 2px rgba(0,0,0,0.05), 0 30px 70px -30px rgba(0,0,0,0.35)",
      opacity: inS * (1 - out), transform: `translateY(${(1 - inS) * 24 - out * 12}px) scale(${0.98 + inS * 0.02})`, overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `1px solid ${LINE}` }}>
        <span style={{ display: "flex", gap: 6 }}>{[0, 1, 2].map((i) => <i key={i} style={{ width: 9, height: 9, borderRadius: 5, background: "#dcdcdc", display: "block" }} />)}</span>
        <span style={{ font: `600 14px/1 ${BODY}`, color: INK, marginLeft: 6 }}>{title}</span>
        <span style={{ marginLeft: "auto", font: `400 12px/1 ${MONO}`, color: MUTED }}>{sub}</span>
      </div>
      <div style={{ padding: 22, position: "relative", height: h - 50 }}>{children}</div>
    </div>
  );
}

function Done({ f, at, text, x = 22, y }: { f: number; at: number; text: string; x?: number; y: number }) {
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 14, stiffness: 160 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${0.85 + s * 0.15})`, opacity: Math.min(1, s), transformOrigin: "left center",
      display: "inline-flex", alignItems: "center", gap: 8, background: INK, color: "#fff", borderRadius: 999, padding: "7px 14px 7px 10px", font: `500 13px/1 ${MONO}` }}>
      <span style={{ width: 16, height: 16, borderRadius: 8, background: "#fff", color: INK, display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700 }}>✓</span>{text}
    </div>
  );
}

function Bubble({ f, at, out, children }: { f: number; at: number; out?: boolean; children: React.ReactNode }) {
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 18, stiffness: 180 } });
  if (f < at) return null;
  return (
    <div style={{ alignSelf: out ? "flex-end" : "flex-start", maxWidth: "78%", padding: "11px 15px", borderRadius: 16,
      borderBottomRightRadius: out ? 4 : 16, borderBottomLeftRadius: out ? 16 : 4,
      background: out ? INK : "#f2f2f2", color: out ? "#fff" : INK, font: `400 15px/1.45 ${BODY}`,
      opacity: s, transform: `translateY(${(1 - s) * 10}px)` }}>{children}</div>
  );
}

function SceneLead({ f }: { f: number }) {
  const reply = "Yes, we're buying on Oak St. I can get you a fair offer this week. Does Tuesday at 10 work for a quick call?";
  const c = path(f, [[0, 900, 420], [30, 640, 300], [44, 640, 300], [92, 600, 330], [118, 470, 400]]);
  const dots = f > 26 && f < 40;
  return (
    <>
      <Panel f={f} title="Seller lead · Oak St duplex" sub="text · 2:14 am">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Bubble f={f} at={8}>Hi, thinking about selling my duplex on Oak St. Are you still buying?</Bubble>
          {dots && <div style={{ alignSelf: "flex-end", font: `500 18px/1 ${BODY}`, color: MUTED, letterSpacing: 3 }}>{".".repeat(1 + (Math.floor(f / 5) % 3))}</div>}
          {f >= 40 && <Bubble f={f} at={40} out>{typed(reply, f, 40, 2.2)}</Bubble>}
          <Bubble f={f} at={98}>Tuesday at 10 works.</Bubble>
        </div>
        <Done f={f} at={112} y={290} text="Call booked · Tue 10:00 · first reply in 0:41" />
      </Panel>
      <Cursor x={c.x} y={c.y} label="Leak" />
    </>
  );
}

function SceneUnderwrite({ f }: { f: number }) {
  const rows: [string, number, (n: number) => string][] = [
    ["Purchase price", 412000, (n) => `$${Math.round(n).toLocaleString("en-US")}`],
    ["Market rent", 3950, (n) => `$${Math.round(n).toLocaleString("en-US")}/mo`],
    ["Net operating income", 28400, (n) => `$${Math.round(n).toLocaleString("en-US")}`],
    ["Cap rate", 6.9, (n) => `${n.toFixed(1)}%`],
  ];
  const comps = [0.62, 0.78, 0.7, 0.92, 0.84, 0.74];
  const c = path(f, [[0, 470, 400], [24, 560, 190], [70, 560, 330], [100, 900, 420], [130, 1010, 330]]);
  return (
    <>
      <Panel f={f} title="First-pass model · Oak St" sub="comps · rents · model">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ display: "grid", gap: 14 }}>
            {rows.map(([l, v, fmt], i) => {
              const p = interpolate(f, [16 + i * 12, 46 + i * 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
              return (
                <div key={l} style={{ borderBottom: `1px solid ${LINE}`, paddingBottom: 10, opacity: Math.min(1, p * 3) }}>
                  <div style={{ font: `400 12px/1 ${MONO}`, color: MUTED, marginBottom: 8 }}>{l}</div>
                  <div style={{ font: `600 26px/1 ${DISPLAY}`, letterSpacing: "-0.02em", color: INK }}>{fmt(v * p)}</div>
                </div>
              );
            })}
          </div>
          <div>
            <div style={{ font: `400 12px/1 ${MONO}`, color: MUTED, marginBottom: 12 }}>6 sold comps within 1 mile</div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 200, borderBottom: `1px solid ${LINE}` }}>
              {comps.map((h, i) => {
                const p = interpolate(f, [30 + i * 6, 60 + i * 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
                return <div key={i} style={{ flex: 1, height: `${h * 100 * p}%`, borderRadius: "6px 6px 0 0", background: i === 3 ? INK : "#d9d9d9" }} />;
              })}
            </div>
          </div>
        </div>
        <Done f={f} at={96} y={290} text="Model ready in 6 minutes · waiting for your check" />
      </Panel>
      <Cursor x={c.x} y={c.y} label="Comp" />
    </>
  );
}

function SceneDiligence({ f }: { f: number }) {
  const items = ["Title search", "Inspection report", "Rent roll", "T-12 from seller", "Insurance quote"];
  const c = path(f, [[0, 1010, 330], [20, 180, 170], [40, 180, 214], [60, 180, 258], [80, 180, 302], [104, 180, 346], [130, 520, 420]]);
  return (
    <>
      <Panel f={f} title="Due diligence · Oak St" sub="document checklist">
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((t, i) => {
            const at = 24 + i * 20 + (i === 3 ? 14 : 0);
            const on = f >= at;
            const s = interpolate(f, [at, at + 8], [0, 1], clamp);
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: `1px solid ${on ? INK : LINE}`, borderRadius: 12, font: `500 15px/1.2 ${BODY}`, color: INK, background: "#fff" }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${INK}`, background: `rgba(10,10,10,${s})`, color: "#fff", display: "grid", placeItems: "center", fontSize: 12 }}>{on ? "✓" : ""}</span>
                {t}
                <span style={{ marginLeft: "auto", font: `400 12px/1 ${MONO}`, color: MUTED }}>{on ? "received" : i === 3 && f > 70 ? "chasing seller · day 2" : "requested"}</span>
              </div>
            );
          })}
        </div>
        <Done f={f} at={118} y={292} text="All 5 documents in · nothing flagged" />
      </Panel>
      <Cursor x={c.x} y={c.y} label="DD" />
    </>
  );
}

function SceneInvestors({ f }: { f: number }) {
  const { fps } = useVideoConfig();
  const head = "Occupancy held at 96% and we closed on Oak St.";
  const c = path(f, [[0, 520, 420], [40, 980, 260], [70, 560, 384], [84, 560, 384]]);
  const you = path(f, [[0, 1100, 560], [60, 1100, 560], [86, 190, 382], [100, 190, 382]]);
  const press = f >= 96 && f < 102;
  const sent = spring({ frame: f - 102, fps, config: { damping: 200 } });
  return (
    <>
      <Panel f={f} title="Q3 investor update · Fund II" sub="drafted from your books">
        <div style={{ font: `600 24px/1.25 ${DISPLAY}`, letterSpacing: "-0.02em", color: INK, minHeight: 64, maxWidth: 520 }}>{typed(head, f, 10, 1.6)}</div>
        <div style={{ display: "grid", gap: 9, marginTop: 16 }}>
          {[94, 100, 82, 90, 64].map((w, i) => (
            <i key={i} style={{ display: "block", height: 8, borderRadius: 4, background: "#ececec", width: `${w * interpolate(f, [30 + i * 6, 50 + i * 6], [0, 1], clamp)}%` }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 22, top: 262, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ background: INK, color: "#fff", borderRadius: 999, padding: "11px 20px", font: `500 14px/1 ${BODY}`, transform: `scale(${press ? 0.95 : 1})`, opacity: f >= 102 ? 0 : 1 }}>Approve and send</span>
          <span style={{ font: `400 12px/1 ${MONO}`, color: MUTED, opacity: f >= 102 ? 0 : 1 }}>waiting for your approval</span>
        </div>
        {f >= 102 && <div style={{ opacity: sent }}><Done f={f} at={102} y={262} text="Sent to 38 investors · approved by you" /></div>}
      </Panel>
      <Cursor x={c.x} y={c.y} label="LP" />
      <Cursor x={you.x} y={you.y} label="You" dark />
    </>
  );
}

function SceneBrain({ f }: { f: number }) {
  const { fps } = useVideoConfig();
  const items = [
    ["Acq", "Oak St seller call is Tuesday at 10. Model and diligence are ready."],
    ["Capital", "Fund II loan matures in 14 months. Refi packet is ready to review."],
    ["Ops", "Unit 4B promised to pay Friday. Approve the payment plan?"],
  ];
  const end = spring({ frame: f - 100, fps, config: { damping: 200 } });
  const out = interpolate(f, [SCENE - 14, SCENE], [0, 1], clamp);
  const inS = spring({ frame: f, fps, config: { damping: 200 }, durationInFrames: 22 });
  return (
    <div style={{ position: "absolute", left: 96, top: 104, width: 620, height: 400, borderRadius: 18, background: INK, color: "#fff", padding: 28,
      opacity: inS * (1 - out), transform: `translateY(${(1 - inS) * 24}px)`, boxShadow: "0 40px 80px -30px rgba(0,0,0,0.55)" }}>
      <div style={{ font: `400 12px/1 ${MONO}`, color: "rgba(255,255,255,0.6)" }}>The Brain · Monday 7:00 am · needs you this week</div>
      <div style={{ display: "grid", gap: 14, marginTop: 22 }}>
        {items.map(([k, t], i) => {
          const s = spring({ frame: f - 14 - i * 18, fps, config: { damping: 200 } });
          return (
            <div key={k} style={{ display: "flex", gap: 12, alignItems: "flex-start", opacity: s, transform: `translateX(${(1 - s) * 16}px)`, font: `400 16px/1.45 ${BODY}` }}>
              <span style={{ font: `500 11px/1 ${MONO}`, background: "#fff", color: INK, borderRadius: 4, padding: "4px 7px", marginTop: 3 }}>{k}</span>{t}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 28, bottom: 28, font: `600 30px/1.1 ${DISPLAY}`, letterSpacing: "-0.03em", opacity: end, transform: `translateY(${(1 - end) * 10}px)` }}>
        Everything else already happened.
      </div>
    </div>
  );
}

const SCENES = [SceneLead, SceneUnderwrite, SceneDiligence, SceneInvestors, SceneBrain];

/** A wireframe street that draws itself across the whole film; windows light as work gets done. */
function Skyline({ frame }: { frame: number }) {
  const blds = [
    [760, 300, 90, 230], [858, 240, 110, 290], [976, 330, 80, 200], [1064, 210, 100, 320], [1172, 280, 70, 250],
  ];
  const p = interpolate(frame, [0, DURATION * 0.6], [0, 1], clamp);
  const lit = Math.floor(interpolate(frame, [0, DURATION - 20], [0, 60], clamp));
  let n = 0;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <line x1="0" y1="530" x2={W} y2="530" stroke="#d6d6d6" />
      {blds.map(([x, y, w, h], i) => {
        const len = 2 * (w + h);
        const rows = Math.floor((h - 40) / 30), cols = Math.floor((w - 16) / 24);
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill="rgba(255,255,255,0.6)" stroke="#bdbdbd" strokeDasharray={len} strokeDashoffset={len * (1 - Math.min(1, p * 1.4 - i * 0.12))} />
            {Array.from({ length: rows * cols }).map((_, j) => {
              const r = Math.floor(j / cols), cc = j % cols;
              const on = (n++ * 7) % 60 < lit;
              return <rect key={j} x={x + 10 + cc * 24} y={y + 18 + r * 30} width={14} height={14} rx={2} fill={on ? INK : "#ededed"} opacity={p > 0.2 + i * 0.1 ? 1 : 0} />;
            })}
          </g>
        );
      })}
    </svg>
  );
}

export function HeroFilm() {
  const frame = useCurrentFrame();
  const idx = Math.min(CHAPTERS.length - 1, Math.floor(frame / SCENE));
  const f = frame - idx * SCENE;
  const Scene = SCENES[idx];
  const ch = CHAPTERS[idx];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffffff 0%, #f2f2f2 100%)", fontFamily: BODY, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(10,10,10,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px", maskImage: "radial-gradient(80% 80% at 50% 40%, #000 30%, transparent 100%)", WebkitMaskImage: "radial-gradient(80% 80% at 50% 40%, #000 30%, transparent 100%)" }} />
      <Skyline frame={frame} />
      <div style={{ position: "absolute", left: 96, top: 44, display: "flex", gap: 14, alignItems: "center", font: `400 13px/1 ${MONO}`, color: MUTED }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: INK }}><i style={{ width: 8, height: 8, borderRadius: 4, background: INK, display: "block", opacity: 0.4 + 0.6 * Math.abs(Math.sin(frame / 12)) }} />live run</span>
        <span>{String(idx + 1).padStart(2, "0")} / 05</span>
        <span style={{ color: INK }}>{ch.title}</span>
        <span>{ch.time}</span>
      </div>
      <div style={{ position: "absolute", right: 48, top: 44, font: `400 13px/1 ${MONO}`, color: MUTED }}>agent · {ch.code}</div>
      <Scene f={f} />
    </AbsoluteFill>
  );
}
