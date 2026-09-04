import { useEffect } from 'react';
import { AppHeader } from './components/AppHeader';
import { EraSelect } from './components/EraSelect';
import { FinalScreen } from './components/FinalScreen';
import { InterstitialScreen } from './components/InterstitialScreen';
import { ResourcePanel } from './components/ResourcePanel';
import { StartScreen } from './components/StartScreen';
import { StoryScreen } from './components/StoryScreen';
import { useGame } from './hooks/useGame';

export default function App() {
  const game = useGame();
  const { state } = game;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [state.status, state.cardIndex, state.activeStep]);

  if (state.status === 'start') {
    return (
      <StartScreen
        hasSave={Boolean(game.savedGame)}
        onStart={game.showEraSelect}
        onContinue={game.continueGame}
        onClearSave={() => game.restart(true)}
      />
    );
  }

  if (state.status === 'era-select') {
    return <EraSelect onSelect={game.chooseEra} onBack={() => game.restart(false)} />;
  }

  if (state.status === 'complete') {
    return <FinalScreen state={state} onReplay={game.replaySameEra} onOtherEra={game.tryOtherEra} />;
  }

  return (
    <div className={`game-shell era-${state.era}`}>
      <AppHeader showReset onReset={() => game.restart(true)} />
      <ResourcePanel resources={state.resources} delta={state.feedback?.delta} />
      {state.activeStep ? (
        <InterstitialScreen state={state} onChooseCrisis={game.chooseCrisis} onNext={game.advance} />
      ) : (
        <StoryScreen state={state} card={game.currentCard} onChoose={game.chooseStory} onNext={game.advance} />
      )}
    </div>
  );
}
