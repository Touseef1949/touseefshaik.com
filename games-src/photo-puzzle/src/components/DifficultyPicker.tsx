import { useGame, useGameActions } from '../puzzle/GameContext';
import type { Difficulty } from '../puzzle/types';

const OPTIONS: { id: Difficulty; label: string; dots: number; className: string }[] = [
  { id: 'easy', label: 'Easy', dots: 3, className: 'card-easy' },
  { id: 'medium', label: 'Medium', dots: 6, className: 'card-medium' },
  { id: 'hard', label: 'Hard', dots: 9, className: 'card-hard' },
];

export function DifficultyPicker() {
  const { state } = useGame();
  const { selectDifficulty } = useGameActions();

  return (
    <div className="difficulty-screen">
      <h1>How many pieces?</h1>
      <p>Pick what feels fun today.</p>
      <div className="difficulty-cards">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`difficulty-card ${opt.className}`}
            onClick={() => selectDifficulty(opt.id)}
          >
            <div className="difficulty-dots" aria-hidden="true">
              {Array.from({ length: opt.dots }, (_, i) => (
                <span key={i} className="dot" />
              ))}
            </div>
            <span className="difficulty-label">{opt.label}</span>
          </button>
        ))}
      </div>
      {state.sourceImage && (
        <img className="difficulty-preview" src={state.sourceImage.src} alt="Your selected photo" draggable={false} />
      )}
    </div>
  );
}
