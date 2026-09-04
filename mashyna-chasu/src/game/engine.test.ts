import { describe, expect, it } from 'vitest';
import { crisisEvents } from '../data/crises';
import { storyCards } from '../data/storyCards';
import type { Choice, Era, GameState } from '../types/game';
import {
  advanceGame,
  applyStatDelta,
  canAffordChoice,
  resolveCrisisChoice,
  resolveStoryChoice,
  startGame,
} from './engine';
import { getDeferredConsequences } from './deferredEffects';

const sceneChoice = (cardId: number, era: Era, id: Choice['id']) =>
  storyCards[cardId - 1].scenes[era].choices.find((choice) => choice.id === id)!;

describe('ресурси', () => {
  it('застосовує видимі та приховані зміни', () => {
    const result = applyStatDelta(
      { knowledge: 7, friends: 7, energy: 7, coins: 10 },
      { creativity: 0, technology: 0, strategy: 0, communication: 0 },
      { knowledge: 2, energy: -3, coins: -4, creativity: 2 },
    );
    expect(result.resources).toEqual({ knowledge: 9, friends: 7, energy: 4, coins: 6 });
    expect(result.hidden.creativity).toBe(2);
  });

  it('обмежує шкали діапазоном 0–10, а монети — нулем', () => {
    const result = applyStatDelta(
      { knowledge: 9, friends: 1, energy: 7, coins: 2 },
      { creativity: 0, technology: 0, strategy: 0, communication: 0 },
      { knowledge: 8, friends: -8, energy: -99, coins: -99 },
    );
    expect(result.resources).toEqual({ knowledge: 10, friends: 0, energy: 0, coins: 0 });
  });

  it('не дозволяє витратити більше монет, ніж є', () => {
    const state = { ...startGame('2000'), resources: { knowledge: 7, friends: 7, energy: 7, coins: 2 } };
    const expensive = { ...sceneChoice(10, '2000', 'A'), effects: { coins: -6 } };
    expect(canAffordChoice(expensive, state.resources)).toBe(false);
    expect(resolveStoryChoice(state, expensive)).toBe(state);
  });

  it('позначає повторне виснаження ресурсу після вже використаної кризи', () => {
    const state = {
      ...startGame('2000'),
      resources: { knowledge: 7, friends: 7, energy: 1, coins: 10 },
      activatedCrises: ['energy' as const],
    };
    const drainingChoice = { ...sceneChoice(1, '2000', 'B'), effects: { energy: -2 } };
    const result = resolveStoryChoice(state, drainingChoice, () => 0);
    expect(result.resources.energy).toBe(0);
    expect(result.depletedAfterCrisis).toContain('energy');
    expect(result.pendingSteps).not.toContainEqual({ type: 'crisis', resource: 'energy' });
  });
});

describe('прапорці та відкладені наслідки', () => {
  it('записує прапорці сюжетного вибору', () => {
    const state = resolveStoryChoice(startGame('2026'), sceneChoice(1, '2026', 'C'), () => 0);
    expect(state.flags.lateForCard4).toBe(true);
  });

  it('переносить запізнення з картки 1 у картку 4', () => {
    const state = { ...startGame('2000'), flags: { ...startGame('2000').flags, lateForCard4: true } };
    const result = getDeferredConsequences(4, state);
    expect(result.effects.energy).toBe(-1);
    expect(result.notes[0]).toContain('ході 1');
  });

  it('переносить невиконану домашку з картки 2 у картку 5', () => {
    const state = { ...startGame('2026'), flags: { ...startGame('2026').flags, missedHomework: true } };
    const result = getDeferredConsequences(5, state);
    expect(result.effects.knowledge).toBe(-1);
    expect(result.notes[0]).toContain('ході 2');
  });

  it('згадує нерозібране повідомлення у картці 12', () => {
    const state = { ...startGame('2000'), flags: { ...startGame('2000').flags, misunderstoodSlang: true } };
    expect(getDeferredConsequences(12, state).notes[0]).toContain('Саша підколює');
  });

  it('винагороджує самостійну роботу й Маркову допомогу у картці 13', () => {
    const base = startGame('2000');
    const state = { ...base, flags: { ...base.flags, projectApproach: 'self' as const, befriendedMarko: true } };
    const result = getDeferredConsequences(13, state);
    expect(result.effects.knowledge).toBe(3);
    expect(result.notes.some((note) => note.includes('ході 7'))).toBe(true);
  });

  it('винагороджує ШІ-помічника та карає бездумне копіювання', () => {
    const base = startGame('2026');
    const helper = getDeferredConsequences(13, { ...base, flags: { ...base.flags, projectApproach: 'ai-helper' } });
    const copied = getDeferredConsequences(13, { ...base, flags: { ...base.flags, projectApproach: 'copied' } });
    expect(helper.effects).toMatchObject({ knowledge: 2, technology: 1 });
    expect(copied.effects).toMatchObject({ knowledge: -3, energy: -1 });
  });

  it('повертає позику Саші на картці 14 за добрих стосунків', () => {
    const base = startGame('2000');
    const state = { ...base, flags: { ...base.flags, lentToSasha: 4 }, resources: { ...base.resources, friends: 8 } };
    expect(getDeferredConsequences(14, state).effects.coins).toBe(4);
  });

  it('планує окрему сцену директора після шахрайства', () => {
    const state = { ...startGame('2026'), cardIndex: 4 };
    const result = resolveStoryChoice(state, sceneChoice(5, '2026', 'B'), () => 0);
    expect(result.pendingSteps).toContainEqual({ type: 'director' });
  });
});

describe('повний ігровий цикл', () => {
  function finishEra(era: Era): GameState {
    let state = startGame(era);
    let safety = 0;
    while (state.status === 'playing' && safety < 200) {
      safety += 1;
      if (state.activeStep?.type === 'crisis' && !state.selectedChoiceId) {
        const crisis = crisisEvents[state.activeStep.resource];
        const affordable = crisis.choices.find((choice) => canAffordChoice(choice, state.resources))!;
        state = resolveCrisisChoice(state, affordable, () => 0);
      } else if (state.activeStep) {
        state = advanceGame(state);
      } else if (!state.selectedChoiceId) {
        const scene = storyCards[state.cardIndex].scenes[era];
        const affordable = scene.choices.find((choice) => canAffordChoice(choice, state.resources))!;
        state = resolveStoryChoice(state, affordable, () => 0);
      } else {
        state = advanceGame(state);
      }
    }
    expect(safety).toBeLessThan(200);
    return state;
  }

  it.each(['2000', '2026'] as Era[])('дозволяє пройти всі 15 карток епохи %s', (era) => {
    const final = finishEra(era);
    expect(final.status).toBe('complete');
    expect(final.decisions).toHaveLength(15);
    expect(final.usedRandomEventIds).toHaveLength(3);
    expect(new Set(final.usedRandomEventIds).size).toBe(3);
  });
});
