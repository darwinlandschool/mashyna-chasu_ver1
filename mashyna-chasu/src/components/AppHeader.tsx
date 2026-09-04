import { BrandMark } from './BrandMark';

interface AppHeaderProps {
  showReset?: boolean;
  onReset?: () => void;
}

export function AppHeader({ showReset = false, onReset }: AppHeaderProps) {
  return (
    <header className="app-header">
      <a className="app-header__title" href="#main" aria-label="До основного вмісту">
        <span className="app-header__clock" aria-hidden="true">↺</span>
        <span>Машина часу</span>
      </a>
      <BrandMark />
      {showReset && (
        <button className="button button--quiet app-header__reset" type="button" onClick={onReset}>
          Почати спочатку
        </button>
      )}
    </header>
  );
}
