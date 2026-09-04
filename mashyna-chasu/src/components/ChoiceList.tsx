import { canAffordChoice } from '../game/engine';
import type { Choice, ResourceState } from '../types/game';

interface ChoiceListProps {
  choices: Choice[];
  resources: ResourceState;
  selectedId: Choice['id'] | null;
  onChoose: (choice: Choice) => void;
}

export function ChoiceList({ choices, resources, selectedId, onChoose }: ChoiceListProps) {
  return (
    <div className="choices" aria-label="Варіанти вибору">
      {choices.map((choice) => {
        const affordable = canAffordChoice(choice, resources);
        const locked = selectedId !== null;
        const selected = selectedId === choice.id;
        const missing = Math.max(0, -(choice.effects.coins ?? 0) - resources.coins);
        return (
          <div className={`choice-wrap ${locked && !selected ? 'choice-wrap--collapsed' : ''}`} key={choice.id}>
            <button
              className={`choice-button ${selected ? 'choice-button--selected' : ''}`}
              type="button"
              onClick={() => onChoose(choice)}
              disabled={locked || !affordable}
              aria-pressed={selected}
            >
              <span className="choice-button__letter">{choice.id}</span>
              <span>{choice.label}</span>
            </button>
            {!affordable && !locked && <small className="choice-hint">Не вистачає {missing} монет</small>}
          </div>
        );
      })}
    </div>
  );
}
