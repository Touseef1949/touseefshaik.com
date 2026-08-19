export interface PuzzleGeometry {
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
  amplitude: number;
  bleed: number;
  boardWidth: number;
  boardHeight: number;
  /** [row][col] SVG path string in local piece-rect coords (0,0)-(cellWidth,cellHeight) */
  piecePaths: string[][];
}

interface EdgeCurve {
  sign: 1 | -1;
  pos: number;
}

interface Vec {
  x: number;
  y: number;
}

/** Deterministic PRNG so a given seed always reproduces the same tab pattern. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Derive a rows x cols grid close to targetCount that keeps pieces roughly square. */
export function computeGridSize(targetCount: number, aspectRatio: number): { rows: number; cols: number } {
  const cols = Math.max(2, Math.round(Math.sqrt(targetCount * aspectRatio)));
  const rows = Math.max(2, Math.round(targetCount / cols));
  return { rows, cols };
}

function fmt(p: Vec): string {
  return `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
}

/**
 * Draws a straight run from A to B with a single rounded "tab" (or its mirrored
 * "notch") bulging along `outward` at fraction tPos of the A->B baseline.
 * Both neighboring pieces trace the exact same physical curve (same seed-derived
 * pos/amplitude, opposite winding direction), so tabs and notches interlock exactly.
 */
function bumpPath(A: Vec, B: Vec, outward: Vec, hasTab: boolean, amp: number, tPos: number): string {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const L = Math.hypot(dx, dy);
  const ux = dx / L;
  const uy = dy / L;
  const hw = Math.min(0.15 * L, L * 0.32);
  const cu = tPos * L;
  const d = hasTab ? amp : -amp;

  const pt = (u: number, v: number): Vec => ({
    x: A.x + ux * u + outward.x * v,
    y: A.y + uy * u + outward.y * v,
  });

  const S = pt(cu - hw, 0);
  const E = pt(cu + hw, 0);
  const mid = pt(cu, d * 1.1);
  const c1a = pt(cu - hw * 0.6, 0);
  const c2a = pt(cu - hw * 0.35, d * 1.15);
  const c1b = pt(cu + hw * 0.35, d * 1.15);
  const c2b = pt(cu + hw * 0.6, 0);

  return `L ${fmt(S)} C ${fmt(c1a)} ${fmt(c2a)} ${fmt(mid)} C ${fmt(c1b)} ${fmt(c2b)} ${fmt(E)} L ${fmt(B)}`;
}

export function generatePuzzleGeometry(
  rows: number,
  cols: number,
  boardWidth: number,
  boardHeight: number,
  seed: number,
): PuzzleGeometry {
  const rand = mulberry32(seed);
  const cellWidth = boardWidth / cols;
  const cellHeight = boardHeight / rows;
  const amplitude = 0.22 * Math.min(cellWidth, cellHeight);
  const bleed = Math.ceil(amplitude * 1.3);

  // vEdges[r][c]: shared edge between piece(r,c) [left/owner1] and piece(r,c+1) [right/owner2]
  const vEdges: EdgeCurve[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: EdgeCurve[] = [];
    for (let c = 0; c < cols - 1; c++) {
      row.push({ sign: rand() < 0.5 ? 1 : -1, pos: 0.4 + rand() * 0.2 });
    }
    vEdges.push(row);
  }

  // hEdges[r][c]: shared edge between piece(r,c) [top/owner1] and piece(r+1,c) [bottom/owner2]
  const hEdges: EdgeCurve[][] = [];
  for (let r = 0; r < rows - 1; r++) {
    const row: EdgeCurve[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({ sign: rand() < 0.5 ? 1 : -1, pos: 0.4 + rand() * 0.2 });
    }
    hEdges.push(row);
  }

  const piecePaths: string[][] = [];
  for (let r = 0; r < rows; r++) {
    const rowPaths: string[] = [];
    for (let c = 0; c < cols; c++) {
      const w = cellWidth;
      const h = cellHeight;
      const topLeft: Vec = { x: 0, y: 0 };
      const topRight: Vec = { x: w, y: 0 };
      const bottomRight: Vec = { x: w, y: h };
      const bottomLeft: Vec = { x: 0, y: h };

      let d = `M ${fmt(topLeft)} `;

      // top edge: this piece is the "bottom" owner of hEdges[r-1][c]
      if (r === 0) {
        d += `L ${fmt(topRight)} `;
      } else {
        const edge = hEdges[r - 1][c];
        const hasTab = edge.sign === -1;
        d += `${bumpPath(topLeft, topRight, { x: 0, y: -1 }, hasTab, amplitude, edge.pos)} `;
      }

      // right edge: this piece is the "left" owner of vEdges[r][c]
      if (c === cols - 1) {
        d += `L ${fmt(bottomRight)} `;
      } else {
        const edge = vEdges[r][c];
        const hasTab = edge.sign === 1;
        d += `${bumpPath(topRight, bottomRight, { x: 1, y: 0 }, hasTab, amplitude, edge.pos)} `;
      }

      // bottom edge (traversed right-to-left): this piece is the "top" owner of hEdges[r][c]
      if (r === rows - 1) {
        d += `L ${fmt(bottomLeft)} `;
      } else {
        const edge = hEdges[r][c];
        const hasTab = edge.sign === 1;
        d += `${bumpPath(bottomRight, bottomLeft, { x: 0, y: 1 }, hasTab, amplitude, 1 - edge.pos)} `;
      }

      // left edge (traversed bottom-to-top): this piece is the "right" owner of vEdges[r][c-1]
      if (c === 0) {
        d += `L ${fmt(topLeft)} `;
      } else {
        const edge = vEdges[r][c - 1];
        const hasTab = edge.sign === -1;
        d += `${bumpPath(bottomLeft, topLeft, { x: -1, y: 0 }, hasTab, amplitude, 1 - edge.pos)} `;
      }

      d += 'Z';
      rowPaths.push(d);
    }
    piecePaths.push(rowPaths);
  }

  return { rows, cols, cellWidth, cellHeight, amplitude, bleed, boardWidth, boardHeight, piecePaths };
}
