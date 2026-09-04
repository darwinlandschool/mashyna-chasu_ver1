import type { CharacterId } from '../types/game';

interface CharacterAsset {
  name: string;
  image?: string;
  fallbackImage?: string;
  alt: string;
}

export const characters: Record<CharacterId, CharacterAsset> = {
  sasha: { name: 'Саша', image: 'assets/characters/sasha.jpg', fallbackImage: 'assets/characters/sasha.png', alt: 'Портрет Саші' },
  denys: { name: 'Денис', image: 'assets/characters/denys.jpg', fallbackImage: 'assets/characters/denys.png', alt: 'Портрет Дениса' },
  halyna: { name: 'Пані Галина', image: 'assets/characters/halyna.jpg', fallbackImage: 'assets/characters/halyna.png', alt: 'Портрет пані Галини' },
  olena: { name: 'Пані Олена', image: 'assets/characters/olena.jpg', fallbackImage: 'assets/characters/olena.png', alt: 'Портрет пані Олени' },
  marko: { name: 'Марко', image: 'assets/characters/marko.jpg', fallbackImage: 'assets/characters/marko.png', alt: 'Портрет Марка' },
  director: { name: 'Директор', image: 'assets/characters/director.jpg', fallbackImage: 'assets/characters/director.png', alt: 'Портрет директора' },
  sashasMother: { name: 'Мама Саші', image: 'assets/characters/sashas-mother.jpg', fallbackImage: 'assets/characters/sashas-mother.png', alt: 'Портрет мами Саші' },
  narrator: { name: 'Машина часу', alt: 'Символ машини часу' },
};
