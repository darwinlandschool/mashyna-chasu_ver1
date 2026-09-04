import type { ResourceKey, ResourceState, StatDelta } from '../types/game';

const resourceMeta: Record<ResourceKey, { icon: string; label: string }> = {
  knowledge: { icon: '📚', label: 'Знання' },
  friends: { icon: '❤️', label: 'Свої' },
  energy: { icon: '⚡', label: 'Енергія' },
  coins: { icon: '💰', label: 'Монети' },
};

export function ResourcePanel({ resources, delta }: { resources: ResourceState; delta?: StatDelta }) {
  return (
    <section className="resources" aria-label="Ресурси гравця">
      {(Object.keys(resourceMeta) as ResourceKey[]).map((key) => {
        const change = delta?.[key] ?? 0;
        const max = key === 'coins' ? Math.max(10, resources.coins) : 10;
        return (
          <div className={`resource ${change > 0 ? 'resource--up' : ''} ${change < 0 ? 'resource--down' : ''}`} key={`${key}-${resources[key]}`}>
            <span className="resource__icon" aria-hidden="true">{resourceMeta[key].icon}</span>
            <span className="resource__copy">
              <span className="resource__label">{resourceMeta[key].label}</span>
              <span className="resource__track" aria-hidden="true">
                <span style={{ width: `${Math.min(100, (resources[key] / max) * 100)}%` }} />
              </span>
            </span>
            <strong>{resources[key]}{key === 'coins' ? '' : '/10'}</strong>
            {change !== 0 && <span className="resource__delta" aria-label={`Зміна ${change > 0 ? 'плюс' : 'мінус'} ${Math.abs(change)}`}>{change > 0 ? '+' : ''}{change}</span>}
          </div>
        );
      })}
    </section>
  );
}
