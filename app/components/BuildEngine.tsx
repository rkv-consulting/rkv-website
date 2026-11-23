"use client";
/*
 * Scroll-to-build engine.
 * Every block below the build line starts hidden. As the page scrolls, each block whose top passes the
 * build line is queued. Free agents (named cursors) fly to the block, drag a selection frame to its size
 * with a "W × H" label, then the block appears (text is typed in). Idle agents gather round the pointer.
 */
import { useEffect, useRef, useState } from "react";
import { DEPTS } from "../data";

const AGENTS = DEPTS.flatMap((d) => d.agents.map((a) => ({ name: a.code, color: d.color })));
const ARROW = '<svg viewBox="0 0 18 18" width="18" height="18"><path d="M2 1.5v13.2l3.6-3.4 2.5 5 2.3-1.1-2.5-4.9 5-.4z" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>';

const FRAME_SEL = [
  ".wrap > .sec-head", ".stage", ".status", ".ws", ".ws-top", ".ws-side", ".ws-main", ".panel", ".ws-agent",
  ".stats", ".stat", ".tools", ".card", ".viz", ".featured", ".timeline .ev", ".faq details", ".ship-box",
  ".dept-tabs", ".brief", ".mini-table tr", ".stage-chip", ".foot-cta", ".foot-main > div", ".online", ".hero-ctas",
  ".grid2", ".grid3", ".bento", ".person", ".draw-bars .r", ".tree li", ".ws-tabs", ".foot-bottom",
].join(",");
const LEAF_SEL = [
  "h1", "h2", "h3", "h5", "p", "blockquote", "a.btn", ".btn", "button", ".mono", ".num", ".pill", "svg.city",
  ".wordmark", ".sms .b", ".feed li", ".brief li", ".checks li", ".bar", ".avs", ".tools span", ".link-arrow",
  ".foot-main li", ".who", ".brain-who", ".foot", ".av", ".spark", ".logo",
].join(",");
const TEXT_SEL = "h1,h2,h3,h5,p,blockquote,.mono,.num,.tools span,.foot-main li,.link-arrow";

