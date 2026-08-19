import { useEffect, useRef } from 'react';
import { burstConfetti } from '../confetti/confetti';
import { playCelebrationChime } from '../audio/chime';

interface Props {
  soundOn: boolean;
  onPlayAgain: () => void;
  onNewPhoto: () => void;
}

export function CelebrationOverlay({ soundOn, onPlayAgain, onNewPhoto }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    playCelebrationChime(soundOn);
    const canvas = canvasRef.current;
    if (canvas) {
      const stop = burstConfetti(canvas);
      return stop;
    }
  }, [soundOn]);

  return (
    <div className="celebration-overlay">
      <canvas ref={canvasRef} className="confetti-canvas" />
      <div className="celebration-card">
        <div className="celebration-emoji" aria-hidden="true">
          🎉
        </div>
        <h2>You did it!</h2>
        <p>Every piece found its home.</p>
        <div className="celebration-actions">
          <button type="button" className="big-button primary" onClick={onPlayAgain}>
            Play Again
          </button>
          <button type="button" className="big-button" onClick={onNewPhoto}>
            New Photo
          </button>
        </div>
      </div>
    </div>
  );
}
