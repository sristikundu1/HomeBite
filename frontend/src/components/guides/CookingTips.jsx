import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cookingTips } from './guidesData';

export default function CookingTips() {
  return (
    <section className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Cooking Tips</span>
            <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
              Small habits that make food better.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              Practical, chef-friendly reminders for more consistent homemade meals.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {cookingTips.map((tip, index) => (
              <motion.article
                key={tip}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Sparkles size={20} />
                  </span>
                  <p className="font-medium leading-7 text-[var(--text-primary)]">{tip}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
