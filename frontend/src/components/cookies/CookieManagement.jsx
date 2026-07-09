import { motion } from 'framer-motion';
import { MonitorCog, SlidersHorizontal } from 'lucide-react';

export default function CookieManagement() {
  return (
    <section id="managing-cookies" aria-labelledby="managing-cookies-title" className="scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 sm:p-8"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-muted)] text-[var(--accent)]">
          <SlidersHorizontal size={22} />
        </span>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Managing Cookies</p>
        <h2 id="managing-cookies-title" className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)]">
          Future consent controls and browser settings.
        </h2>
        <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
          HomeBite is prepared for future cookie consent integration. Until then, you can manage cookie storage through your browser settings and privacy preferences.
        </p>
        <div className="mt-6 rounded-2xl bg-[var(--bg-muted)] p-5">
          <div className="flex items-start gap-4">
            <MonitorCog className="mt-1 h-5 w-5 shrink-0 text-[var(--accent)]" />
            <p className="text-sm leading-7 text-[var(--text-secondary)]">
              Browser tools typically allow blocking third-party cookies, clearing stored cookies, and reviewing site permissions. Essential cookies may still be required for login and ordering.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
