import { motion } from 'framer-motion';
import { Ban, CheckCircle2, ShieldAlert } from 'lucide-react';

const rules = [
  {
    title: 'Use the marketplace honestly',
    description: 'Provide accurate account, order, listing, and communication details.',
    icon: CheckCircle2
  },
  {
    title: 'Respect safety requirements',
    description: 'Do not misuse ordering, reviews, messaging, chef listings, or delivery workflows.',
    icon: ShieldAlert
  },
  {
    title: 'Avoid prohibited activity',
    description: 'Fraud, harassment, scraping, impersonation, spam, and unlawful behavior are not allowed.',
    icon: Ban
  }
];

export default function AcceptableUse() {
  return (
    <section id="prohibited-activities" aria-labelledby="prohibited-activities-title" className="scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Prohibited Activities</p>
        <h2 id="prohibited-activities-title" className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)]">
          Acceptable use standards.
        </h2>
      </motion.div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {rules.map((rule, index) => {
          const Icon = rule.icon;

          return (
            <motion.article
              key={rule.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-lg shadow-black/5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-muted)] text-[var(--accent)]">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{rule.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{rule.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
