import { motion } from 'framer-motion';
import { guideCategories } from './guidesData';

export default function GuideCategories() {
  return (
    <section className="bg-[var(--bg-muted)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Guide Categories</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            Browse by the way you cook.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guideCategories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.article
                key={category.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                whileHover={{ y: -8 }}
                className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-7 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--bg-muted)] text-[var(--accent)]">
                  <Icon size={28} />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-normal text-[var(--text-primary)]">{category.title}</h3>
                <p className="mt-3 leading-7 text-[var(--text-secondary)]">{category.description}</p>
                <p className="mt-6 text-sm font-semibold text-[var(--accent)]">{category.count}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
