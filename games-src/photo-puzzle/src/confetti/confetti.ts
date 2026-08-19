const COLORS = ['#ff8d63', '#ffc857', '#6fcf97', '#56ccf2', '#bb8fce', '#ff6b9d'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  spin: number;
  size: number;
  color: string;
}

/** Fires a self-terminating confetti burst on the given canvas. No external deps. */
export function burstConfetti(canvas: HTMLCanvasElement, durationMs = 3200) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const count = 120;
  const particles: Particle[] = Array.from({ length: count }, () => ({
    x: width / 2 + (Math.random() - 0.5) * width * 0.4,
    y: height * 0.25 + (Math.random() - 0.5) * 40,
    vx: (Math.random() - 0.5) * 9,
    vy: -Math.random() * 9 - 4,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.3,
    size: 6 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  const gravity = 0.28;
  const start = performance.now();
  let frameId: number;

  function frame(now: number) {
    const elapsed = now - start;
    ctx!.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.vy += gravity;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation);
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx!.restore();
    }

    if (elapsed < durationMs) {
      frameId = requestAnimationFrame(frame);
    } else {
      ctx!.clearRect(0, 0, width, height);
    }
  }

  frameId = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(frameId);
}
