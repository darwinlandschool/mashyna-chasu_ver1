import { SAVE_KEY, SAVE_VERSION } from '../data/config';
import type { GameState } from '../types/game';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const browserStorage = (): StorageLike | null =>
  typeof window === 'undefined' ? null : window.localStorage;

export function saveGameState(state: GameState, storage: StorageLike | null = browserStorage()): void {
  if (!storage) return;
  if (state.status !== 'playing') {
    if (state.status === 'complete') storage.removeItem(SAVE_KEY);
    return;
  }
  storage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadGameState(storage: StorageLike | null = browserStorage()): GameState | null {
  if (!storage) return null;
  const raw = storage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (
      parsed.version !== SAVE_VERSION ||
      parsed.status !== 'playing' ||
      (parsed.era !== '2000' && parsed.era !== '2026') ||
      typeof parsed.cardIndex !== 'number' ||
      !parsed.resources ||
      !parsed.hidden ||
      !parsed.flags ||
      !Array.isArray(parsed.usedRandomEventIds) ||
      !Array.isArray(parsed.activatedCrises) ||
      !Array.isArray(parsed.decisions)
    ) {
      storage.removeItem(SAVE_KEY);
      return null;
    }
    return parsed as GameState;
  } catch {
    storage.removeItem(SAVE_KEY);
    return null;
  }
}

export function clearGameState(storage: StorageLike | null = browserStorage()): void {
  storage?.removeItem(SAVE_KEY);
}
