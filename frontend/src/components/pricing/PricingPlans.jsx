import { motion } from 'framer-motion';
import { Check, ChefHat, Star, Users } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    cadence: '/mo',
    description: 'For discovering local meals and ordering occasionally.',
    icon: ChefHat,
    features: ['Browse local home chefs', 'Standard ordering', 'Saved favorites', 'Community ratings'],
    cta: 'Start Free'
  },
  {
    name: 'Family',
    price: '$9',
    cadence: '/mo',
    description: 'For households ordering fresh homemade meals weekly.',
    icon: Users,
    popular: true,
    features: ['Everything in Starter', 'Family meal bundles', 'Priority delivery windows', 'Weekly meal reminders', 'Member-only chef picks'],
    cta: 'Choose Family'
  },
  {
    name: 'Premium',
    price: '$19',
    cadence: '/mo',
    description: 'For food lovers who want the best HomeBite experience.',
    icon: Star,
    features: ['Everything in Family', 'Premium chef access', 'Concierge order support', 'Special occasion menus', 'Exclusive seasonal tastings'],
    cta: 'Go Premium'
  }
];

export default function PricingPlans() {
  return (
    <section id="plans" className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Plans</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            Pick the plan that fits your table.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const Icon = plan.icon;

            return (
              <motion.article
                key={plan.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.58, delay: index * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -10, scale: 1.01 }}
                className={`relative rounded-[2rem] border bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-elevated)] ${
                  plan.popular ? 'border-[var(--accent)]' : 'border-[var(--border)]'
                }`}
              >
                {plan.popular && (
                  <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-orange-500/20">
                    Popular
                  </span>
                )}
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--bg-muted)] text-[var(--accent)]">
                  <Icon size={30} />
                </div>
                <h3 className="mt-8 text-2xl font-semibold tracking-normal text-[var(--text-primary)]">{plan.name}</h3>
                <p className="mt-3 min-h-[56px] text-base leading-7 text-[var(--text-secondary)]">{plan.description}</p>
                <div className="mt-8 flex items-end gap-1">
                  <span className="text-5xl font-semibold tracking-normal text-[var(--text-primary)]">{plan.price}</span>
                  <span className="pb-2 text-base font-medium text-[var(--text-muted)]">{plan.cadence}</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm leading-6 text-[var(--text-secondary)]">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                        <Check size={14} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.a
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  href="/register"
                  className={`mt-9 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-sm font-semibold transition duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/25 hover:brightness-110'
                      : 'border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                  }`}
                >
                  {plan.cta}
                </motion.a>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
