import { useEffect, useRef } from 'react';
import { ERA_LABELS, TOTAL_STORY_CARDS } from '../data/config';
import { getDeferredContextNotes } from '../game/deferredEffects';
import type { Choice, GameState, StoryCard } from '../types/game';
import { CharacterPortrait } from './CharacterPortrait';
import { ChoiceList } from './ChoiceList';
import { OutcomePanel } from './OutcomePanel';

interface StoryScreenProps {
  state: GameState;
  card: StoryCard;
  onChoose: (choice: Choice) => void;
  onNext: () => void;
}

export function StoryScreen({ state, card, onChoose, onNext }: StoryScreenProps) {
  const resolutionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.feedback) return;
    const frame = window.requestAnimationFrame(() => {
      resolutionRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'nearest',
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state.feedback]);

  if (!state.era) return null;
  const scene = card.scenes[state.era];
  const contextNotes = getDeferredContextNotes(card.id, state);
  return (
    <main className="game-main" id="main">
      <div className="story-meta">
        <span>Хід {card.id} із {TOTAL_STORY_CARDS}</span>
        <span className="era-pill">{state.era === '2000' ? '📼' : '📱'} {ERA_LABELS[state.era]}</span>
      </div>
      <article className={`story-card ${state.feedback ? 'story-card--answered' : ''}`} key={`${state.era}-${card.id}`}>
        <div className="story-card__portrait">
          <CharacterPortrait character={scene.character} />
          <span className="speaker-chip">{scene.speaker}</span>
        </div>
        <div className="story-card__content">
          <div className="story-card__number">{String(card.id).padStart(2, '0')}</div>
          <h1>{card.title}</h1>
          {contextNotes.map((note) => <p className="context-echo" key={note}>⏰ {note}</p>)}
          <p className="story-copy">{scene.body}</p>
          <ChoiceList choices={scene.choices} resources={state.resources} selectedId={state.selectedChoiceId} onChoose={onChoose} />
          {state.feedback && (
            <div className="story-resolution" ref={resolutionRef}>
              <OutcomePanel feedback={state.feedback} />
              <button className="button button--primary button--next" type="button" onClick={onNext}>Далі <span aria-hidden="true">→</span></button>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
