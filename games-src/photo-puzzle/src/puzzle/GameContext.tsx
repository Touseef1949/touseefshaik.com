import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { PuzzleGeometry } from './geometry';
import type { Difficulty, PieceBitmap, PieceState, Screen } from './types';

export const DIFFICULTY_PIECE_TARGET: Record<Difficulty, number> = {
  easy: 6,
  medium: 12,
  hard: 20,
};

interface GameState {
  screen: Screen;
  sourceImage: HTMLImageElement | null;
  imageAspect: number;
  difficulty: Difficulty;
  geometry: PuzzleGeometry | null;
  pieceBitmaps: PieceBitmap[];
  pieces: PieceState[];
  hintOn: boolean;
  soundOn: boolean;
  loading: boolean;
  celebrating: boolean;
}

type Action =
  | { type: 'IMAGE_SELECTED'; image: HTMLImageElement }
  | { type: 'DIFFICULTY_SELECTED'; difficulty: Difficulty }
  | { type: 'PUZZLE_READY'; geometry: PuzzleGeometry; bitmaps: PieceBitmap[]; pieces: PieceState[] }
  | { type: 'PIECE_DROPPED'; id: number; x: number; y: number; placed: boolean }
  | { type: 'RESCATTER'; pieces: PieceState[] }
  | { type: 'TOGGLE_HINT' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'NEW_PHOTO' }
  | { type: 'CELEBRATION_DONE' };

const initialState: GameState = {
  screen: 'upload',
  sourceImage: null,
  imageAspect: 4 / 3,
  difficulty: 'easy',
  geometry: null,
  pieceBitmaps: [],
  pieces: [],
  hintOn: true,
  soundOn: true,
  loading: false,
  celebrating: false,
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'IMAGE_SELECTED':
      return {
        ...state,
        sourceImage: action.image,
        imageAspect: action.image.naturalWidth / action.image.naturalHeight,
        screen: 'difficulty',
      };
    case 'DIFFICULTY_SELECTED':
      return { ...state, difficulty: action.difficulty, loading: true, screen: 'play' };
    case 'PUZZLE_READY':
      return {
        ...state,
        geometry: action.geometry,
        pieceBitmaps: action.bitmaps,
        pieces: action.pieces,
        loading: false,
        screen: 'play',
        celebrating: false,
      };
    case 'PIECE_DROPPED': {
      const pieces = state.pieces.map((p) => (p.id === action.id ? { ...p, x: action.x, y: action.y, placed: action.placed } : p));
      const allPlaced = pieces.every((p) => p.placed);
      return { ...state, pieces, celebrating: allPlaced };
    }
    case 'RESCATTER':
      return { ...state, pieces: action.pieces, celebrating: false };
    case 'TOGGLE_HINT':
      return { ...state, hintOn: !state.hintOn };
    case 'TOGGLE_SOUND':
      return { ...state, soundOn: !state.soundOn };
    case 'NEW_PHOTO':
      return { ...initialState, soundOn: state.soundOn, hintOn: state.hintOn };
    case 'CELEBRATION_DONE':
      return { ...state, celebrating: false };
    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export function useGameActions() {
  const { dispatch } = useGame();
  return {
    selectImage: useCallback((image: HTMLImageElement) => dispatch({ type: 'IMAGE_SELECTED', image }), [dispatch]),
    selectDifficulty: useCallback((difficulty: Difficulty) => dispatch({ type: 'DIFFICULTY_SELECTED', difficulty }), [dispatch]),
    puzzleReady: useCallback(
      (geometry: PuzzleGeometry, bitmaps: PieceBitmap[], pieces: PieceState[]) =>
        dispatch({ type: 'PUZZLE_READY', geometry, bitmaps, pieces }),
      [dispatch],
    ),
    dropPiece: useCallback((id: number, x: number, y: number, placed: boolean) => dispatch({ type: 'PIECE_DROPPED', id, x, y, placed }), [dispatch]),
    rescatter: useCallback((pieces: PieceState[]) => dispatch({ type: 'RESCATTER', pieces }), [dispatch]),
    toggleHint: useCallback(() => dispatch({ type: 'TOGGLE_HINT' }), [dispatch]),
    toggleSound: useCallback(() => dispatch({ type: 'TOGGLE_SOUND' }), [dispatch]),
    newPhoto: useCallback(() => dispatch({ type: 'NEW_PHOTO' }), [dispatch]),
    celebrationDone: useCallback(() => dispatch({ type: 'CELEBRATION_DONE' }), [dispatch]),
  };
}
