import type { HiddenTraits, ResourceState } from '../types/game';

export const SAVE_VERSION = 1;
export const SAVE_KEY = 'mashyna-chasu:save:v1';
export const TOTAL_STORY_CARDS = 15;

export const INITIAL_RESOURCES: ResourceState = {
  knowledge: 7,
  friends: 7,
  energy: 7,
  coins: 10,
};

export const INITIAL_TRAITS: HiddenTraits = {
  creativity: 0,
  technology: 0,
  strategy: 0,
  communication: 0,
};

export const ERA_LABELS = {
  '2000': 'Школа 2000 року',
  '2026': 'Школа 2026 року',
} as const;
