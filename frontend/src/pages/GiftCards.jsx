import GiftCardsCTA from '../components/giftcards/GiftCardsCTA';
import GiftCardsFAQ from '../components/giftcards/GiftCardsFAQ';
import GiftCardsHero from '../components/giftcards/GiftCardsHero';
import GiftCardShowcase from '../components/giftcards/GiftCardShowcase';
import GiftOptions from '../components/giftcards/GiftOptions';
import HowItWorks from '../components/giftcards/HowItWorks';

export default function GiftCards() {
  return (
    <main className="relative overflow-x-hidden bg-[var(--bg-page)]">
      <GiftCardsHero />
      <GiftCardShowcase />
      <HowItWorks />
      <GiftOptions />
      <GiftCardsFAQ />
      <GiftCardsCTA />
    </main>
  );
}
