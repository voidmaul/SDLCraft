export interface AudioCtxRef {
  ctx: AudioContext | null;
  muted: boolean;
}

export function createAudioContext(): AudioContext {
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
}

function playTone(
  ref: AudioCtxRef,
  frequency: number,
  type: OscillatorType,
  duration: number,
  gainValue: number,
  delay = 0
) {
  if (ref.muted || !ref.ctx) return;
  try {
    const ctx = ref.ctx;
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch {
    // Silently ignore audio errors
  }
}

export function playCorrect(ref: AudioCtxRef) {
  playTone(ref, 523, "sine", 0.15, 0.3);
  playTone(ref, 659, "sine", 0.15, 0.25, 0.1);
  playTone(ref, 784, "sine", 0.2, 0.2, 0.2);
}

export function playWrong(ref: AudioCtxRef) {
  playTone(ref, 220, "sawtooth", 0.2, 0.25);
  playTone(ref, 196, "sawtooth", 0.25, 0.2, 0.15);
}

export function playPop(ref: AudioCtxRef) {
  playTone(ref, 880, "sine", 0.08, 0.2);
}

export function playChime(ref: AudioCtxRef) {
  playTone(ref, 1046, "sine", 0.12, 0.18);
  playTone(ref, 1318, "sine", 0.1, 0.15, 0.08);
}

export function playStreak(ref: AudioCtxRef) {
  playTone(ref, 523, "sine", 0.08, 0.2);
  playTone(ref, 659, "sine", 0.08, 0.2, 0.07);
  playTone(ref, 784, "sine", 0.08, 0.2, 0.14);
  playTone(ref, 1046, "sine", 0.15, 0.2, 0.21);
}
