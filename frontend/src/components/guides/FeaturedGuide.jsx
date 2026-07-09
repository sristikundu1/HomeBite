import { motion } from 'framer-motion';
import { ArrowRight, Clock, UserRound } from 'lucide-react';
import { featuredGuide } from './guidesData';

export default function FeaturedGuide() {
  return (
    <section className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.article
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="grid overflow-hidden rounded-[2.25rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevated)] lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="group overflow-hidden">
            <img
              src={featuredGuide.image}
              alt={featuredGuide.title}
              className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-105 lg:h-full"
            />
          </div>
          <div className="p-8 sm:p-10 lg:p-12">
            <span className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              {featuredGuide.category}
            </span>
            <h2 className="mt-7 text-4xl font-semibold leading-tight tracking-normal text-[var(--text-primary)] sm:text-5xl">
              {featuredGuide.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              {featuredGuide.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-5 text-sm text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-2">
                <UserRound size={16} />
                {featuredGuide.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock size={16} />
                {featuredGuide.readTime}
              </span>
            </div>
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
            >
              Read Featured Guide
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
