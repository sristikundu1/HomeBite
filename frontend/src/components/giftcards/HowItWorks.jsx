import { motion } from 'framer-motion';
import { steps } from './giftCardData';

export default function HowItWorks() {
  return (
    <section className="bg-[var(--bg-muted)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">How It Works</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            A thoughtful gift in three steps.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={step.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--bg-muted)] text-[var(--accent)]">
                  <Icon size={28} />
                </div>
                <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-normal text-[var(--text-primary)]">{step.title}</h3>
                <p className="mt-4 leading-7 text-[var(--text-secondary)]">{step.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
