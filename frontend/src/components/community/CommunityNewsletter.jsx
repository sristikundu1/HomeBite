import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';

export default function CommunityNewsletter() {
  return (
    <section className="bg-[var(--bg-page)] px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-[140px]">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="mx-auto grid max-w-[1400px] gap-8 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-soft)] sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
      >
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Newsletter</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-4xl">
            Get community stories in your inbox.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
            Monthly chef spotlights, event invites, and fresh local meal inspiration.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-muted)] p-2 sm:flex-row sm:items-center">
          <Mail className="ml-4 hidden h-5 w-5 text-[var(--icon)] sm:block" />
          <input
            type="email"
            placeholder="Enter your email"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--placeholder)]"
          />
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:brightness-110">
            Subscribe
            <Send size={16} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
