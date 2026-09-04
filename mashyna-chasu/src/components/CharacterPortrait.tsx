import { useState } from 'react';
import { characters } from '../data/characters';
import type { CharacterId } from '../types/game';

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export function CharacterPortrait({ character }: { character: CharacterId }) {
  const item = characters[character];
  const [loaded, setLoaded] = useState(false);
  if (!item.image) {
    return (
      <div className="portrait portrait--time" role="img" aria-label={item.alt}>
        <span className="time-orbit time-orbit--one" />
        <span className="time-orbit time-orbit--two" />
        <span className="time-core">↺</span>
      </div>
    );
  }
  return (
    <figure className={`portrait ${loaded ? 'portrait--loaded' : 'portrait--loading'}`}>
      <span className="portrait__placeholder" aria-hidden="true">
        <span>⏳</span>
        Портрет завантажується
      </span>
      <img
        key={item.image}
        src={assetUrl(item.image)}
        alt={item.alt}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
        onError={(event) => {
          if (!item.fallbackImage) return;
          const fallback = new URL(assetUrl(item.fallbackImage), window.location.href).href;
          if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
        }}
      />
    </figure>
  );
}
