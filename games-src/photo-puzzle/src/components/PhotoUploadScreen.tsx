import { useRef, useState } from 'react';
import { loadImageFromFile } from '../puzzle/pieceImages';
import { useGameActions } from '../puzzle/GameContext';
import { unlockAudio } from '../audio/chime';

export function PhotoUploadScreen() {
  const { selectImage } = useGameActions();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    unlockAudio();
    setError(null);
    setBusy(true);
    try {
      const image = await loadImageFromFile(file);
      selectImage(image);
    } catch {
      setError("Hmm, that photo didn't load. Try another one?");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="upload-screen">
      <div className="upload-card">
        <div className="upload-emoji" aria-hidden="true">
          🧩
        </div>
        <h1>Photo Puzzle</h1>
        <p>Pick a photo and turn it into a puzzle!</p>

        <div className="upload-actions">
          <button type="button" className="big-button primary" disabled={busy} onClick={() => cameraInputRef.current?.click()}>
            📷 Take a Photo
          </button>
          <button type="button" className="big-button" disabled={busy} onClick={() => galleryInputRef.current?.click()}>
            🖼️ Choose a Photo
          </button>
        </div>

        {busy && <p className="upload-status">Loading your photo…</p>}
        {error && <p className="upload-error">{error}</p>}

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <input ref={galleryInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
    </div>
  );
}
