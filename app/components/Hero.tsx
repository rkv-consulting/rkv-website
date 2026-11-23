"use client";
import { BF } from "./Build";
import { FilmPlayer } from "./film/FilmPlayer";
import { bookHref } from "../data";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap" data-enter>
        <div className="mono hero-label">/hero · 1200 × auto</div>
        <span className="hero-pill mono"><i /> AI agents for real estate investors</span>
        <h1 id="hero-title" className="display">
          <span className="ln">Your real estate portfolio,</span>
          <span className="ln">
            run{" "}<span className="sel-word">
              live
              <span className="box" aria-hidden="true"><i /><i /><i /><i /></span>
              <span className="dim" aria-hidden="true">21 agents</span>
            </span>{" "}
            by AI agents.<span className="caret" aria-hidden="true" />
          </span>
        </h1>
        <p className="sub">
          One agent for a small team or a full system across 1,000+ doors. Agents answer leads and residents, chase rent,
          close the books and draft investor updates in the systems you already run.
        </p>
        <div className="hero-ctas">
          <a className="btn btn-primary btn-xl" href={bookHref()} target="_blank" rel="noopener noreferrer">
            Book your free audit call
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
          <button type="button" className="btn btn-ghost" onClick={() => window.dispatchEvent(new Event("rkv:replay"))}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
            Watch the agents build
          </button>
        </div>
        <p className="hero-book mono">30 minutes · free portfolio audit · pick any time on the calendar</p>
        <div className="mono hero-hint">Scroll to build · Stop and the crew circles your cursor · Esc skips</div>

        <BF size="Film · 1200 × 600" className="stage-bf">
          <div className="stage">
            <FilmPlayer />
          </div>
        </BF>
      </div>
    </section>
  );
}
