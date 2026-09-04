import { describe, expect, it } from 'vitest';
import { SAVE_KEY } from '../data/config';
import { startGame } from './engine';
import { loadGameState, saveGameState, type StorageLike } from './storage';

class MemoryStorage implements StorageLike {
  private data = new Map<string, string>();
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) { this.data.set(key, value); }
  removeItem(key: string) { this.data.delete(key); }
}

describe('збереження', () => {
  it('зберігає та відновлює повний стан проходження', () => {
    const storage = new MemoryStorage();
    const state = {
      ...startGame('2026'),
      cardIndex: 6,
      resources: { knowledge: 5, friends: 8, energy: 4, coins: 3 },
      usedRandomEventIds: ['2026-canva-autosave'],
      activatedCrises: ['energy' as const],
    };
    saveGameState(state, storage);
    expect(loadGameState(storage)).toEqual(state);
  });

  it('відкидає збереження з невідомою версією', () => {
    const storage = new MemoryStorage();
    storage.setItem(SAVE_KEY, JSON.stringify({ ...startGame('2000'), version: 999 }));
    expect(loadGameState(storage)).toBeNull();
    expect(storage.getItem(SAVE_KEY)).toBeNull();
  });
});
