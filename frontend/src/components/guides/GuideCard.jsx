import { motion } from 'framer-motion';
import { ArrowRight, Clock, UserRound } from 'lucide-react';

export default function GuideCard({ guide, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)] transition duration-300 hover:shadow-[var(--shadow-elevated)]"
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={guide.image}
          alt={guide.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
          {guide.category}
        </span>
      </div>

      <div className="p-7">
        <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-2">
            <UserRound size={16} />
            {guide.author}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock size={16} />
            {guide.readTime}
          </span>
        </div>
        <h3 className="mt-5 text-2xl font-semibold leading-snug tracking-normal text-[var(--text-primary)] transition group-hover:text-[var(--accent)]">
          {guide.title}
        </h3>
        <button className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition-all duration-300 group-hover:gap-3">
          Read Guide
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.article>
  );
}
