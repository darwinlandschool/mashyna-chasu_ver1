import { crisisEvents } from '../data/crises';
import { getRandomEvent } from '../data/randomEvents';
import type { Choice, GameState } from '../types/game';
import { CharacterPortrait } from './CharacterPortrait';
import { ChoiceList } from './ChoiceList';
import { OutcomePanel } from './OutcomePanel';

interface InterstitialScreenProps {
  state: GameState;
  onChooseCrisis: (choice: Choice) => void;
  onNext: () => void;
}

const announcementBody =
  'Класний керівник оголошує:\n\n«Через декілька днів у школі буде День майбутнього. Кожна команда має представити, якою буде школа через 20 років. Це важлива подія у житті школи, до якої ми готуватимемося на всіх уроках. Наприкінці вас оцінюватиме журі, тож поставтеся до цього відповідально».\n\nВелика історія цього тижня починається просто зараз.';

export function InterstitialScreen({ state, onChooseCrisis, onNext }: InterstitialScreenProps) {
  const step = state.activeStep;
  if (!step) return null;

  if (step.type === 'crisis') {
    const crisis = crisisEvents[step.resource];
    return (
      <main className="interstitial-main" id="main">
        <article className="interstitial-card interstitial-card--crisis">
          <div className="interstitial-card__icon">🚨</div>
          <span className="kicker">Кризова ситуація</span>
          <h1>{crisis.title}</h1>
          <p>{crisis.body}</p>
          <ChoiceList choices={crisis.choices} resources={state.resources} selectedId={state.selectedChoiceId} onChoose={onChooseCrisis} />
          {state.feedback && (
            <>
              <OutcomePanel feedback={state.feedback} />
              <button className="button button--primary button--next" type="button" onClick={onNext}>Продовжити історію →</button>
            </>
          )}
        </article>
      </main>
    );
  }

  if (step.type === 'announcement') {
    return (
      <main className="interstitial-main" id="main">
        <article className="interstitial-card interstitial-card--announcement">
          <CharacterPortrait character="narrator" />
          <span className="kicker">Сюжетне повідомлення</span>
          <h1>Проєкт «Школа майбутнього»</h1>
          <p className="preline">{announcementBody}</p>
          <button className="button button--primary button--next" type="button" onClick={onNext}>До завдання →</button>
        </article>
      </main>
    );
  }

  if (step.type === 'director') {
    return (
      <main className="interstitial-main" id="main">
        <article className="interstitial-card interstitial-card--director">
          <CharacterPortrait character="director" />
          <span className="kicker">Серйозна розмова</span>
          <h1>Виклик до директора</h1>
          {state.feedback && <OutcomePanel feedback={state.feedback} />}
          <button className="button button--primary button--next" type="button" onClick={onNext}>Повернутися до історії →</button>
        </article>
      </main>
    );
  }

  const event = getRandomEvent(step.eventId);
  return (
    <main className="interstitial-main" id="main">
      <article className={`interstitial-card interstitial-card--event interstitial-card--${event.tone}`}>
        <div className="interstitial-card__icon">{event.tone === 'positive' ? '🍀' : '⚡'}</div>
        <span className="kicker">Випадкова подія</span>
        <h1>{event.title}</h1>
        {state.feedback && <OutcomePanel feedback={state.feedback} />}
        <button className="button button--primary button--next" type="button" onClick={onNext}>Далі →</button>
      </article>
    </main>
  );
}
