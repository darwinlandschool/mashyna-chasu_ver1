import { describe, expect, it } from 'vitest';
import { randomEvents, pickRandomEvent } from './randomEvents';
import { storyCards } from './storyCards';

describe('цілісність сценарних даних', () => {
  it('містить рівно 15 послідовних карток', () => {
    expect(storyCards).toHaveLength(15);
    expect(storyCards.map((card) => card.id)).toEqual(Array.from({ length: 15 }, (_, index) => index + 1));
  });

  it('кожна картка має версії 2000 і 2026 та 2–3 вибори', () => {
    for (const card of storyCards) {
      expect(card.scenes['2000']).toBeDefined();
      expect(card.scenes['2026']).toBeDefined();
      expect(card.scenes['2000'].choices.length).toBeGreaterThanOrEqual(2);
      expect(card.scenes['2000'].choices.length).toBeLessThanOrEqual(3);
      expect(card.scenes['2026'].choices.length).toBeGreaterThanOrEqual(2);
      expect(card.scenes['2026'].choices.length).toBeLessThanOrEqual(3);
    }
  });

  it('використовує всі сім наданих портретів у сюжеті', () => {
    const used = new Set(storyCards.flatMap((card) => [card.scenes['2000'].character, card.scenes['2026'].character]));
    expect(used).toEqual(new Set(['sasha', 'denys', 'halyna', 'olena', 'marko', 'director', 'sashasMother', 'narrator']));
  });

  it('не повторює випадкові події за проходження', () => {
    const used: string[] = [];
    for (let index = 0; index < 3; index += 1) {
      const event = pickRandomEvent('2026', used, () => 0);
      expect(used).not.toContain(event.id);
      used.push(event.id);
    }
    expect(new Set(used).size).toBe(3);
    expect(randomEvents.filter((event) => event.era === '2026').length).toBeGreaterThanOrEqual(3);
  });
});
