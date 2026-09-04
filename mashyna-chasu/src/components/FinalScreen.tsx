import { ERA_LABELS } from '../data/config';
import { determineFinalProfile, traitPercentages } from '../game/finalProfile';
import type { GameState, ResourceKey, TraitKey } from '../types/game';
import { AppHeader } from './AppHeader';

const traitMeta: Record<TraitKey, { icon: string; label: string }> = {
  creativity: { icon: '🎨', label: 'Креативність' },
  technology: { icon: '🤖', label: 'Технологічність' },
  strategy: { icon: '🧠', label: 'Стратегія' },
  communication: { icon: '🤝', label: 'Комунікація' },
};

const resourceMeta: Record<ResourceKey, { icon: string; label: string }> = {
  knowledge: { icon: '📚', label: 'Знання' },
  friends: { icon: '❤️', label: 'Свої' },
  energy: { icon: '⚡', label: 'Енергія' },
  coins: { icon: '💰', label: 'Монети' },
};

export function FinalScreen({ state, onReplay, onOtherEra }: { state: GameState; onReplay: () => void; onOtherEra: () => void }) {
  const profile = determineFinalProfile(state.hidden);
  const percentages = traitPercentages(state.hidden);
  const decisionIds = new Set([4, 7, 10, 11, 15]);
  const keyDecisions = state.decisions.filter((decision) => decisionIds.has(decision.cardId)).slice(0, 5);
  const echoSummaries = state.echoes.filter(
    (echo, index, all) => all.findIndex((item) => item.sourceCardId === echo.sourceCardId && item.text === echo.text) === index,
  ).slice(-4);

  return (
    <div className={`final-shell era-${state.era}`}>
      <AppHeader />
      <main className="final-main" id="main">
        <section className="profile-hero">
          <span className="kicker">Тиждень завершено · {state.era && ERA_LABELS[state.era]}</span>
          <div className="profile-hero__icon">{profile.icon}</div>
          <p>За твоїми рішеннями тобі найближче…</p>
          <h1>{profile.title}</h1>
          <p className="profile-hero__description">{profile.description}</p>
          <div className="direction-list">{profile.directions.map((item) => <span key={item}>{item}</span>)}</div>
          {profile.courseUrl && <a className="button button--primary" href={profile.courseUrl} target="_blank" rel="noreferrer">Дізнатися про напрям →</a>}
        </section>

        <div className="final-grid">
          <section className="final-card">
            <span className="final-card__number">01</span>
            <h2>Твій стиль рішень</h2>
            <div className="trait-list">
              {(Object.keys(traitMeta) as TraitKey[]).map((key) => (
                <div className="trait-row" key={key}>
                  <span className="trait-row__label">{traitMeta[key].icon} {traitMeta[key].label}</span>
                  <span className="trait-row__bar"><span style={{ width: `${percentages[key]}%` }} /></span>
                  <strong>{state.hidden[key]}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="final-card">
            <span className="final-card__number">02</span>
            <h2>Фінішні ресурси</h2>
            <div className="final-resources">
              {(Object.keys(resourceMeta) as ResourceKey[]).map((key) => (
                <div key={key}><span>{resourceMeta[key].icon}</span><p>{resourceMeta[key].label}</p><strong>{state.resources[key]}{key === 'coins' ? '' : '/10'}</strong></div>
              ))}
            </div>
            {state.depletedAfterCrisis.length > 0 && (
              <p className="support-note">Ти завершив тиждень навіть із виснаженим ресурсом. Це означає, що наступного разу варто раніше помічати момент для паузи або допомоги.</p>
            )}
          </section>

          <section className="final-card final-card--wide">
            <span className="final-card__number">03</span>
            <h2>Рішення, що запамʼяталися</h2>
            <ol className="decision-list">
              {keyDecisions.map((decision) => <li key={decision.cardId}><span>Хід {decision.cardId}</span>{decision.summary}</li>)}
            </ol>
          </section>

          <section className="final-card final-card--wide">
            <span className="final-card__number">04</span>
            <h2>Ехо рішень</h2>
            {echoSummaries.length > 0 ? (
              <ul className="echo-list">{echoSummaries.map((echo, index) => <li key={`${echo.sourceCardId}-${index}`}>⏰ Із ходу {echo.sourceCardId}: {echo.text}</li>)}</ul>
            ) : <p>Твої рішення були прямими й цього разу не створили великих відкладених наслідків.</p>}
          </section>
        </div>

        <section className="final-quote">
          <p>У нас було різне дитинство. Але однакові відчуття.</p>
          <span>І тоді, і зараз хочеться дружити, бути почутими, знайти «своїх» і створювати щось власне.</span>
        </section>
        <div className="final-actions">
          <button className="button button--primary" type="button" onClick={onReplay}>Зіграти ще раз</button>
          <button className="button button--secondary" type="button" onClick={onOtherEra}>Спробувати іншу епоху</button>
        </div>
      </main>
    </div>
  );
}
