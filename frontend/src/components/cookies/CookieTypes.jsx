import { motion } from 'framer-motion';
import { BarChart3, Cookie, Megaphone, SlidersHorizontal } from 'lucide-react';
import { cookieTypes } from './cookiesData';

const icons = [Cookie, BarChart3, SlidersHorizontal, Megaphone];

export default function CookieTypes() {
  return (
    <section id="types-of-cookies" aria-labelledby="types-of-cookies-title" className="scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Types of Cookies</p>
        <h2 id="types-of-cookies-title" className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)]">
          Cookie information cards.
        </h2>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cookieTypes.map((item, index) => {
          const Icon = icons[index];

          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-muted)] text-[var(--accent)]">
                  <Icon size={20} />
                </span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                  {item.status}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
