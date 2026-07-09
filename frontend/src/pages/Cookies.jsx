import CookiesContent from '../components/cookies/CookiesContent';
import CookiesHero from '../components/cookies/CookiesHero';

export default function Cookies() {
  return (
    <main className="relative scroll-smooth bg-[var(--bg-page)]">
      <CookiesHero />
      <CookiesContent />
    </main>
  );
}
