"use client";
import { useEffect, useState } from "react";
import { DEPTS } from "../data";
import { BF } from "./Build";

const LOG: Record<string, { a: string; t: string }[]> = {
  acquisitions: [
    { a: "Leak", t: "replied to seller lead · 0:47" },
    { a: "Radar", t: "flagged probate filing · Pine Ave" },
    { a: "Comp", t: "built first-pass model · 24 units" },
    { a: "Broker", t: "requested T-12 from listing agent" },
    { a: "DD", t: "chased missing rent roll · day 2" },
  ],
  operations: [
    { a: "Desk", t: "answered resident at 2:14 am" },
    { a: "Wrench", t: "dispatched plumber · Unit 3C" },
    { a: "Rent", t: "logged promise to pay · Unit 4B" },
    { a: "Turn", t: "booked cleaners · Unit 1A" },
    { a: "Tax", t: "found $18k assessment gap" },
  ],
  "back-office": [
    { a: "Ledger", t: "coded 37 bills · Maple Court" },
    { a: "Report", t: "drafted October asset report" },
    { a: "Audit", t: "flagged duplicate PM invoice" },
    { a: "Lease", t: "renewal notice due in 60 days" },
    { a: "Cover", t: "premium up 14% · shopping quotes" },
  ],
  capital: [
    { a: "LP", t: "drafted Q3 update · Fund II" },
    { a: "Packet", t: "assembled lender package" },
    { a: "Refi", t: "maturity in 14 months · started" },
  ],
  lending: [
    { a: "Loan", t: "collected 6 of 7 documents" },
    { a: "Draw", t: "checked draw #3 against budget" },
  ],
  brain: [{ a: "Brain", t: "3 items need you this week" }],
};

export function Workspace() {
  const [dept, setDept] = useState(DEPTS[0].id);
  const [feed, setFeed] = useState<{ a: string; t: string; c: string; k: number }[]>([]);
  const d = DEPTS.find((x) => x.id === dept)!;

  useEffect(() => {
    const list = LOG[dept];
    let i = 0;
    setFeed(list.slice(0, 3).map((x, j) => ({ ...x, c: d.color, k: j })).reverse());
    i = 3;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      const x = list[i % list.length];
      i++;
      setFeed((f) => [{ ...x, c: d.color, k: i }, ...f].slice(0, 5));
    }, 2200);
    return () => clearInterval(id);
  }, [dept, d.color]);

  return (
    <div className="wrap">
      <BF size="Control room · 1200 × 520" className="ws-bf">
        <div className="ws">
          <div className="ws-top">
            <div className="ws-dots" aria-hidden="true"><i /><i /><i /></div>
            <div className="ws-tabs" role="group" aria-label="Departments">
              {DEPTS.slice(0, 3).map((x) => (
                <button key={x.id} type="button" aria-pressed={dept === x.id} onClick={() => setDept(x.id)}>{x.name}</button>
              ))}
            </div>
            <a className="btn btn-primary btn-sm" href="#contact">Approve</a>
          </div>
          <div className="ws-body">
            <aside className="ws-side">
              <span className="mono">DEPARTMENTS</span>
              <ul className="tree">
                {DEPTS.map((x) => (
                  <li key={x.id}>
                    <button type="button" aria-current={dept === x.id} onClick={() => setDept(x.id)}>
                      <span className="sw" style={{ background: x.color }} />
                      {x.name}
                      <span className="n">{x.agents.length}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
            <div className="ws-main">
              <div className="panel">
                <h4>Live activity</h4>
                <p className="mono" style={{ margin: "0 0 14px" }}>{d.name.toLowerCase()} · today</p>
                <ul className="feed" aria-live="off">
                  {feed.map((f) => (
                    <li key={f.k}>
                      <span style={{ color: f.c }}>●</span>
                      <span><b>{f.a}</b> {f.t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="panel">
                <h4>{d.name}</h4>
                <p className="mono" style={{ margin: "0 0 14px" }}>{d.agents.length} agents online</p>
                <div className="ws-agents">
                  {d.agents.map((a) => (
                    <div className="ws-agent" key={a.code}>
                      <span className="sw" style={{ width: 9, height: 9, borderRadius: 3, background: d.color }} />
                      {a.name}
                      <span className="st"><span className="dot" />working</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BF>
    </div>
  );
}
