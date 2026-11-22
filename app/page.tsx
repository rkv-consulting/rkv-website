import { BF, BuildController, NamedCursor } from "./components/Build";
import { Hero } from "./components/Hero";
import { Workspace } from "./components/Workspace";
import { Nav, Stats, Crew, DrawBars, SmsThread } from "./components/Interactive";
import { LogoMark } from "./components/Logo";
import { DEPTS, FAQ, CONTACT } from "./data";

const TOOLS = ["AppFolio", "Buildium", "Yardi", "Rent Manager", "QuickBooks", "Gmail", "Outlook", "Google Drive", "Twilio", "Podio"];

function Process() {
  return (
    <section className="sec" id="process" aria-labelledby="process-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="mono tag">/process · 4 phases</span>
          <h2 id="process-title" className="h2 display">How an RKV engagement runs, in four steps</h2>
          <p className="lede">We find where hours and dollars leak, build the agents that plug those leaks, and stay on to tune them while they work.</p>
        </div>
        <div className="grid2">
          <BF as="article" className="card" size="588 × 380">
            <div className="card-top"><span className="mono">01</span><span className="mono">/audit</span></div>
            <div className="viz">
              <div style={{ padding: 16, display: "grid", gap: 8 }}>
                {["Seller leads · no reply after hours", "Late rent · tracked in a spreadsheet", "Bills · coded by hand every week"].map((t, i) => (
                  <div key={t} className="mono" style={{ background: "#fff", border: `1px solid ${i === 0 ? "#2557E8" : "var(--line)"}`, borderRadius: 8, padding: "8px 10px", color: "var(--ink-2)" }}>{t}</div>
                ))}
                <span className="mono" style={{ color: "#2557E8" }}>scanning · 3 leaks found</span>
              </div>
              <NamedCursor name="Radar" color="#2557E8" style={{ right: 40, top: 22 }} />
            </div>
            <h3>Find the leaks</h3>
            <p>We walk through your deals, properties and back office and list every task that eats time or loses money.</p>
          </BF>
          <BF as="article" className="card" size="588 × 380">
            <div className="card-top"><span className="mono">02</span><span className="mono">/design</span></div>
            <div className="viz">
              <svg viewBox="0 0 400 170" width="100%" height="100%" aria-hidden="true">
                <g fill="none" stroke="#cfd6d3" strokeWidth="1.2">
                  {[60, 140, 220, 300, 360].map((x, i) => <path key={i} className="pulse-line" d={`M200 46 C200 90 ${x} 80 ${x} 120`} />)}
                </g>
                <rect x="150" y="20" width="100" height="28" rx="7" fill="#0B1215" />
                <text x="200" y="38" textAnchor="middle" fontSize="11" fill="#fff" fontFamily="monospace">The Brain</text>
                {DEPTS.slice(0, 5).map((d, i) => {
                  const x = [60, 140, 220, 300, 360][i];
                  return (
                    <g key={d.id}>
                      <rect x={x - 30} y="120" width="60" height="24" rx="6" fill="#fff" stroke={d.color} />
                      <text x={x} y="136" textAnchor="middle" fontSize="9" fill="#2b3338" fontFamily="monospace">{d.name.split(" ")[0]}</text>
                    </g>
                  );
                })}
                {[60, 140, 220, 300, 360].map((x, i) => (
                  <circle key={i} r="3" fill={DEPTS[i].color}>
                    <animateMotion dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" path={`M200 46 C200 90 ${x} 80 ${x} 120`} />
                  </circle>
                ))}
              </svg>
            </div>
            <h3>Design the crew</h3>
            <p>We pick the agents you need, write their rules with you and decide what always waits for your approval.</p>
          </BF>
          <BF as="article" className="card" size="588 × 380">
            <div className="card-top"><span className="mono">03</span><span className="mono">/connect</span></div>
            <div className="viz" style={{ padding: 18 }}>
              <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.4 }}>
                <span className="typer">If rent is 5 days late and no promise to pay is logged, text the resident and tell me on day 10.</span>
              </div>
              <div className="mono" style={{ marginTop: 14 }}>rule · rent follow-up · saved</div>
            </div>
            <h3>Connect your systems</h3>
            <p>Agents plug into your property software, inbox, phone line and books. Nobody on your team learns a new tool.</p>
          </BF>
          <BF as="article" className="card" size="588 × 380">
            <div className="card-top"><span className="mono">04</span><span className="mono">/run</span></div>
            <div className="viz" style={{ display: "grid", placeItems: "center" }}>
              <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
                <span className="btn btn-primary btn-sm" aria-hidden="true">✓ Approved</span>
                <span className="mono" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><span className="dot" />live · 21 agents working</span>
              </div>
              <NamedCursor name="Brain" color="#14A385" style={{ left: "62%", top: "58%" }} />
            </div>
            <h3>Run, review, improve</h3>
            <p>The crew works around the clock. You approve the big calls, we read the logs every week and tune the agents.</p>
          </BF>
        </div>
      </div>
      <style>{`
        .pulse-line { stroke-dasharray: 4 4; animation: dash 1.2s linear infinite; }
        @keyframes dash { to { stroke-dashoffset: -16; } }
        .typer { background: linear-gradient(90deg, var(--ink) 50%, #c8ced3 50%); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: type 6s steps(60) infinite; }
        @keyframes type { 0% { background-position: 100% 0; } 70%, 100% { background-position: 0 0; } }
      `}</style>
    </section>
  );
}

