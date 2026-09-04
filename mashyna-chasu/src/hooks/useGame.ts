import { useEffect, useState } from 'react';
import { storyCards } from '../data/storyCards';
import {
  advanceGame,
  createInitialState,
  resolveCrisisChoice,
  resolveStoryChoice,
  startGame,
} from '../game/engine';
import { clearGameState, loadGameState, saveGameState } from '../game/storage';
import type { Choice, Era, GameState } from '../types/game';

export function useGame() {
  const [state, setState] = useState<GameState>(() => createInitialState());
  const [savedGame, setSavedGame] = useState<GameState | null>(() => loadGameState());

  useEffect(() => {
    saveGameState(state);
    if (state.status === 'playing') setSavedGame(state);
    if (state.status === 'complete') setSavedGame(null);
  }, [state]);

  const showEraSelect = () => setState(createInitialState('era-select'));
  const chooseEra = (era: Era) => setState(startGame(era));
  const continueGame = () => savedGame && setState(savedGame);
  const chooseStory = (choice: Choice) => setState((current) => resolveStoryChoice(current, choice));
  const chooseCrisis = (choice: Choice) => setState((current) => resolveCrisisChoice(current, choice));
  const advance = () => setState((current) => advanceGame(current));

  const restart = (confirm = true) => {
    if (confirm && !window.confirm('Почати проходження спочатку? Поточний прогрес буде стерто.')) return;
    clearGameState();
    setSavedGame(null);
    setState(createInitialState());
  };

  const replaySameEra = () => state.era && setState(startGame(state.era));
  const tryOtherEra = () => {
    clearGameState();
    setSavedGame(null);
    setState(createInitialState('era-select'));
  };

  return {
    state,
    savedGame,
    currentCard: storyCards[state.cardIndex],
    showEraSelect,
    chooseEra,
    continueGame,
    chooseStory,
    chooseCrisis,
    advance,
    restart,
    replaySameEra,
    tryOtherEra,
  };
}
