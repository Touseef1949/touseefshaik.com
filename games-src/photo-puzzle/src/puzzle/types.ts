export type Screen = 'upload' | 'difficulty' | 'play';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PieceState {
  id: number;
  row: number;
  col: number;
  x: number;
  y: number;
  placed: boolean;
}

export interface PieceBitmap {
  row: number;
  col: number;
  url: string;
  width: number;
  height: number;
}
