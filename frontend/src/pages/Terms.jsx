import TermsContent from '../components/terms/TermsContent';
import TermsHero from '../components/terms/TermsHero';

export default function Terms() {
  return (
    <main className="relative scroll-smooth bg-[var(--bg-page)]">
      <TermsHero />
      <TermsContent />
    </main>
  );
}
