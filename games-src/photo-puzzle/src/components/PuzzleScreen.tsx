import { useEffect, useRef, useState } from 'react';
import { computeGridSize, generatePuzzleGeometry } from '../puzzle/geometry';
import { bakePieceImages } from '../puzzle/pieceImages';
import { DIFFICULTY_PIECE_TARGET, useGame, useGameActions } from '../puzzle/GameContext';
import type { PieceState } from '../puzzle/types';
import { PuzzlePiece } from './PuzzlePiece';
import { CelebrationOverlay } from './CelebrationOverlay';

interface BoardOffset {
  x: number;
  y: number;
}

function scatterPositions(
  count: number,
  pieceW: number,
  pieceH: number,
  surfaceW: number,
  trayTop: number,
  trayHeight: number,
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * Math.max(1, surfaceW - pieceW);
    const y = trayTop + Math.random() * Math.max(1, trayHeight - pieceH);
    positions.push({ x, y });
  }
  return positions;
}

export function PuzzleScreen() {
  const { state } = useGame();
  const { puzzleReady, dropPiece, rescatter, toggleHint, toggleSound, newPhoto, celebrationDone } = useGameActions();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [boardOffset, setBoardOffset] = useState<BoardOffset>({ x: 0, y: 20 });
  const generatingFor = useRef<string | null>(null);

  const { sourceImage, imageAspect, difficulty, geometry, pieceBitmaps, pieces, hintOn, soundOn, celebrating } = state;

  useEffect(() => {
    if (!sourceImage) return;
    const key = `${difficulty}:${sourceImage.src.length}`;
    if (generatingFor.current === key) return;
    generatingFor.current = key;

    let cancelled = false;
    (async () => {
      const surface = surfaceRef.current;
      if (!surface) return;
      const surfaceW = surface.clientWidth || window.innerWidth - 32;
      const surfaceH = surface.clientHeight || window.innerHeight - 200;

      const maxBoardW = Math.min(surfaceW * 0.94, 640);
      const maxBoardH = Math.min(surfaceH * 0.42, 640);
      let boardW = maxBoardW;
      let boardH = boardW / imageAspect;
      if (boardH > maxBoardH) {
        boardH = maxBoardH;
        boardW = boardH * imageAspect;
      }
      boardW = Math.round(boardW);
      boardH = Math.round(boardH);

      const { rows, cols } = computeGridSize(DIFFICULTY_PIECE_TARGET[difficulty], imageAspect);
      const geom = generatePuzzleGeometry(rows, cols, boardW, boardH, Date.now() ^ (rows * 977 + cols));
      const bitmaps = await bakePieceImages(sourceImage, geom);
      if (cancelled) return;

      const offsetX = Math.max(0, (surfaceW - boardW) / 2);
      const offsetY = 20;
      const trayTop = offsetY + boardH + 28;
      const trayHeight = Math.max(260, surfaceH - trayTop - 16);

      const positions = scatterPositions(bitmaps.length, bitmaps[0].width, bitmaps[0].height, surfaceW, trayTop, trayHeight);
      const newPieces: PieceState[] = bitmaps.map((b, i) => ({
        id: i,
        row: b.row,
        col: b.col,
        x: positions[i].x,
        y: positions[i].y,
        placed: false,
      }));

      setBoardOffset({ x: offsetX, y: offsetY });
      puzzleReady(geom, bitmaps, newPieces);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceImage, difficulty]);

  const handlePlayAgain = () => {
    const surface = surfaceRef.current;
    if (!surface || !geometry || pieceBitmaps.length === 0) return;
    const surfaceW = surface.clientWidth;
    const trayTop = boardOffset.y + geometry.boardHeight + 28;
    const trayHeight = Math.max(260, surface.clientHeight - trayTop - 16);
    const positions = scatterPositions(pieceBitmaps.length, pieceBitmaps[0].width, pieceBitmaps[0].height, surfaceW, trayTop, trayHeight);
    const newPieces: PieceState[] = pieceBitmaps.map((b, i) => ({
      id: i,
      row: b.row,
      col: b.col,
      x: positions[i].x,
      y: positions[i].y,
      placed: false,
    }));
    rescatter(newPieces);
  };

  const bitmapByCoord = new Map(pieceBitmaps.map((b) => [`${b.row}:${b.col}`, b]));

  return (
    <div className="play-screen">
      <div className="top-bar">
        <button type="button" className="icon-button" onClick={newPhoto} aria-label="New photo" title="New photo">
          🔄
        </button>
        <div className="top-bar-spacer" />
        <button
          type="button"
          className={`icon-button${hintOn ? ' active' : ''}`}
          onClick={toggleHint}
          aria-label={hintOn ? 'Hide hint picture' : 'Show hint picture'}
          title="Hint"
        >
          👁️
        </button>
        <button
          type="button"
          className={`icon-button${soundOn ? ' active' : ''}`}
          onClick={toggleSound}
          aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
          title="Sound"
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
      </div>

      <div className="surface" ref={surfaceRef}>
        {!geometry && (
          <div className="loading-state">
            <div className="loading-spinner" aria-hidden="true" />
            <p>Shuffling pieces…</p>
          </div>
        )}

        {geometry && (
          <>
            <div
              className="board"
              style={{
                left: boardOffset.x,
                top: boardOffset.y,
                width: geometry.boardWidth,
                height: geometry.boardHeight,
              }}
            >
              {hintOn && sourceImage && <img className="ghost-outline" src={sourceImage.src} alt="" draggable={false} />}
              <svg className="grid-lines" width={geometry.boardWidth} height={geometry.boardHeight} aria-hidden="true">
                {Array.from({ length: geometry.cols - 1 }, (_, i) => (
                  <line
                    key={`v${i}`}
                    x1={(i + 1) * geometry.cellWidth}
                    y1={0}
                    x2={(i + 1) * geometry.cellWidth}
                    y2={geometry.boardHeight}
                  />
                ))}
                {Array.from({ length: geometry.rows - 1 }, (_, i) => (
                  <line
                    key={`h${i}`}
                    x1={0}
                    y1={(i + 1) * geometry.cellHeight}
                    x2={geometry.boardWidth}
                    y2={(i + 1) * geometry.cellHeight}
                  />
                ))}
              </svg>
            </div>

            {pieces.map((piece) => {
              const bitmap = bitmapByCoord.get(`${piece.row}:${piece.col}`)!;
              const target = {
                x: boardOffset.x + piece.col * geometry.cellWidth - geometry.bleed,
                y: boardOffset.y + piece.row * geometry.cellHeight - geometry.bleed,
              };
              return (
                <PuzzlePiece
                  key={piece.id}
                  piece={piece}
                  bitmap={bitmap}
                  target={target}
                  cellSize={Math.min(geometry.cellWidth, geometry.cellHeight)}
                  soundOn={soundOn}
                  onDropped={dropPiece}
                />
              );
            })}
          </>
        )}

        {celebrating && (
          <CelebrationOverlay
            soundOn={soundOn}
            onPlayAgain={() => {
              celebrationDone();
              handlePlayAgain();
            }}
            onNewPhoto={newPhoto}
          />
        )}
      </div>
    </div>
  );
}
