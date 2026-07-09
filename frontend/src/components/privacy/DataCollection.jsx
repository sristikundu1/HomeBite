import { motion } from 'framer-motion';
import { Cookie, CreditCard, KeyRound, LineChart, ShieldCheck } from 'lucide-react';

const collectionItems = [
  {
    title: 'Cookies',
    description: 'Used for preferences, sessions, analytics, and service reliability.',
    icon: Cookie
  },
  {
    title: 'Authentication Data',
    description: 'Includes sign-in identifiers, email, display name, and profile details.',
    icon: KeyRound
  },
  {
    title: 'Payments',
    description: 'Payment activity is handled through secure payment service providers.',
    icon: CreditCard
  },
  {
    title: 'Analytics',
    description: 'Helps measure performance, traffic patterns, and product quality.',
    icon: LineChart
  },
  {
    title: 'Data Security',
    description: 'Safeguards support account protection and platform trust.',
    icon: ShieldCheck
  }
];

export default function DataCollection() {
  return (
    <section aria-labelledby="data-collection-title" className="mt-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Data categories</p>
        <h2 id="data-collection-title" className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)]">
          How privacy-sensitive areas are handled.
        </h2>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {collectionItems.map((item, index) => {
          const Icon = item.icon;

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
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-muted)] text-[var(--accent)]">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
