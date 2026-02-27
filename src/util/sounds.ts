/**
 * Synthesised sound effects using the Web Audio API.
 * No external audio files required.
 * All functions accept a volume parameter (0–1).
 */

let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
};

/** Short rising chime — correct answer */
export const playCorrect = (volume = 1) => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const v = 0.18 * volume;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(523.25, now); // C5
  osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
  osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
  gain.gain.setValueAtTime(v, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.35);
};

/** Short descending buzz — wrong answer */
export const playWrong = (volume = 1) => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const v = 0.1 * volume;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(330, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);
  gain.gain.setValueAtTime(v, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
};

/** Upbeat fanfare — test finished */
export const playFinish = (volume = 1) => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const v = 0.15 * volume;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const t = now + i * 0.12;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(v, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  });
};

/** Soft descending tone — reveal answer */
export const playReveal = (volume = 1) => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const v = 0.12 * volume;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(350, now + 0.25);
  gain.gain.setValueAtTime(v, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
};

/** Quick whoosh — skip word */
export const playSkip = (volume = 1) => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const v = 0.1 * volume;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
  gain.gain.setValueAtTime(v, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.18);
};

/** Quick "ready" beep — test started */
export const playStart = (volume = 1) => {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const v = 0.12 * volume;

  // Two quick beeps
  [0, 0.15].forEach((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const t = now + offset;
    osc.frequency.setValueAtTime(880, t); // A5
    gain.gain.setValueAtTime(v, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  });
};
