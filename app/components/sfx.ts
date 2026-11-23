"use client";
/*
 * Tiny synthesized sound effects (no audio files). Browsers only allow audio after the visitor
 * interacts, so the audio context is created on the first click or key press.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;
const last: Record<string, number> = {};

// Sound is on by default. (New storage key so an old "off" from earlier versions doesn't stick.)
try { muted = localStorage.getItem("rkv-sound-v2") === "off"; } catch { /* storage blocked */ }

export function unlock() {
  if (ctx) { if (ctx.state === "suspended") ctx.resume().catch(() => {}); return; }
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 1;
  master.connect(ctx.destination);
}

export const isMuted = () => muted;
export const isRunning = () => !!ctx && ctx.state === "running";
export function setMuted(m: boolean) {
  muted = m;
  try { localStorage.setItem("rkv-sound-v2", m ? "off" : "on"); } catch { /* storage blocked */ }
  if (ctx && master) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.02);
}

function ready(key: string, gap: number) {
  if (!ctx || !master || muted || ctx.state !== "running" || document.hidden) return false;
  const now = performance.now();
  if (now - (last[key] || 0) < gap) return false;
  last[key] = now;
  return true;
}

function tone(freq: number, dur: number, vol: number, type: OscillatorType = "sine", to?: number, delay = 0) {
  const c = ctx!, t = c.currentTime + delay;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master!);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(dur: number, vol: number, hp: number) {
  const c = ctx!, t = c.currentTime;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = buf; f.type = "highpass"; f.frequency.value = hp; g.gain.value = vol;
  s.connect(f).connect(g).connect(master!);
  s.start(t);
}

/** A layer snaps into place: a soft, slightly varied tick. */
export function tick() {
  if (!ready("tick", 55)) return;
  noise(0.025, 0.05, 2400);
  tone(1500 + Math.random() * 500, 0.04, 0.012);
}
/** Pointer moves onto a button or link. */
export function hover() {
  if (!ready("hover", 90)) return;
  tone(880, 0.05, 0.01, "sine", 1040);
}
/** A button or link is pressed. */
export function press() {
  if (!ready("press", 60)) return;
  noise(0.02, 0.06, 1800);
  tone(620, 0.07, 0.022, "triangle", 420);
}
/** Something finished: the full page is built, or a video opens. */
export function chime() {
  if (!ready("chime", 400)) return;
  tone(660, 0.35, 0.018, "sine");
  tone(990, 0.45, 0.014, "sine", undefined, 0.08);
}
