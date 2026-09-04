import { finalProfiles } from '../data/finalProfiles';
import type { FinalProfile, HiddenTraits, TraitKey } from '../types/game';

const PAIR_PROFILES: Record<string, keyof typeof finalProfiles> = {
  'creativity|technology': 'techCreator',
  'strategy|technology': 'digitalArchitect',
  'communication|creativity': 'visualStoryteller',
  'communication|strategy': 'teamStrategist',
};

export function determineFinalProfile(traits: HiddenTraits): FinalProfile {
  const ranked = (Object.entries(traits) as [TraitKey, number][]).sort(
    ([keyA, valueA], [keyB, valueB]) => valueB - valueA || keyA.localeCompare(keyB),
  );
  const [, highest] = ranked[0];
  const [, second] = ranked[1];
  const lowest = ranked[ranked.length - 1][1];

  if (highest - lowest <= 2) return finalProfiles.universalExplorer;

  const [topKey] = ranked[0];
  if (highest - second >= 3 && topKey === 'technology') return finalProfiles.techExplorer;
  if (highest - second >= 3 && topKey === 'creativity') return finalProfiles.ideaGenerator;

  const pairKey = [ranked[0][0], ranked[1][0]].sort().join('|');
  const profileId = PAIR_PROFILES[pairKey];
  return profileId ? finalProfiles[profileId] : finalProfiles.universalExplorer;
}

export function traitPercentages(traits: HiddenTraits): Record<TraitKey, number> {
  const positiveValues = Object.values(traits).map((value) => Math.max(0, value));
  const max = Math.max(1, ...positiveValues);
  return {
    creativity: Math.round((Math.max(0, traits.creativity) / max) * 100),
    technology: Math.round((Math.max(0, traits.technology) / max) * 100),
    strategy: Math.round((Math.max(0, traits.strategy) / max) * 100),
    communication: Math.round((Math.max(0, traits.communication) / max) * 100),
  };
}
