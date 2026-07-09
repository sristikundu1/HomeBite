import { motion } from 'framer-motion';
import { communityStats } from './communityData';

export default function CommunityStats() {
  return (
    <section className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Community Statistics</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            A growing table of food lovers.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {communityStats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.article
                key={stat.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                whileHover={{ y: -8 }}
                className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-7 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--bg-muted)] text-[var(--accent)]">
                  <Icon size={26} />
                </div>
                <div className="mt-8 text-4xl font-semibold tracking-normal text-[var(--text-primary)]">{stat.value}</div>
                <p className="mt-2 text-base font-medium text-[var(--text-secondary)]">{stat.label}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
