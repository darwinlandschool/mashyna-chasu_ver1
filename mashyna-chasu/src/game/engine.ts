import { crisisEvents } from '../data/crises';
import { INITIAL_RESOURCES, INITIAL_TRAITS, SAVE_VERSION, TOTAL_STORY_CARDS } from '../data/config';
import { getRandomEvent, pickRandomEvent } from '../data/randomEvents';
import { storyCards } from '../data/storyCards';
import { getDeferredConsequences } from './deferredEffects';
import type {
  Choice,
  ChoiceFeedback,
  Era,
  GameState,
  HiddenTraits,
  PendingStep,
  ResourceKey,
  ResourceState,
  StatDelta,
} from '../types/game';

const RESOURCE_KEYS: ResourceKey[] = ['knowledge', 'friends', 'energy', 'coins'];

export const clampResource = (key: ResourceKey, value: number): number =>
  key === 'coins' ? Math.max(0, value) : Math.min(10, Math.max(0, value));

export function combineDeltas(...deltas: StatDelta[]): StatDelta {
  const combined: StatDelta = {};
  for (const delta of deltas) {
    for (const [key, value] of Object.entries(delta)) {
      const stat = key as keyof StatDelta;
      combined[stat] = (combined[stat] ?? 0) + (value ?? 0);
    }
  }
  return combined;
}

export function applyStatDelta(
  resources: ResourceState,
  hidden: HiddenTraits,
  delta: StatDelta,
): { resources: ResourceState; hidden: HiddenTraits } {
  return {
    resources: {
      knowledge: clampResource('knowledge', resources.knowledge + (delta.knowledge ?? 0)),
      friends: clampResource('friends', resources.friends + (delta.friends ?? 0)),
      energy: clampResource('energy', resources.energy + (delta.energy ?? 0)),
      coins: clampResource('coins', resources.coins + (delta.coins ?? 0)),
    },
    hidden: {
      creativity: hidden.creativity + (delta.creativity ?? 0),
      technology: hidden.technology + (delta.technology ?? 0),
      strategy: hidden.strategy + (delta.strategy ?? 0),
      communication: hidden.communication + (delta.communication ?? 0),
    },
  };
}

export function canAffordChoice(choice: Choice, resources: ResourceState): boolean {
  return resources.coins + (choice.effects.coins ?? 0) >= 0;
}

export function createInitialState(status: GameState['status'] = 'start'): GameState {
  return {
    version: SAVE_VERSION,
    status,
    era: null,
    cardIndex: 0,
    resources: { ...INITIAL_RESOURCES },
    hidden: { ...INITIAL_TRAITS },
    flags: {
      lateForCard4: false,
      missedHomework: false,
      misunderstoodSlang: false,
      projectApproach: null,
      cheatedOnTest: false,
      befriendedMarko: false,
      lentToSasha: 0,
      directorVisited: false,
    },
    usedRandomEventIds: [],
    activatedCrises: [],
    depletedAfterCrisis: [],
    decisions: [],
    echoes: [],
    selectedChoiceId: null,
    feedback: null,
    activeStep: null,
    pendingSteps: [],
  };
}

export function startGame(era: Era): GameState {
  return { ...createInitialState('playing'), era };
}

function crisisStepsFor(state: GameState, resources: ResourceState): PendingStep[] {
  return RESOURCE_KEYS.filter(
    (resource) => resources[resource] === 0 && !state.activatedCrises.includes(resource),
  ).map((resource) => ({ type: 'crisis' as const, resource }));
}

function recordRepeatedDepletion(state: GameState, resources: ResourceState): ResourceKey[] {
  const repeated = RESOURCE_KEYS.filter(
    (resource) => resources[resource] === 0 && state.activatedCrises.includes(resource),
  );
  return [...new Set([...state.depletedAfterCrisis, ...repeated])];
}

function applyChoiceRisk(choice: Choice, random: () => number): {
  delta: StatDelta;
  reaction: string;
  riskLabel?: string;
} {
  if (!choice.risk) return { delta: choice.effects, reaction: choice.reaction };
  const success = random() < 0.5;
  return {
    delta: combineDeltas(choice.effects, success ? choice.risk.successEffects : choice.risk.failureEffects),
    reaction: `${choice.reaction} ${success ? choice.risk.successReaction : choice.risk.failureReaction}`,
    riskLabel: success ? 'Ризик спрацював' : 'Цього разу не пощастило',
  };
}

function scheduleStorySteps(
  state: GameState,
  cardId: number,
  choice: Choice,
  nextResources: ResourceState,
  random: () => number,
): { steps: PendingStep[]; usedRandomEventIds: string[] } {
  const steps = crisisStepsFor(state, nextResources);
  let usedRandomEventIds = state.usedRandomEventIds;

  if (cardId === 5 && choice.flagPatch?.cheatedOnTest) steps.push({ type: 'director' });

  if ([3, 8, 12].includes(cardId)) {
    const event = pickRandomEvent(state.era as Era, usedRandomEventIds, random);
    usedRandomEventIds = [...usedRandomEventIds, event.id];
    steps.push({ type: 'random', eventId: event.id });
  }

  if (cardId === 3) steps.push({ type: 'announcement' });
  return { steps, usedRandomEventIds };
}

