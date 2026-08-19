import { useCallback, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { PieceBitmap, PieceState } from '../puzzle/types';
import { playTick } from '../audio/chime';

interface Props {
  piece: PieceState;
  bitmap: PieceBitmap;
  target: { x: number; y: number };
  cellSize: number;
  soundOn: boolean;
  onDropped: (id: number, x: number, y: number, placed: boolean) => void;
}

export function PuzzlePiece({ piece, bitmap, target, cellSize, soundOn, onDropped }: Props) {
  const elRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{ offsetX: number; offsetY: number } | null>(null);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLImageElement>) => {
      if (piece.placed) return;
      const el = elRef.current;
      if (!el) return;
      el.setPointerCapture(e.pointerId);
      const touchLift = e.pointerType === 'touch' ? 44 : 0;
      dragRef.current = {
        offsetX: e.clientX - piece.x,
        offsetY: e.clientY - piece.y - touchLift,
      };
      el.dataset.x = String(piece.x);
      el.dataset.y = String(piece.y);
      el.style.zIndex = '1000';
      el.classList.add('dragging');
    },
    [piece.placed, piece.x, piece.y],
  );

  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current;
    const el = elRef.current;
    if (!drag || !el) return;
    const x = e.clientX - drag.offsetX;
    const y = e.clientY - drag.offsetY;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    el.dataset.x = String(x);
    el.dataset.y = String(y);
  }, []);

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<HTMLImageElement>) => {
      const drag = dragRef.current;
      const el = elRef.current;
      if (!drag || !el) return;
      dragRef.current = null;
      el.classList.remove('dragging');
      el.style.zIndex = '';

      const x = Number(el.dataset.x ?? piece.x);
      const y = Number(el.dataset.y ?? piece.y);

      const pieceCenterX = x + bitmap.width / 2;
      const pieceCenterY = y + bitmap.height / 2;
      const targetCenterX = target.x + bitmap.width / 2;
      const targetCenterY = target.y + bitmap.height / 2;
      const dist = Math.hypot(pieceCenterX - targetCenterX, pieceCenterY - targetCenterY);
      const threshold = Math.max(cellSize * 0.5, 28) * (e.pointerType === 'touch' ? 1.3 : 1);

      if (dist <= threshold) {
        onDropped(piece.id, target.x, target.y, true);
        playTick(soundOn);
      } else {
        onDropped(piece.id, x, y, false);
      }
    },
    [bitmap.width, bitmap.height, target.x, target.y, cellSize, onDropped, piece.id, piece.x, piece.y, soundOn],
  );

  return (
    <img
      ref={elRef}
      src={bitmap.url}
      alt=""
      draggable={false}
      data-row={piece.row}
      data-col={piece.col}
      data-placed={piece.placed}
      className={`puzzle-piece${piece.placed ? ' placed' : ''}`}
      style={{
        width: bitmap.width,
        height: bitmap.height,
        transform: `translate3d(${piece.x}px, ${piece.y}px, 0)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
}
