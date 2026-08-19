let sharedContext: AudioContext | null = null;

/** Must be called from within a real user gesture handler to satisfy mobile autoplay-unlock rules. */
export function unlockAudio() {
  if (!sharedContext) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedContext = new Ctor();
  }
  if (sharedContext.state === 'suspended') {
    void sharedContext.resume();
  }
  return sharedContext;
}

function playTone(ctx: AudioContext, freq: number, startTime: number, duration: number, peakGain: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

/** Quiet ~80ms blip for a single correctly-placed piece. */
export function playTick(soundOn: boolean) {
  if (!soundOn || !sharedContext) return;
  const ctx = sharedContext;
  playTone(ctx, 880, ctx.currentTime, 0.09, 0.12);
}

/** Short ascending arpeggio for full-puzzle completion. */
export function playCelebrationChime(soundOn: boolean) {
  if (!soundOn || !sharedContext) return;
  const ctx = sharedContext;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    playTone(ctx, freq, ctx.currentTime + i * 0.14, 0.35, 0.16);
  });
}
