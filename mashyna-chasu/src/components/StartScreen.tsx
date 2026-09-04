import { AppHeader } from './AppHeader';

interface StartScreenProps {
  hasSave: boolean;
  onStart: () => void;
  onContinue: () => void;
  onClearSave: () => void;
}

export function StartScreen({ hasSave, onStart, onContinue, onClearSave }: StartScreenProps) {
  return (
    <div className="landing-shell">
      <AppHeader />
      <main className="start-screen" id="main">
        <section className="hero-card">
          <div className="hero-card__copy">
            <span className="kicker">Інтерактивна історія · 15 рішень</span>
            <h1>Машина<br /><span>часу</span></h1>
            <p className="hero-card__subtitle">Проживи тиждень у школі іншого покоління</p>
            <p className="hero-card__description">Обирай, як діяти, стеж за Знаннями, Своїми, Енергією та Монетами — і дізнайся, який стиль рішень у тебе найсильніший.</p>
            <div className="hero-card__actions">
              {hasSave && <button className="button button--primary" type="button" onClick={onContinue}>Продовжити</button>}
              <button className={`button ${hasSave ? 'button--secondary' : 'button--primary'}`} type="button" onClick={onStart}>Почати гру</button>
              {hasSave && <button className="button button--text" type="button" onClick={onClearSave}>Почати спочатку</button>}
            </div>
          </div>
          <div className="hero-machine" aria-label="Машина часу" role="img">
            <span className="hero-machine__orbit hero-machine__orbit--one" />
            <span className="hero-machine__orbit hero-machine__orbit--two" />
            <span className="hero-machine__core">2000<br /><b>↺</b><br />2026</span>
            <span className="brand-spark brand-spark--one" aria-hidden="true" />
            <span className="brand-spark brand-spark--two" aria-hidden="true" />
          </div>
        </section>
        <section className="mechanic-strip" aria-label="Як грати">
          <div><span>01</span><p><strong>Обери епоху</strong><br />Паперову чи цифрову</p></div>
          <div><span>02</span><p><strong>Приймай рішення</strong><br />Деякі відгукнуться згодом</p></div>
          <div><span>03</span><p><strong>Відкрий свій профіль</strong><br />Приховані риси — у фіналі</p></div>
        </section>
      </main>
    </div>
  );
}
