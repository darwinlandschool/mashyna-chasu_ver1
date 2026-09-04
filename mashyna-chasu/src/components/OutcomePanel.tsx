import type { ChoiceFeedback, ResourceKey } from '../types/game';

const visibleMeta: Record<ResourceKey, string> = {
  knowledge: '📚',
  friends: '❤️',
  energy: '⚡',
  coins: '💰',
};

export function OutcomePanel({ feedback }: { feedback: ChoiceFeedback }) {
  const visibleChanges = (Object.keys(visibleMeta) as ResourceKey[]).filter((key) => (feedback.delta[key] ?? 0) !== 0);
  return (
    <div className="outcome" role="status" aria-live="polite">
      <div className="outcome__eyebrow">Наслідок</div>
      <p>{feedback.reaction}</p>
      {feedback.riskLabel && <span className="risk-label">{feedback.riskLabel}</span>}
      {visibleChanges.length > 0 && (
        <div className="outcome__deltas" aria-label="Зміни ресурсів">
          {visibleChanges.map((key) => {
            const value = feedback.delta[key] ?? 0;
            return <span key={key} className={value > 0 ? 'delta-up' : 'delta-down'}>{visibleMeta[key]} {value > 0 ? '+' : ''}{value}</span>;
          })}
        </div>
      )}
      {feedback.echoNotes.map((note) => <p className="echo-note" key={note}>⏰ {note}</p>)}
      <p className="style-forming">Твій стиль гри формується.</p>
    </div>
  );
}
