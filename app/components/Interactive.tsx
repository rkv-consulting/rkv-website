"use client";
import { useEffect, useRef, useState } from "react";
import { DEPTS, ALL_AGENTS } from "../data";
import { CursorIcon, Logo } from "./Logo";
import { BF } from "./Build";

export function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    ["How it works", "#process"],
    ["Agents", "#agents"],
    ["What you get", "#output"],
    ["FAQ", "#faq"],
    ["Contact", "#contact"],
  ];
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Logo />
        <nav className="nav-links" aria-label="Main">
          {links.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
        </nav>
        <a className="btn btn-primary btn-sm" href="#contact">Book a call</a>
        <button className="menu-btn" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label="Menu" onClick={() => setOpen(!open)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${open ? "open" : ""}`}>
        {links.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
        <a className="btn btn-primary" href="#contact" onClick={() => setOpen(false)}>Book a call</a>
      </div>
    </header>
  );
}

function CountUp({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setV(to); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        setV(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <div ref={ref} className="num display">{v.toFixed(decimals)}{suffix}</div>;
}

export function Stats() {
  const items = [
    { to: 21, s: "", l: "agents across your portfolio" },
    { to: 6, s: "", l: "departments, from leads to lenders" },
    { to: 24, s: "/7", l: "resident desk, nights and weekends" },
    { to: 1, s: "", l: "brief a week from The Brain, on Monday" },
  ];
  return (
    <div className="stats">
      {items.map((it) => (
        <BF key={it.l} className="stat" size="281 × 137">
          <CountUp to={it.to} suffix={it.s} />
          <p>{it.l}</p>
        </BF>
      ))}
    </div>
  );
}

function Spark({ color }: { color: string }) {
  const hs = [5, 8, 6, 11, 9, 14, 12];
  return (
    <span className="spark" aria-hidden="true">
      {hs.map((h, i) => <i key={i} style={{ height: h, background: color, animationDelay: `${i * 0.12}s` }} />)}
    </span>
  );
}

export function Crew() {
  const [dept, setDept] = useState<string>("acquisitions");
  const list = ALL_AGENTS.filter((a) => a.code !== "Brain" && (dept === "all" || DEPTS.find((d) => d.id === dept)?.name === a.dept));
  const brain = DEPTS.find((d) => d.id === "brain")!;
  return (
    <>
      <div className="dept-tabs" role="group" aria-label="Filter agents by department">
        <button type="button" aria-pressed={dept === "all"} onClick={() => setDept("all")}>All agents <span className="c">20</span></button>
        {DEPTS.filter((d) => d.id !== "brain").map((d) => (
          <button key={d.id} type="button" aria-pressed={dept === d.id} onClick={() => setDept(d.id)}>
            <span className="sw" style={{ background: d.color }} />{d.name} <span className="c">{d.agents.length}</span>
          </button>
        ))}
      </div>
      <div className="grid3" key={dept}>
        {(() => {
          const d = DEPTS.find((x) => x.id === dept);
          const span = d && d.agents.length === 3 ? "1 / -1" : undefined;
          return (
            <article className="card dept-card" style={{ gridColumn: span, ["--dc" as string]: d ? d.color : "#0B1215" }}>
              <span className="mono">{d ? `${d.agents.length} agents` : "21 agents · 6 departments"}</span>
              <h3>{d ? d.name : "The whole crew"}</h3>
              <p>{d ? d.blurb : "Every agent shares one picture of your portfolio, and The Brain reads them all."}</p>
              <a className="link-arrow" href="#contact">Start with {d ? d.name.toLowerCase() : "one department"} <span>→</span></a>
            </article>
          );
        })()}
        {list.map((a, i) => (
          <article className="card agent-card" key={a.code} style={{ animationDelay: `${Math.min(i, 8) * 0.04}s` }}>
            <div className="who">
              <CursorIcon color={a.color} size={16} />
              <span style={{ background: a.color }}>{a.code}</span>
              <span className="mono dept">{a.dept}</span>
            </div>
            <h3>{a.name}</h3>
            <p>{a.job}</p>
            <div className="foot">
              <span className="mono">works in</span>
              <span className="met"><Spark color={a.color} />{a.metric}</span>
            </div>
          </article>
        ))}
        <BF className="card brain-card" size="The Brain · 1200 × auto">
          <div>
            <div className="brain-who"><CursorIcon color="#14A385" size={16} /><span>Brain</span><span className="mono">1 agent over all 20</span></div>
            <h3>The Brain</h3>
            <p>{brain.agents[0].job} It reads every department and puts what needs you on one page.</p>
          </div>
          <BrainBrief />
        </BF>
      </div>
    </>
  );
}

function BrainBrief() {
  const items = [
    { k: "Capital", c: "#C2336A", t: "Fund II loan matures in 14 months. Refi packet is ready for your review." },
    { k: "Ops", c: "#0B7D57", t: "Unit 4B is 9 days late with a promise to pay Friday. Approve the payment plan?" },
    { k: "Acq", c: "#2557E8", t: "Two seller leads want a call this week. Calls are pencilled in for Tue and Thu." },
  ];
  const [n, setN] = useState(1);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(3); return; }
    const id = window.setInterval(() => setN((x) => (x >= 3 ? 1 : x + 1)), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="brief">
      <span className="mono">Monday brief · 7:00 am · needs you this week</span>
      <ol>
        {items.slice(0, n).map((it) => (
          <li key={it.k}><span className="k" style={{ background: it.c }}>{it.k}</span><span>{it.t}</span></li>
        ))}
      </ol>
    </div>
  );
}

export function DrawBars() {
  const rows = [
    { l: "Demo", v: 100, c: "#0B7D57" },
    { l: "Framing", v: 82, c: "#0E7490" },
    { l: "Electrical", v: 46, c: "#2557E8" },
    { l: "Finishes", v: 12, c: "#B45309" },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div className="draw-bars" ref={ref}>
      {rows.map((r) => (
        <div className="r" key={r.l}>
          <span>{r.l}</span>
          <span className="t"><span style={{ width: on ? `${r.v}%` : "0%", background: r.c }} /></span>
          <span>{r.v}%</span>
        </div>
      ))}
    </div>
  );
}

export function SmsThread() {
  const msgs = [
    { o: false, t: "Hi, rent will be late this month, sorry. Can I pay on the 12th?" },
    { o: true, t: "Thanks for telling us. I've noted a promise to pay $1,450 on the 12th. I'll send a reminder that morning." },
    { o: false, t: "Perfect, thank you." },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let i = 0;
      const id = window.setInterval(() => { i++; setN(i); if (i >= msgs.length) clearInterval(id); }, 900);
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [msgs.length]);
  return (
    <div className="sms" ref={ref}>
      {msgs.slice(0, n).map((m, i) => <div key={i} className={`b ${m.o ? "out" : "in"}`}>{m.t}</div>)}
    </div>
  );
}
