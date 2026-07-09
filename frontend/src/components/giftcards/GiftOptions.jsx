import { motion } from 'framer-motion';
import { giftOptions } from './giftCardData';

export default function GiftOptions() {
  return (
    <section className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Gift Options</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            Choose a gift for every appetite.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {giftOptions.map((option, index) => {
            const Icon = option.icon;

            return (
              <motion.article
                key={option.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--bg-muted)] text-[var(--accent)]">
                    <Icon size={28} />
                  </div>
                  <span className="text-4xl font-semibold tracking-normal text-[var(--text-primary)]">{option.amount}</span>
                </div>
                <h3 className="mt-8 text-2xl font-semibold tracking-normal text-[var(--text-primary)]">{option.title}</h3>
                <p className="mt-4 leading-7 text-[var(--text-secondary)]">{option.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
