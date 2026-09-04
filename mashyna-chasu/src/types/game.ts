export type Era = '2000' | '2026';

export type ResourceKey = 'knowledge' | 'friends' | 'energy' | 'coins';
export type TraitKey = 'creativity' | 'technology' | 'strategy' | 'communication';

export interface ResourceState {
  knowledge: number;
  friends: number;
  energy: number;
  coins: number;
}

export interface HiddenTraits {
  creativity: number;
  technology: number;
  strategy: number;
  communication: number;
}

export type StatDelta = Partial<ResourceState & HiddenTraits>;

export type CharacterId =
  | 'sasha'
  | 'denys'
  | 'halyna'
  | 'olena'
  | 'marko'
  | 'director'
  | 'sashasMother'
  | 'narrator';

export type ProjectApproach = 'self' | 'assisted' | 'ai-helper' | 'copied' | null;

export interface GameFlags {
  lateForCard4: boolean;
  missedHomework: boolean;
  misunderstoodSlang: boolean;
  projectApproach: ProjectApproach;
  cheatedOnTest: boolean;
  befriendedMarko: boolean;
  lentToSasha: number;
  directorVisited: boolean;
}

export interface RiskOutcome {
  successEffects: StatDelta;
  failureEffects: StatDelta;
  successReaction: string;
  failureReaction: string;
}

export interface Choice {
  id: 'A' | 'B' | 'C';
  label: string;
  effects: StatDelta;
  reaction: string;
  summary: string;
  flagPatch?: Partial<GameFlags>;
  risk?: RiskOutcome;
}

export interface EraScene {
  character: CharacterId;
  speaker: string;
  body: string;
  choices: Choice[];
}

export interface StoryCard {
  id: number;
  title: string;
  scenes: Record<Era, EraScene>;
}

export interface RandomEvent {
  id: string;
  era: Era;
  tone: 'positive' | 'negative';
  title: string;
  body: string;
  effects: StatDelta;
}

export interface CrisisEvent {
  id: ResourceKey;
  title: string;
  body: string;
  choices: Choice[];
}

export interface DecisionRecord {
  cardId: number;
  cardTitle: string;
  choiceId: Choice['id'];
  summary: string;
}

export interface EchoRecord {
  sourceCardId: number;
  targetCardId: number;
  text: string;
}

export type PendingStep =
  | { type: 'announcement' }
  | { type: 'random'; eventId: string }
  | { type: 'director' }
  | { type: 'crisis'; resource: ResourceKey };

export interface ChoiceFeedback {
  reaction: string;
  delta: StatDelta;
  echoNotes: string[];
  riskLabel?: string;
}

export interface GameState {
  version: number;
  status: 'start' | 'era-select' | 'playing' | 'complete';
  era: Era | null;
  cardIndex: number;
  resources: ResourceState;
  hidden: HiddenTraits;
  flags: GameFlags;
  usedRandomEventIds: string[];
  activatedCrises: ResourceKey[];
  depletedAfterCrisis: ResourceKey[];
  decisions: DecisionRecord[];
  echoes: EchoRecord[];
  selectedChoiceId: Choice['id'] | null;
  feedback: ChoiceFeedback | null;
  activeStep: PendingStep | null;
  pendingSteps: PendingStep[];
}

export interface FinalProfile {
  id: string;
  title: string;
  icon: string;
  description: string;
  directions: string[];
  courseUrl?: string;
}
