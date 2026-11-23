"use client";
import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, useState } from "react";
import { CHAPTERS, DURATION, FPS, H, HeroFilm, SCENE, W } from "./HeroFilm";

export function FilmPlayer() {
  const ref = useRef<PlayerRef>(null);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(r);
    const p = ref.current;
    if (!p) return;
    if (r) { p.pause(); p.seekTo(SCENE * 4 + 120); setPlaying(false); }
    const onFrame = (e: { detail: { frame: number } }) => setFrame(e.detail.frame);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    p.addEventListener("frameupdate", onFrame);
    p.addEventListener("play", onPlay);
    p.addEventListener("pause", onPause);
    // pause when off screen, resume when back
    const host = document.querySelector(".film");
    const io = new IntersectionObserver(([en]) => { if (r) return; if (en.isIntersecting) p.play(); else p.pause(); }, { threshold: 0.15 });
    if (host) io.observe(host);
    return () => {
      p.removeEventListener("frameupdate", onFrame);
      p.removeEventListener("play", onPlay);
      p.removeEventListener("pause", onPause);
      io.disconnect();
    };
  }, []);

  const idx = Math.min(CHAPTERS.length - 1, Math.floor(frame / SCENE));
  return (
    <div className="film">
      <div className="film-canvas">
        <Player
          ref={ref}
          component={HeroFilm}
          durationInFrames={DURATION}
          fps={FPS}
          compositionWidth={W}
          compositionHeight={H}
          style={{ width: "100%", aspectRatio: `${W} / ${H}` }}
          autoPlay={!reduce}
          loop
          controls={false}
          clickToPlay={false}
          initiallyMuted
          acknowledgeRemotionLicense
        />
      </div>
      <div className="film-bar" role="group" aria-label="Film chapters">
        <button type="button" className="film-pp" aria-label={playing ? "Pause film" : "Play film"} onClick={() => (playing ? ref.current?.pause() : ref.current?.play())}>
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="3" y="2" width="3" height="10" rx="1" fill="currentColor" /><rect x="8" y="2" width="3" height="10" rx="1" fill="currentColor" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 2.5v9l7.5-4.5z" fill="currentColor" /></svg>
          )}
        </button>
        {CHAPTERS.map((c, i) => {
          const p = i < idx ? 1 : i > idx ? 0 : (frame - i * SCENE) / SCENE;
          return (
            <button key={c.code} type="button" className="film-ch" aria-current={i === idx} onClick={() => { ref.current?.seekTo(i * SCENE); ref.current?.play(); }}>
              <span className="film-track"><span style={{ transform: `scaleX(${p})` }} /></span>
              <span className="film-t"><b>{c.code}</b> {c.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
