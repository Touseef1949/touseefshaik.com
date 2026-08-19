import type { PuzzleGeometry } from './geometry';
import type { PieceBitmap } from './types';

/**
 * Draws the source photo cover-fit into the board rect, then bakes each piece's
 * jigsaw-clipped bitmap once (as an object URL) so drag/drop is just moving
 * plain <img> elements via CSS transform - no per-frame canvas work.
 */
export async function bakePieceImages(image: HTMLImageElement, geometry: PuzzleGeometry): Promise<PieceBitmap[]> {
  const { rows, cols, cellWidth, cellHeight, bleed, boardWidth, boardHeight, piecePaths } = geometry;
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);

  const boardCanvas = document.createElement('canvas');
  boardCanvas.width = Math.round(boardWidth * dpr);
  boardCanvas.height = Math.round(boardHeight * dpr);
  const bctx = boardCanvas.getContext('2d')!;
  bctx.scale(dpr, dpr);

  const imgAspect = image.naturalWidth / image.naturalHeight;
  const boardAspect = boardWidth / boardHeight;
  let sx: number;
  let sy: number;
  let sw: number;
  let sh: number;
  if (imgAspect > boardAspect) {
    sh = image.naturalHeight;
    sw = sh * boardAspect;
    sy = 0;
    sx = (image.naturalWidth - sw) / 2;
  } else {
    sw = image.naturalWidth;
    sh = sw / boardAspect;
    sx = 0;
    sy = (image.naturalHeight - sh) / 2;
  }
  bctx.drawImage(image, sx, sy, sw, sh, 0, 0, boardWidth, boardHeight);

  const pieceW = cellWidth + bleed * 2;
  const pieceH = cellHeight + bleed * 2;
  const bitmaps: PieceBitmap[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(pieceW * dpr);
      canvas.height = Math.round(pieceH * dpr);
      const ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);

      const path = new Path2D(piecePaths[r][c]);
      ctx.save();
      ctx.translate(bleed, bleed);
      ctx.clip(path);
      const boardX = c * cellWidth - bleed;
      const boardY = r * cellHeight - bleed;
      ctx.drawImage(boardCanvas, boardX * dpr, boardY * dpr, pieceW * dpr, pieceH * dpr, -bleed, -bleed, pieceW, pieceH);
      ctx.restore();

      ctx.save();
      ctx.translate(bleed, bleed);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(60, 40, 20, 0.25)';
      ctx.stroke(path);
      ctx.restore();

      const url = await new Promise<string>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('toBlob failed'));
            return;
          }
          resolve(URL.createObjectURL(blob));
        }, 'image/png');
      });

      bitmaps.push({ row: r, col: c, url, width: pieceW, height: pieceH });
    }
  }

  return bitmaps;
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not read that image.'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });
}
