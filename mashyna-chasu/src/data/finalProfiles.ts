import { COURSE_URLS } from './profileLinks';
import type { FinalProfile } from '../types/game';

export const finalProfiles: Record<string, FinalProfile> = {
  techCreator: {
    id: 'techCreator',
    title: 'Технокреатор',
    icon: '🚀',
    description: 'Ти поєднуєш уяву з цифровими інструментами й умієш перетворювати ідею на щось, що можна побачити та спробувати.',
    directions: ['Геймдизайн', 'ШІ'],
    courseUrl: COURSE_URLS.techCreator,
  },
  digitalArchitect: {
    id: 'digitalArchitect',
    title: 'Архітектор цифрових світів',
    icon: '🎮',
    description: 'Ти любиш розуміти, як усе влаштовано, і знаходиш технологіям продумане застосування.',
    directions: ['Roblox', 'Розробка', 'ШІ', 'Web'],
    courseUrl: COURSE_URLS.digitalArchitect,
  },
  visualStoryteller: {
    id: 'visualStoryteller',
    title: 'Візуальний сторітелер',
    icon: '✨',
    description: 'Ти помічаєш емоції, образи й деталі та вмієш через них розповідати історії іншим.',
    directions: ['Цифрове малювання', 'Геймдизайн'],
    courseUrl: COURSE_URLS.visualStoryteller,
  },
  teamStrategist: {
    id: 'teamStrategist',
    title: 'Командний стратег',
    icon: '🧭',
    description: 'Ти вмієш домовлятися, рахувати наслідки й допомагати команді рухатися до спільної мети.',
    directions: ['Фінансова грамотність', 'Командні проєкти'],
    courseUrl: COURSE_URLS.teamStrategist,
  },
  techExplorer: {
    id: 'techExplorer',
    title: 'Технодослідник',
    icon: '🤖',
    description: 'Ти сміливо тестуєш нові інструменти й швидко вчишся відрізняти корисну технологію від красивої обіцянки.',
    directions: ['ШІ'],
    courseUrl: COURSE_URLS.techExplorer,
  },
  ideaGenerator: {
    id: 'ideaGenerator',
    title: 'Генератор ідей',
    icon: '🎨',
    description: 'Ти легко знаходиш неочевидні ходи й додаєш власний характер навіть звичайному завданню.',
    directions: ['Малювання', 'Дизайн'],
    courseUrl: COURSE_URLS.ideaGenerator,
  },
  universalExplorer: {
    id: 'universalExplorer',
    title: 'Універсальний дослідник',
    icon: '🌟',
    description: 'Ти гнучко перемикаєшся між ідеями, технологіями, плануванням і спілкуванням. Це сильна база, щоб спробувати кілька напрямів.',
    directions: ['Геймдизайн', 'Цифрові проєкти'],
    courseUrl: COURSE_URLS.universalExplorer,
  },
};