type Layer = { el: HTMLElement; top: number; parent: number; state: 0 | 1 | 2; text: boolean };
type Agent = {
  name: string; color: string; node: HTMLDivElement; chip: HTMLSpanElement;
  x: number; y: number; rot: number; k: number; task: number; phase: 0 | 1 | 2 | 3; t0: number; fx: number; fy: number;
  box?: { x: number; y: number; w: number; h: number }; rect?: HTMLDivElement; dur: number;
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function BuildEngine() {
  const [stat, setStat] = useState({ done: 0, total: 0, finished: false, secs: 0 });
  const [hidden, setHidden] = useState(false);
  const api = useRef<{ replay: () => void; skip: () => void; tour: () => void }>({ replay() {}, skip() {}, tour() {} });

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;

    // ---------- overlay ----------
    const overlay = document.createElement("div");
    overlay.className = "bl-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
    const line = document.createElement("div");
    line.className = "bl-line";
    line.innerHTML = "<span>BUILD LINE</span>";
    line.setAttribute("aria-hidden", "true");
    document.body.appendChild(line);
    const rulerTop = document.createElement("canvas");
    const rulerLeft = document.createElement("canvas");
    rulerTop.className = "bl-ruler bl-ruler-top";
    rulerLeft.className = "bl-ruler bl-ruler-left";
    rulerTop.setAttribute("aria-hidden", "true");
    rulerLeft.setAttribute("aria-hidden", "true");
    document.body.appendChild(rulerTop);
    document.body.appendChild(rulerLeft);
    root.classList.add("bl-on");

    // ---------- layers ----------
    let layers: Layer[] = [];
    const hasKidsRef = new Set<number>();
    const scan = (hideFrom: number) => {
      hasKidsRef.clear();
      const set = new Set<HTMLElement>();
      document.querySelectorAll<HTMLElement>("main, footer").forEach((scope) => {
        scope.querySelectorAll<HTMLElement>(`${FRAME_SEL},${LEAF_SEL}`).forEach((el) => {
          if (el.closest(".acur, .bl-overlay, .mobile-menu, .skip, .film-canvas, .demo-dlg")) return;
          set.add(el);
        });
      });
      const els = Array.from(set);
      els.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      const index = new Map<HTMLElement, number>();
      layers = [];
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return;
        let p: HTMLElement | null = el.parentElement, parent = -1;
        while (p) { const i = index.get(p); if (i !== undefined) { parent = i; break; } p = p.parentElement; }
        const top = r.top + window.scrollY;
        const built = top < hideFrom;
        index.set(el, layers.length);
        if (parent >= 0) hasKidsRef.add(parent);
        layers.push({ el, top, parent, state: built ? 2 : 0, text: el.matches(TEXT_SEL) && (el.textContent || "").trim().length > 0 });
        if (built) el.removeAttribute("data-bl"); else el.setAttribute("data-bl", "w");
      });
    };
    const retop = () => layers.forEach((l) => { if (l.el.isConnected) l.top = l.el.getBoundingClientRect().top + window.scrollY; });

    // ---------- agents ----------
    const agents: Agent[] = AGENTS.map((a, i) => {
      const node = document.createElement("div");
      node.className = "bl-agent";
      node.innerHTML = ARROW;
      (node.querySelector("path") as SVGPathElement).setAttribute("fill", a.color);
      const chip = document.createElement("span");
      chip.textContent = a.name;
      chip.style.background = a.color;
      node.appendChild(chip);
      overlay.appendChild(node);
      const x = window.innerWidth * (0.55 + 0.3 * Math.cos(i)), y = window.scrollY + window.innerHeight * (0.5 + 0.2 * Math.sin(i));
      return { ...a, node, chip, x, y, rot: 0, k: 13 + (i % 7) * 1.1, task: -1, phase: 0, t0: 0, fx: x, fy: y, dur: 0 };
    });

    let queue: number[] = [];
    const hasKids = hasKidsRef;
    let ghosts: { i: number; r: HTMLDivElement }[] = [];
    const complete = (i: number): boolean => {
      if (layers[i].state !== 2) return false;
      for (let j = i + 1; j < layers.length && j < i + 400; j++) { if (layers[j].parent === i && !complete(j)) return false; }
      return true;
    };
    const queued = new Set<number>();
    let doneCount = 0, total = 0, startT = performance.now(), finished = false;
    const lineY = () => window.innerHeight * 0.86;

    const enqueue = () => {
      const limit = window.scrollY + lineY();
      for (let i = 0; i < layers.length; i++) {
        const l = layers[i];
        if (l.state !== 0 || queued.has(i)) continue;
        if (l.top > limit) continue;
        queue.push(i); queued.add(i);
      }
    };
    const ready = (i: number) => { const p = layers[i].parent; return p < 0 || layers[p].state === 2; };
    const take = (): number => {
      for (let k = 0; k < queue.length; k++) {
        const i = queue[k];
        if (!layers[i].el.isConnected) { queue.splice(k, 1); finish(i, false); k--; continue; }
        if (ready(i)) { queue.splice(k, 1); return i; }
      }
      return -1;
    };
    const reveal = (l: Layer, fast: boolean) => {
      l.el.removeAttribute("data-bl");
      if (fast) return;
      if (l.text) {
        const n = Math.max(4, Math.min(28, Math.round((l.el.textContent || "").length / 2)));
        l.el.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], { duration: Math.min(900, 120 + n * 26), easing: `steps(${n}, end)` });
      } else {
        l.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380, easing: "ease-out" });
      }
    };
    function finish(i: number, animate: boolean) {
      const l = layers[i];
      if (l.state === 2) return;
      l.state = 2;
      doneCount++;
      reveal(l, !animate);
    }

    // ---------- pointer ----------
    let px = -1, py = -1, lastMove = 0;
    const onMove = (e: PointerEvent) => { if (e.pointerType !== "mouse" && e.pointerType !== "pen") return; px = e.clientX; py = e.clientY; lastMove = performance.now(); };
    const onLeave = (e: PointerEvent) => { if (!e.relatedTarget) px = -1; };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onLeave, { passive: true });

    // ---------- rulers ----------
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const css = getComputedStyle(root);
    const bg = css.getPropertyValue("--ruler-bg").trim() || "#fafafa";
    const tickC = css.getPropertyValue("--ruler-tick").trim() || "#cfcfcf";
    const txt = css.getPropertyValue("--ruler-text").trim() || "#7a7a7a";
    const sel = "rgba(10,10,10,0.09)";
    let rulerSig = "", rw = 0, rh = 0;
    const drawRulers = () => {
      if (window.innerWidth < 820) return;
      const W = window.innerWidth, H = window.innerHeight;
      const spans: { x0: number; x1: number; y0: number; y1: number }[] = [];
      agents.forEach((a) => { if (a.box && a.phase >= 2) spans.push({ x0: a.box.x, x1: a.box.x + a.box.w, y0: a.box.y, y1: a.box.y + a.box.h }); });
      const sig = `${W},${H},${Math.round(window.scrollY)},${spans.map((q) => `${q.x0|0}:${q.y0|0}`).join(";")}`;
      if (sig === rulerSig) return;
      rulerSig = sig;
      if (rw !== W || rh !== H) { rw = W; rh = H; rulerTop.width = W * dpr; rulerTop.height = 18 * dpr; rulerLeft.width = 18 * dpr; rulerLeft.height = H * dpr; }
      // top
      let c = rulerTop.getContext("2d")!; c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.fillStyle = bg; c.fillRect(0, 0, W, 18);
      c.fillStyle = sel; spans.forEach((s) => c.fillRect(s.x0, 0, s.x1 - s.x0, 18));
      c.fillStyle = tickC; c.font = "9px ui-monospace, monospace";
      for (let x = 0; x < W; x += 10) { const h = x % 100 === 0 ? 18 : x % 50 === 0 ? 8 : 4; c.fillRect(x, 18 - h, 1, h); }
      c.fillStyle = txt; for (let x = 100; x < W; x += 100) c.fillText(String(x), x + 3, 9);
      c.fillStyle = tickC; c.fillRect(0, 17, W, 1);
      // left
      c = rulerLeft.getContext("2d")!; c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.fillStyle = bg; c.fillRect(0, 0, 18, H);
      const sy = window.scrollY;
      c.fillStyle = sel; spans.forEach((s) => c.fillRect(0, s.y0 - sy, 18, s.y1 - s.y0));
      c.fillStyle = tickC;
      for (let y = Math.floor(sy / 10) * 10; y < sy + H; y += 10) { const w = y % 100 === 0 ? 18 : y % 50 === 0 ? 8 : 4; c.fillRect(18 - w, y - sy, w, 1); }
      c.fillStyle = txt;
      for (let y = Math.ceil(sy / 100) * 100; y < sy + H; y += 100) { c.save(); c.translate(9, y - sy + 4); c.rotate(-Math.PI / 2); c.fillText(String(y), -String(y).length * 5.4 - 2, 0); c.restore(); }
      c.fillStyle = tickC; c.fillRect(17, 0, 1, H);
    };

    // ---------- main loop ----------
    let raf = 0, frame = 0, lastT = performance.now();
    // smoothed pointer anchor for the ring, and how fast the pointer is moving
    let ax = -1, ay = -1, pv = 0, lpx = -1, lpy = -1;
    const angDiff = (a: number, b: number) => { let d = (b - a) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return d; };
    const makeRect = (a: Agent) => {
      const r = document.createElement("div");
      r.className = "bl-rect";
      r.innerHTML = '<i></i><i></i><i></i><i></i><b></b>';
      overlay.appendChild(r);
      a.rect = r;
    };
    const tick = (t: number) => {
      frame++;
      const dt = Math.min(0.05, Math.max(0.001, (t - lastT) / 1000));
      lastT = t;
      const hasPtr = px >= 0 && fine;
      root.classList.toggle("bl-top", window.scrollY < 140);
      if (hasPtr) {
        if (ax < 0) { ax = px; ay = py; }
        const sm = 1 - Math.exp(-dt * 30);
        ax += (px - ax) * sm; ay += (py - ay) * sm;
        if (lpx >= 0) pv += (Math.hypot(px - lpx, py - lpy) / dt - pv) * (1 - Math.exp(-dt * 8));
        lpx = px; lpy = py;
      } else { ax = -1; lpx = -1; pv = 0; }
      enqueue();
      const backlog = queue.length;
      const speed = backlog > agents.length * 4 ? 0.4 : backlog > agents.length * 2 ? 0.65 : 0.9;
      void lastMove;
      let ringIdx = 0;
      const ringN = agents.filter((a) => a.task < 0).length;

      for (const a of agents) {
        if (a.task < 0) {
          const i = take();
          if (i >= 0) {
            const el = layers[i].el, r = el.getBoundingClientRect();
            a.task = i; a.phase = 1; a.t0 = t; a.fx = a.x; a.fy = a.y;
            a.box = { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
            const dist = Math.hypot(a.box.x - a.x, a.box.y - a.y);
            a.dur = Math.min(480, Math.max(160, dist * 0.6)) * speed;
            layers[i].state = 1;
          }
        }
        if (a.task >= 0 && a.box) {
          const p = (t - a.t0) / a.dur;
          if (a.phase === 1) { // fly to top-left
            const k = ease(Math.min(1, p));
            a.x = a.fx + (a.box.x - a.fx) * k; a.y = a.fy + (a.box.y - a.fy) * k;
            if (p >= 1) { a.phase = 2; a.t0 = t; a.dur = Math.min(440, 200 + Math.sqrt(a.box.w * a.box.h) * 0.45) * speed; makeRect(a); if (!layers[a.task].text) finish(a.task, true); }
          } else if (a.phase === 2) { // drag the frame
            const k = easeOut(Math.min(1, p));
            const w = a.box.w * k, h = a.box.h * k;
            a.x = a.box.x + w; a.y = a.box.y + h;
            const r = a.rect!;
            r.style.transform = `translate(${a.box.x}px, ${a.box.y}px)`;
            r.style.width = `${w}px`; r.style.height = `${h}px`;
            (r.querySelector("b") as HTMLElement).textContent = `${Math.round(w)} × ${Math.round(h)}`;
            if (p >= 1) { a.phase = 3; a.t0 = t; a.dur = 120 * speed; finish(a.task, true); }
          } else if (a.phase === 3) { // let go
            if (p >= 1) {
              const r = a.rect!;
              if (hasKids.has(a.task) && !complete(a.task)) { r.classList.add("ghost"); ghosts.push({ i: a.task, r }); }
              else { r.classList.add("out"); window.setTimeout(() => r.remove(), 450); }
              a.rect = undefined; a.box = undefined; a.task = -1; a.phase = 0;
            }
          }
          a.chip.style.opacity = "1";
          a.node.style.opacity = "1";
        } else {
          // idle: a clean ring that tracks the pointer; without a pointer, park beside the build line
          const ang = (ringIdx / Math.max(ringN, 1)) * Math.PI * 2 + t * 0.00035;
          ringIdx++;
          let tx: number, ty: number;
          if (hasPtr) {
            const rad = 40 + Math.min(ringN, 21) * 1.1 + Math.min(26, pv * 0.02);
            tx = ax + Math.cos(ang) * rad; ty = ay + window.scrollY + Math.sin(ang) * rad;
          } else {
            tx = window.innerWidth * (window.innerWidth < 820 ? 0.5 : 0.78) + Math.cos(ang) * 64;
            ty = window.scrollY + lineY() - 110 + Math.sin(ang) * 64;
          }
          const sm = 1 - Math.exp(-dt * (hasPtr ? a.k : 4));
          a.x += (tx - a.x) * sm; a.y += (ty - a.y) * sm;
          a.chip.style.opacity = "0";
          // on touch screens idle agents step aside so they never sit on top of the text
          a.node.style.opacity = fine ? "1" : "0";
          // arrow tip points at the pointer (the arrow artwork points up-left, i.e. -135deg)
          const cx = hasPtr ? ax : window.innerWidth * (window.innerWidth < 820 ? 0.5 : 0.78);
          const cy = hasPtr ? ay + window.scrollY : window.scrollY + lineY() - 110;
          const want = (Math.atan2(cy - a.y, cx - a.x) * 180) / Math.PI + 135;
          a.rot += angDiff(a.rot, want) * (1 - Math.exp(-dt * 12));
          a.node.style.setProperty("--rot", `${a.rot.toFixed(1)}deg`);
        }
        a.node.classList.toggle("ring", a.task < 0);
        a.node.style.transform = `translate3d(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px, 0)`;
      }

      if (frame % 10 === 0 && ghosts.length) {
        ghosts = ghosts.filter((g) => { if (complete(g.i)) { g.r.classList.add("out"); window.setTimeout(() => g.r.remove(), 450); return false; } return true; });
      }
      total = layers.length;
      if (!finished && total > 0 && doneCount >= total) {
        finished = true;
        line.classList.add("done");
        setStat({ done: total, total, finished: true, secs: (performance.now() - startT) / 1000 });
      } else if (!finished && frame % 8 === 0) {
        setStat({ done: doneCount, total, finished: false, secs: 0 });
      }
      drawRulers();
      raf = requestAnimationFrame(tick);
    };

    // first paint: build what is on the first screen above the fold at once, the rest goes to the crew
    scan(window.scrollY + window.innerHeight * 0.62);
    doneCount = layers.filter((l) => l.state === 2).length;
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => retop());
    ro.observe(document.body);

    const skip = () => {
      layers.forEach((l, i) => { if (l.state !== 2) finish(i, false); });
      queue = []; queued.clear();
      agents.forEach((a) => { a.rect?.remove(); a.rect = undefined; a.box = undefined; a.task = -1; a.phase = 0; });
      ghosts.forEach((g) => g.r.remove()); ghosts = [];
    };
    const replay = () => {
      overlay.querySelectorAll(".bl-rect").forEach((r) => r.remove()); ghosts = [];
      agents.forEach((a) => { a.rect = undefined; a.box = undefined; a.task = -1; a.phase = 0; });
      queue = []; queued.clear(); finished = false; line.classList.remove("done");
      window.scrollTo({ top: 0, behavior: "auto" });
      requestAnimationFrame(() => {
        scan(-1);
        // keep the nav-level hero heading readable while the crew rebuilds it
        doneCount = 0; startT = performance.now();
        setStat({ done: 0, total: layers.length, finished: false, secs: 0 });
      });
    };
    let touring = false;
    const tour = () => {
      if (touring) { touring = false; return; }
      touring = true;
      const step = () => {
        if (!touring) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= max - 2) { touring = false; return; }
        window.scrollBy(0, 2.4);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const stopTour = () => { touring = false; };
    window.addEventListener("wheel", stopTour, { passive: true });
    window.addEventListener("touchstart", stopTour, { passive: true });
    api.current = { replay, skip, tour };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") skip(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("rkv:replay", replay);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("rkv:replay", replay);
      window.removeEventListener("wheel", stopTour);
      window.removeEventListener("touchstart", stopTour);
      layers.forEach((l) => l.el.removeAttribute("data-bl"));
      overlay.remove(); line.remove(); rulerTop.remove(); rulerLeft.remove();
      root.classList.remove("bl-on", "bl-top");
    };
  }, []);

  if (hidden) return null;
  const pct = stat.total ? (stat.done / stat.total) * 100 : 0;
  return (
    <div className="buildline" role="status" aria-live="off">
      <span className="avs-l" aria-hidden="true">
        {DEPTS.slice(0, 5).map((d) => ({ name: d.name, color: d.color })).map((a) => <i key={a.name} style={{ background: a.color }}>{a.name[0]}</i>)}
      </span>
      <span className="hide-xs">21 agents</span>
      {stat.finished ? (
        <span>Built <b>{stat.total}</b> layers in {stat.secs.toFixed(1)}s</span>
      ) : (
        <>
          <span><b>{stat.done}</b> / {stat.total} layers</span>
          <span className="prog hide-xs"><span style={{ width: `${pct}%` }} /></span>
        </>
      )}
      {stat.finished ? (
        <button type="button" onClick={() => api.current.replay()}>Replay</button>
      ) : (
        <button type="button" onClick={() => api.current.tour()}>Tour</button>
      )}
      <button type="button" className="x" aria-label="Hide the build bar" onClick={() => { api.current.skip(); setHidden(true); }}>×</button>
    </div>
  );
}
