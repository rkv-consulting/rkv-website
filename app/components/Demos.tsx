"use client";
import { useEffect, useRef, useState } from "react";
import { BF } from "./Build";

const VIDS = [
  { id: "LeadLeakFix", t: "Lead Leak Fix answers a seller at 2 am", d: "Acquisitions · 0:50" },
  { id: "ResidentDesk", t: "The resident desk handles a 9 pm leak", d: "Operations · 0:52" },
  { id: "TheBrain", t: "The Brain writes your Monday brief", d: "The Brain · 0:49" },
];
const src = (id: string, kind: "final" | "loop6s") => `videos/RKV_${id}_${kind}.mp4`;
const poster = (id: string) => `videos/RKV_${id}_poster.jpg`;

function Loop({ id }: { id: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // play the silent loop only while the card is on screen
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.3 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} className="demo-loop" src={src(id, "loop6s")} poster={poster(id)} muted loop playsInline preload="metadata" aria-hidden="true" />;
}

export function Demos() {
  const [open, setOpen] = useState<number | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);
  const cur = open !== null ? VIDS[open] : null;
  return (
    <section className="sec" id="demos" aria-labelledby="demos-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="mono tag">/demos · narrated walkthroughs</span>
          <h2 id="demos-title" className="h2 display">Watch the agents do the work</h2>
          <p className="lede">Under a minute each, with voiceover. Click a demo to watch it with sound.</p>
        </div>
        <div className="grid3">
          {VIDS.map((v, i) => (
            <BF as="article" className="card demo" key={v.id} size="389 × 320">
              <button type="button" className="demo-frame" onClick={() => setOpen(i)} aria-label={`Play demo: ${v.t}`}>
                <Loop id={v.id} />
                <span className="demo-play" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 14 14"><path d="M4 2.5v9l7.5-4.5z" fill="currentColor" /></svg></span>
                <span className="mono demo-len">{v.d.split(" · ")[1]}</span>
              </button>
              <h3>{v.t}</h3>
              <p className="mono">{v.d}</p>
            </BF>
          ))}
        </div>
      </div>
      <dialog ref={dlg} className="demo-dlg" onClose={() => setOpen(null)} onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }} aria-label={cur ? cur.t : "Demo video"}>
        {cur && (
          <div className="demo-dlg-in">
            <div className="demo-dlg-top">
              <span>{cur.t}</span>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close video">×</button>
            </div>
            <video key={cur.id} src={src(cur.id, "final")} poster={poster(cur.id)} controls autoPlay playsInline />
          </div>
        )}
      </dialog>
    </section>
  );
}
