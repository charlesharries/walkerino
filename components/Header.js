import Auth from './Auth';
import UnitsSelector from './UnitsSelector';

export default function Header() {
  return (
    <header>
      <nav>
        <Auth />

        <UnitsSelector />
      </nav>
    </header>
  );
}
