import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const rights = [
  'Request access to personal information associated with your account.',
  'Ask for corrections when account information is inaccurate or incomplete.',
  'Request deletion where legally available and technically reasonable.',
  'Opt out of certain marketing or non-essential communications.',
  'Ask questions about how information is processed or retained.'
];

export default function UserRights() {
  return (
    <section id="your-rights" aria-labelledby="your-rights-title" className="scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 sm:p-8"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Your Rights</p>
        <h2 id="your-rights-title" className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)]">
          Control over your information.
        </h2>
        <ul className="mt-6 space-y-4">
          {rights.map((right) => (
            <li key={right} className="flex gap-3 text-sm leading-6 text-[var(--text-secondary)]">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
              <span>{right}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
