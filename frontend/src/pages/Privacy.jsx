import PrivacyContent from '../components/privacy/PrivacyContent';
import PrivacyHero from '../components/privacy/PrivacyHero';

export default function Privacy() {
  return (
    <main className="relative scroll-smooth bg-[var(--bg-page)]">
      <PrivacyHero />
      <PrivacyContent />
    </main>
  );
}
