import { useEffect } from 'react';
import { GameProvider, useGame } from './puzzle/GameContext';
import { PhotoUploadScreen } from './components/PhotoUploadScreen';
import { DifficultyPicker } from './components/DifficultyPicker';
import { PuzzleScreen } from './components/PuzzleScreen';

function Screens() {
  const { state } = useGame();

  useEffect(() => {
    return () => {
      state.pieceBitmaps.forEach((b) => URL.revokeObjectURL(b.url));
    };
  }, [state.pieceBitmaps]);

  if (state.screen === 'upload') return <PhotoUploadScreen />;
  if (state.screen === 'difficulty') return <DifficultyPicker />;
  return <PuzzleScreen />;
}

function App() {
  return (
    <GameProvider>
      <Screens />
    </GameProvider>
  );
}

export default App;
