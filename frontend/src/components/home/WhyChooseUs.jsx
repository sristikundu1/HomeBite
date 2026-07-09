import { motion } from 'framer-motion';
import { BadgeCheck, Clock3, HandCoins, HeartHandshake, ShieldCheck, Sprout } from 'lucide-react';

const features = [
  {
    title: 'Fresh ingredients',
    description: 'Every meal is prepared with seasonal ingredients and carefully sourced produce.',
    icon: Sprout
  },
  {
    title: 'Trusted home chefs',
    description: 'Discover verified cooks with strong reviews, hospitality, and local reputation.',
    icon: BadgeCheck
  },
  {
    title: 'Fast delivery',
    description: 'Hot, fresh meals arrive quickly from nearby kitchens with dependable service.',
    icon: Clock3
  },
  {
    title: 'Affordable pricing',
    description: 'Enjoy premium home-cooked food without the premium price tag.',
    icon: HandCoins
  },
  {
    title: 'Secure payment',
    description: 'Safe, simple checkout with encrypted payments and trusted transactions.',
    icon: ShieldCheck
  },
  {
    title: 'Community driven',
    description: 'Support local cooks and be part of a warm, connected food community.',
    icon: HeartHandshake
  }
];

function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-muted)] py-24" id="why-choose-us">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
            Why people choose HomeBite
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Because every meal feels personal, local, and thoughtfully made.
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.07, ease: 'easeOut' }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="rounded-[32px] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon size={28} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">{feature.title}</h3>
                <p className="mt-3 text-base leading-8 text-[var(--text-secondary)]">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
