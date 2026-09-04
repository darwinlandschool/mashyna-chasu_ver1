import { describe, expect, it } from 'vitest';
import { determineFinalProfile } from './finalProfile';

describe('фінальний профіль', () => {
  it('визначає парні профілі незалежно від того, яка риса в парі перша', () => {
    expect(determineFinalProfile({ creativity: 6, technology: 5, strategy: 0, communication: 0 }).title).toBe('Технокреатор');
    expect(determineFinalProfile({ creativity: 5, technology: 6, strategy: 0, communication: 0 }).title).toBe('Технокреатор');
    expect(determineFinalProfile({ creativity: 0, technology: 6, strategy: 5, communication: 0 }).title).toBe('Архітектор цифрових світів');
    expect(determineFinalProfile({ creativity: 6, technology: 0, strategy: 0, communication: 5 }).title).toBe('Візуальний сторітелер');
    expect(determineFinalProfile({ creativity: 0, technology: 0, strategy: 6, communication: 5 }).title).toBe('Командний стратег');
  });

  it('визначає одиночний профіль за відриву щонайменше 3 бали', () => {
    expect(determineFinalProfile({ creativity: 1, technology: 8, strategy: 5, communication: 2 }).title).toBe('Технодослідник');
    expect(determineFinalProfile({ creativity: 8, technology: 3, strategy: 5, communication: 2 }).title).toBe('Генератор ідей');
  });

  it('визначає збалансований профіль за різниці не більше 2 балів', () => {
    expect(determineFinalProfile({ creativity: 4, technology: 3, strategy: 2, communication: 3 }).title).toBe('Універсальний дослідник');
  });
});
