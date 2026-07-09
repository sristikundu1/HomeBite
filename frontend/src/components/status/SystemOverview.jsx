import { motion } from 'framer-motion';
import { CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';

const overviewItems = [
  {
    label: 'Overall status',
    value: 'Operational',
    detail: 'Core ordering services are available.',
    icon: CheckCircle2
  },
  {
    label: 'Uptime',
    value: '99.98%',
    detail: 'Measured across the last 30 days.',
    icon: ShieldCheck
  },
  {
    label: 'Last updated',
    value: 'Just now',
    detail: 'Checks refresh automatically later.',
    icon: Clock3
  }
];

export default function SystemOverview() {
  return (
    <section className="bg-[var(--bg-page)] py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mb-10 max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Current System Status</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-4xl">
            Services are being monitored continuously.
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {overviewItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-muted)] text-[var(--accent)]"
                >
                  <Icon size={22} />
                </motion.div>
                <p className="mt-5 text-sm text-[var(--text-secondary)]">{item.label}</p>
                <h3 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{item.value}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{item.detail}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