function Output() {
  return (
    <section className="sec" id="output" aria-labelledby="output-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="mono tag">/output · real work</span>
          <h2 id="output-title" className="h2 display">Agents that finish real work in your systems</h2>
          <p className="lede">Each agent works in your own software, logs every step and hands you the decisions that are yours.</p>
        </div>
        <div className="bento">
          <BF as="article" className="card wide" size="1200 × 360">
            <div className="viz" style={{ height: "auto", background: "#fff" }}>
              <table className="mini-table">
                <thead><tr><th>lead</th><th>source</th><th>first reply</th><th>status</th></tr></thead>
                <tbody>
                  {[
                    ["Birch Ln", "Direct mail", "0:41", "Call booked", "#0B7D57"],
                    ["Hill Rd", "PPC", "0:52", "Following up · day 3", "#2557E8"],
                    ["Lake St", "Cold call", "0:38", "Offer sent", "#C2336A"],
                    ["Cedar Ct", "Website", "0:47", "Nurture · 30 days", "#B45309"],
                  ].map((r) => (
                    <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td><span className="pill" style={{ background: `${r[4]}18`, color: r[4] }}>{r[3]}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3>Lead Leak Fix, in your CRM</h3>
            <p>Every seller lead gets a reply in under a minute and follow-up for as long as it takes. No lead sits in a voicemail box again.</p>
          </BF>
          <BF as="article" className="card" size="588 × 380">
            <div className="viz" style={{ height: 210 }}><SmsThread /></div>
            <h3>Residents answered, rent followed up</h3>
            <p>The resident desk replies at any hour and logs promises to pay on your rules.</p>
          </BF>
          <BF as="article" className="card" size="588 × 380">
            <div className="viz" style={{ height: 210 }}><DrawBars /></div>
            <h3>Draws checked against budget</h3>
            <p>Each rehab draw is matched to the budget line and photos before money moves.</p>
          </BF>
          <BF as="article" className="card" size="588 × 380">
            <div className="viz" style={{ height: 210, padding: 18, display: "grid", gap: 10, alignContent: "start" }}>
              <span className="mono">Q3 investor update · Fund II · draft</span>
              <div style={{ fontWeight: 600, fontSize: 17 }}>Occupancy held at 96% and we closed on Elm Street.</div>
              {[92, 100, 76, 88].map((w, i) => <i key={i} style={{ display: "block", height: 7, width: `${w}%`, background: "var(--line)", borderRadius: 4 }} />)}
              <span className="mono" style={{ color: "#C2336A" }}>waiting for your approval</span>
            </div>
            <h3>Investor updates from real numbers</h3>
            <p>Drafted from your books and rent roll, sent only after you sign off.</p>
          </BF>
          <BF as="article" className="card" size="588 × 380">
            <div className="viz" style={{ height: 210, padding: 18, display: "grid", gap: 10, alignContent: "start" }}>
              {[
                ["Payments over $5,000 wait for me", true],
                ["Text residents 8 am to 8 pm only", true],
                ["Escalate late rent on day 10", true],
                ["Send investor emails without review", false],
              ].map(([t, on]) => (
                <div key={t as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "1px solid var(--line)", borderRadius: 8, padding: "8px 10px", fontSize: 13.5 }}>
                  {t as string}
                  <span aria-hidden="true" style={{ width: 30, height: 18, borderRadius: 9, background: on ? "var(--brand)" : "var(--line-2)", position: "relative", flex: "none" }}>
                    <span style={{ position: "absolute", top: 2, left: on ? 14 : 2, width: 14, height: 14, borderRadius: 7, background: "#fff" }} />
                  </span>
                </div>
              ))}
            </div>
            <h3>Approval rules you set</h3>
            <p>You decide what agents may do alone and what always waits for you.</p>
          </BF>
        </div>
      </div>
    </section>
  );
}

function Scenarios() {
  return (
    <section className="sec" id="week" aria-labelledby="week-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="mono tag">/week · with RKV</span>
          <h2 id="week-title" className="h2 display">A week on your portfolio with the crew</h2>
        </div>
        <BF className="featured" size="1200 × 420">
          <span className="mono" style={{ color: "#C2336A" }}>/example week · 40-unit portfolio</span>
          <blockquote>&ldquo;By Monday at 7 am you know the three things that need you. Everything else already happened.&rdquo;</blockquote>
          <div className="timeline">
            {[
              ["Mon 7:00", "The Brain sends the weekly brief: a refi to start, a payment plan to approve, two seller calls booked."],
              ["Tue 2:14", "A resident reports a leak. The desk replies, books a plumber and confirms the fix by 9 am."],
              ["Wed 10:30", "Distress Radar flags a probate filing. The underwriter has a first model ready before lunch."],
              ["Fri 4:00", "Books are reconciled, the asset report is drafted, and the investor update waits for your sign-off."],
            ].map(([t, e]) => (
              <div className="ev" key={t}><span className="mono">{t}</span><span>{e}</span></div>
            ))}
          </div>
          <div className="person">
            <LogoMark size={40} />
            <div><b>RKV Consulting</b><span className="mono">Example based on a typical engagement</span></div>
          </div>
        </BF>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="sec" id="faq" aria-labelledby="faq-title" style={{ paddingTop: 0 }}>
      <div className="wrap faq-grid">
        <div>
          <span className="mono tag">/faq</span>
          <h2 id="faq-title" className="h2 display">Questions, answered.</h2>
          <p className="lede" style={{ marginBottom: 20 }}>Want to talk it through? You get a person on the call.</p>
          <a className="link-arrow" href="#contact">Contact us <span>→</span></a>
        </div>
        <div className="faq">
          {FAQ.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}<span className="pm" aria-hidden="true" /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ship() {
  return (
    <section className="sec ship" id="contact" aria-labelledby="ship-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <BF className="ship-box" size="1200 × 460">
          <span className="mono">/start</span>
          <h2 id="ship-title" className="h2 display">Give your portfolio<br />a crew.</h2>
          <p>Book a 30-minute call. We&apos;ll find your three biggest leaks and show you the agents that fix them.</p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href={CONTACT.calendly}>Book a strategy call</a>
            <a className="btn btn-ghost" href={`mailto:${CONTACT.email}`}>Email us</a>
          </div>
                  </BF>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-cta">
          <div>
            <span className="mono">/footer · 1200 × auto</span>
            <p className="display foot-line">Your first agent is one call away.</p>
          </div>
          <div className="btns">
            <a className="btn btn-primary" href="#contact">Book a call</a>
            <a className="btn btn-ghost" href="#agents">See all 21 agents</a>
          </div>
        </div>
        <div className="foot-main">
          <div>
            <a href="#top" className="logo"><LogoMark /><span>RKV <small>Consulting</small></span></a>
            <p>AI agents for real estate investors and investment firms. From the first seller lead to the last investor update.</p>
            <div className="online">
              <div style={{ display: "flex", justifyContent: "space-between" }}><span><span className="dot" style={{ display: "inline-block", marginRight: 8 }} />21 / 21 agents online</span><span style={{ color: "var(--faint)" }}>24/7</span></div>
              <div className="dots" aria-hidden="true">
                {DEPTS.flatMap((d) => d.agents.map((a, i) => <i key={a.code} style={{ background: d.color, animationDelay: `${i * 0.2}s` }} />))}
              </div>
            </div>
          </div>
          <div>
            <h5>SERVICES</h5>
            <ul>{DEPTS.slice(0, 4).map((d) => <li key={d.id}><a href="#agents">{d.name}</a></li>)}</ul>
          </div>
          <div>
            <h5>COMPANY</h5>
            <ul><li><a href="#process">How it works</a></li><li><a href="#week">A week with RKV</a></li><li><a href="#faq">FAQ</a></li><li><a href="#contact">Contact</a></li></ul>
          </div>
          <div>
            <h5>CONTACT</h5>
            <ul><li><a href={`mailto:${CONTACT.email}`}>Email</a></li><li><a href={CONTACT.calendly}>Book a call</a></li><li><a href="#contact">Phone</a></li></ul>
          </div>
        </div>
        <div className="wordmark" aria-hidden="true">RKV</div>
        <div className="foot-bottom">
          <span className="mono">© 2026 RKV Consulting.</span>
          <span className="mono"><span className="dot" style={{ display: "inline-block", marginRight: 8 }} />status · all 21 agents online</span>
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="guides" aria-hidden="true" />
      <Nav />
      <main id="main">
        <Hero />
        <section style={{ paddingBottom: 0 }} aria-label="Control room">
          <Workspace />
        </section>
        <section className="trust" aria-labelledby="trust-title">
          <div className="wrap">
            <p id="trust-title" className="mono">Built to plug into the tools real estate teams already use</p>
            <div className="tools">{TOOLS.map((t) => <span key={t}>{t}</span>)}</div>
            <Stats />
          </div>
        </section>
        <Process />
        <section className="sec" id="agents" aria-labelledby="agents-title" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="mono tag">/crew · 21 agents</span>
              <h2 id="agents-title" className="h2 display">21 agents across six departments</h2>
              <p className="lede">Every agent owns one job and they all share one picture of your portfolio. Pick a department to see who&apos;s on it.</p>
            </div>
            <Crew />
          </div>
        </section>
        <Output />
        <Scenarios />
        <Faq />
        <Ship />
      </main>
      <Footer />
      <BuildController />
    </>
  );
}
