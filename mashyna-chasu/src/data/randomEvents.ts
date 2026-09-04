import type { Era, RandomEvent } from '../types/game';

export const randomEvents: RandomEvent[] = [
  {
    id: '2000-teacher-sick',
    era: '2000',
    tone: 'positive',
    title: 'Ура! Учитель захворів',
    body: 'Сьогодні контрольної не буде. Зошити можна сховати.',
    effects: { energy: 2 },
  },
  {
    id: '2000-new-game-disc',
    era: '2000',
    tone: 'positive',
    title: 'Друг приніс диск із новою грою',
    body: 'На перерві навколо коробки збирається пів класу.',
    effects: { friends: 2 },
  },
  {
    id: '2000-missed-cartoon',
    era: '2000',
    tone: 'negative',
    title: 'Ти пропустив улюблений мультфільм',
    body: 'Повтору сьогодні не буде. Так, у 2000 році це справжня трагедія.',
    effects: { energy: -2 },
  },
  {
    id: '2000-busy-phone-line',
    era: '2000',
    tone: 'negative',
    title: 'Інтернет зайняв телефонну лінію',
    body: 'Мама не може додзвонитися, а модем продовжує співати свою дивну пісню.',
    effects: { friends: -1 },
  },
  {
    id: '2000-floppy-failed',
    era: '2000',
    tone: 'negative',
    title: 'Дискета не читається',
    body: 'Твій реферат… був саме на ній.',
    effects: { knowledge: -2 },
  },
  {
    id: '2026-canva-autosave',
    era: '2026',
    tone: 'positive',
    title: 'Canva автоматично зберегла проєкт',
    body: 'Ти був упевнений, що все втрачено. Історія версій каже: ні.',
    effects: { knowledge: 2 },
  },
  {
    id: '2026-ai-found-error',
    era: '2026',
    tone: 'positive',
    title: 'ШІ допоміг знайти помилку',
    body: 'Ти перевіряєш підказку — цього разу вона точна.',
    effects: { knowledge: 1, technology: 1 },
  },
  {
    id: '2026-blogger-replied',
    era: '2026',
    tone: 'positive',
    title: 'Улюблений блогер відповів',
    body: 'Так, це справжня відповідь. Так, ти перечитав її пʼять разів.',
    effects: { energy: 2 },
  },
  {
    id: '2026-wifi-down',
    era: '2026',
    tone: 'negative',
    title: 'Wi-Fi зник перед дедлайном',
    body: 'До здачі презентації пʼять хвилин. Роутер загадково блимає.',
    effects: { knowledge: -2 },
  },
  {
    id: '2026-ai-hallucination',
    era: '2026',
    tone: 'negative',
    title: 'ШІ впевнено вигадав факт',
    body: 'Звучало переконливо. Перевірка джерел — не погодилася.',
    effects: { knowledge: -2 },
  },
  {
    id: '2026-wrong-chat',
    era: '2026',
    tone: 'negative',
    title: 'Повідомлення пішло не в той чат',
    body: 'Три крапки зʼявилися одразу в кількох людей. Ой.',
    effects: { friends: -2 },
  },
];

export function pickRandomEvent(
  era: Era,
  usedIds: string[],
  random: () => number = Math.random,
): RandomEvent {
  const available = randomEvents.filter((event) => event.era === era && !usedIds.includes(event.id));
  if (available.length === 0) {
    throw new Error(`Немає доступних випадкових подій для епохи ${era}`);
  }
  return available[Math.floor(random() * available.length)] ?? available[0];
}

export function getRandomEvent(id: string): RandomEvent {
  const event = randomEvents.find((item) => item.id === id);
  if (!event) throw new Error(`Невідома випадкова подія: ${id}`);
  return event;
}
