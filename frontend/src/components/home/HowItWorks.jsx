import { motion } from 'framer-motion';
import { ArrowRight, Compass, ShoppingBag, Sparkles } from 'lucide-react';

const steps = [
  {
    title: 'Browse Meals',
    description: 'Explore premium meals from trusted local cooks in your neighborhood.',
    icon: Compass
  },
  {
    title: 'Place Order',
    description: 'Choose your favorites, set your time, and secure your meal in seconds.',
    icon: ShoppingBag
  },
  {
    title: 'Enjoy Homemade Food',
    description: 'Receive a warm, freshly prepared meal and enjoy the comfort of home.',
    icon: Sparkles
  }
];

function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-page)] py-24" id="how-it-works">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
            Order in three simple steps
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            From discovery to dinner, it only takes a few effortless clicks.
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-12 hidden h-[2px] w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent lg:block" />

          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="group relative rounded-[32px] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-elevated)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Icon size={30} />
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)]">
                      0{index + 1}
                    </div>
                  </div>

                  <h3 className="mt-8 text-2xl font-semibold text-[var(--text-primary)]">{step.title}</h3>
                  <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">{step.description}</p>

                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                    Learn more
                    <ArrowRight size={16} />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