export function resolveStoryChoice(
  state: GameState,
  choice: Choice,
  random: () => number = Math.random,
): GameState {
  if (state.status !== 'playing' || state.activeStep || state.selectedChoiceId) return state;
  if (!canAffordChoice(choice, state.resources)) return state;

  const card = storyCards[state.cardIndex];
  if (!card) return state;

  const risk = applyChoiceRisk(choice, random);
  const deferred = getDeferredConsequences(card.id, state);
  const delta = combineDeltas(risk.delta, deferred.effects);
  const applied = applyStatDelta(state.resources, state.hidden, delta);
  const scheduled = scheduleStorySteps(state, card.id, choice, applied.resources, random);

  return {
    ...state,
    resources: applied.resources,
    hidden: applied.hidden,
    depletedAfterCrisis: recordRepeatedDepletion(state, applied.resources),
    flags: { ...state.flags, ...choice.flagPatch },
    decisions: [
      ...state.decisions,
      { cardId: card.id, cardTitle: card.title, choiceId: choice.id, summary: choice.summary },
    ],
    echoes: [...state.echoes, ...deferred.echoes],
    usedRandomEventIds: scheduled.usedRandomEventIds,
    selectedChoiceId: choice.id,
    feedback: {
      reaction: risk.reaction,
      delta,
      echoNotes: deferred.notes,
      riskLabel: risk.riskLabel,
    },
    pendingSteps: scheduled.steps,
  };
}

function withAutomaticStepEffect(state: GameState, step: PendingStep): GameState {
  let delta: StatDelta = {};
  let feedback: ChoiceFeedback | null = null;
  let flags = state.flags;
  let echoes = state.echoes;

  if (step.type === 'random') {
    const event = getRandomEvent(step.eventId);
    delta = event.effects;
    feedback = { reaction: event.body, delta, echoNotes: [] };
  }

  if (step.type === 'director') {
    delta = { energy: -1 };
    feedback = {
      reaction: 'Директор спокійно просить пояснити, як ти отримав відповіді. Розмова коротка, але дуже серйозна.',
      delta,
      echoNotes: ['Це наслідок твого рішення у ході 5.'],
    };
    flags = { ...flags, directorVisited: true };
    echoes = [
      ...echoes,
      { sourceCardId: 5, targetCardId: Math.min(TOTAL_STORY_CARDS, state.cardIndex + 2), text: 'Розмова з директором через шахрайство на контрольній.' },
    ];
  }

  if (!feedback) return { ...state, activeStep: step, selectedChoiceId: null, feedback: null };

  const applied = applyStatDelta(state.resources, state.hidden, delta);
  const newCrises = crisisStepsFor(state, applied.resources);
  return {
    ...state,
    activeStep: step,
    selectedChoiceId: null,
    feedback,
    resources: applied.resources,
    hidden: applied.hidden,
    depletedAfterCrisis: recordRepeatedDepletion(state, applied.resources),
    flags,
    echoes,
    pendingSteps: [...newCrises, ...state.pendingSteps],
  };
}

function progressToNextCard(state: GameState): GameState {
  if (state.cardIndex >= TOTAL_STORY_CARDS - 1) {
    return {
      ...state,
      status: 'complete',
      activeStep: null,
      selectedChoiceId: null,
      feedback: null,
      pendingSteps: [],
    };
  }
  return {
    ...state,
    cardIndex: state.cardIndex + 1,
    activeStep: null,
    selectedChoiceId: null,
    feedback: null,
    pendingSteps: [],
  };
}

function openNextStep(state: GameState): GameState {
  const [next, ...rest] = state.pendingSteps;
  if (!next) return progressToNextCard(state);
  return withAutomaticStepEffect({ ...state, pendingSteps: rest }, next);
}

export function advanceGame(state: GameState): GameState {
  if (state.status !== 'playing') return state;

  if (state.activeStep?.type === 'crisis' && !state.selectedChoiceId) return state;

  if (state.activeStep) {
    return state.pendingSteps.length > 0
      ? openNextStep({ ...state, activeStep: null, selectedChoiceId: null, feedback: null })
      : progressToNextCard(state);
  }

  if (!state.selectedChoiceId) return state;
  return state.pendingSteps.length > 0 ? openNextStep(state) : progressToNextCard(state);
}

export function resolveCrisisChoice(
  state: GameState,
  choice: Choice,
  random: () => number = Math.random,
): GameState {
  if (state.activeStep?.type !== 'crisis' || state.selectedChoiceId) return state;
  if (!canAffordChoice(choice, state.resources)) return state;

  const resource = state.activeStep.resource;
  const risk = applyChoiceRisk(choice, random);
  const applied = applyStatDelta(state.resources, state.hidden, risk.delta);
  const activatedCrises = [...new Set([...state.activatedCrises, resource])];
  const stateForCrisisScan = { ...state, activatedCrises };
  const depletedAfterCrisis = recordRepeatedDepletion(stateForCrisisScan, applied.resources);
  const additionalCrises = crisisStepsFor(stateForCrisisScan, applied.resources).filter(
    (step) => step.type !== 'crisis' || !state.pendingSteps.some((pending) => pending.type === 'crisis' && pending.resource === step.resource),
  );

  return {
    ...state,
    resources: applied.resources,
    hidden: applied.hidden,
    activatedCrises,
    depletedAfterCrisis,
    selectedChoiceId: choice.id,
    feedback: { reaction: risk.reaction, delta: risk.delta, echoNotes: [], riskLabel: risk.riskLabel },
    pendingSteps: [...additionalCrises, ...state.pendingSteps],
  };
}

export function getActiveCrisis(state: GameState) {
  return state.activeStep?.type === 'crisis' ? crisisEvents[state.activeStep.resource] : null;
}
