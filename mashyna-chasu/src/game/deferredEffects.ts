import type { EchoRecord, GameState, StatDelta } from '../types/game';

export interface DeferredConsequence {
  effects: StatDelta;
  notes: string[];
  echoes: EchoRecord[];
}

const empty = (): DeferredConsequence => ({ effects: {}, notes: [], echoes: [] });

export function getDeferredConsequences(cardId: number, state: GameState): DeferredConsequence {
  const result = empty();
  const add = (sourceCardId: number, text: string, effects: StatDelta = {}) => {
    result.notes.push(`Це наслідок твого рішення у ході ${sourceCardId}. ${text}`);
    result.echoes.push({ sourceCardId, targetCardId: cardId, text });
    for (const [key, value] of Object.entries(effects)) {
      const stat = key as keyof StatDelta;
      result.effects[stat] = (result.effects[stat] ?? 0) + (value ?? 0);
    }
  };

  if (cardId === 4 && state.flags.lateForCard4) {
    add(1, 'Ти не помітив зміну кабінету й запізнився на урок.', { energy: -1 });
  }

  if (cardId === 5 && state.flags.missedHomework) {
    add(2, 'Домашнє завдання виявилося зовсім іншим, і пані Галина це згадала.', { knowledge: -1 });
  }

  if (cardId === 12 && state.flags.misunderstoodSlang) {
    add(3, 'Саша підколює: минулого разу ти погодився зовсім не на те, що думав.');
  }

  if (cardId === 13) {
    if (state.flags.projectApproach === 'copied') {
      add(
        4,
        state.era === '2026'
          ? 'Пані Галина просить пояснити рішення, яке ШІ зробив замість тебе.'
          : 'Пані Галина просить пояснити висновок із чужого реферату.',
        state.era === '2026' ? { knowledge: -3, energy: -1 } : { knowledge: -3 },
      );
    }
    if (state.flags.projectApproach === 'self') {
      add(4, 'Пані Галина бачить, що ти справді розібрався в матеріалі.', { knowledge: 2 });
    }
    if (state.flags.projectApproach === 'ai-helper') {
      add(4, 'Пані Галина помічає: технології допомогли тобі створити власну ідею.', {
        knowledge: 2,
        technology: 1,
      });
    }
    if (state.flags.befriendedMarko) {
      add(7, 'Марко допомагає відповісти на каверзне питання журі.', { knowledge: 1 });
    }
  }

  if (cardId === 14 && state.flags.lentToSasha > 0) {
    if (state.resources.friends >= 6) {
      add(11, `Саша повертає позичені ${state.flags.lentToSasha} монети.`, {
        coins: state.flags.lentToSasha,
      });
    } else {
      add(11, 'Саша памʼятає про позику, але ви так і не встигли нормально поговорити.');
    }
  }

  return result;
}

export function getDeferredContextNotes(cardId: number, state: GameState): string[] {
  return getDeferredConsequences(cardId, state).notes;
}
