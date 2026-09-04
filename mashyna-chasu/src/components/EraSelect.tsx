import type { Era } from '../types/game';
import { AppHeader } from './AppHeader';

export function EraSelect({ onSelect, onBack }: { onSelect: (era: Era) => void; onBack: () => void }) {
  return (
    <div className="landing-shell">
      <AppHeader />
      <main className="era-screen" id="main">
        <button className="back-link" type="button" onClick={onBack}>← На старт</button>
        <div className="section-heading">
          <span className="kicker">Куди прямуємо?</span>
          <h1>Обери свою школу</h1>
          <p>Епоха змінить ситуації, жарти, предмети та частину наслідків.</p>
        </div>
        <div className="era-grid">
          <button className="era-card era-card--2000" type="button" onClick={() => onSelect('2000')}>
            <span className="era-card__year">2000</span>
            <span className="era-card__icon" aria-hidden="true">📼</span>
            <strong>Школа 2000 року</strong>
            <span>Щоденники, диски, кнопкові телефони й розмови наживо.</span>
            <span className="era-card__tags">💿 Дискета · ☎️ Домашній телефон · 📝 Записка</span>
            <span className="era-card__cta">Вирушити у 2000 →</span>
          </button>
          <button className="era-card era-card--2026" type="button" onClick={() => onSelect('2026')}>
            <span className="era-card__year">2026</span>
            <span className="era-card__icon" aria-hidden="true">📱</span>
            <strong>Школа 2026 року</strong>
            <span>Смартфони, чати, Canva, ШІ та цифрові проєкти.</span>
            <span className="era-card__tags">🤖 ШІ · 🎨 Canva · 💬 Чати</span>
            <span className="era-card__cta">Вирушити у 2026 →</span>
          </button>
        </div>
      </main>
    </div>
  );
}
