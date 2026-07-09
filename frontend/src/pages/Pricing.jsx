import PricingHero from '../components/pricing/PricingHero';
import PricingPlans from '../components/pricing/PricingPlans';
import ComparisonTable from '../components/pricing/ComparisonTable';
import PricingFAQ from '../components/pricing/PricingFAQ';
import PricingCTA from '../components/pricing/PricingCTA';

export default function Pricing() {
  return (
    <main className="relative overflow-x-hidden bg-[var(--bg-page)]">
      <PricingHero />
      <PricingPlans />
      <ComparisonTable />
      <PricingFAQ />
      <PricingCTA />
    </main>
  );
}
