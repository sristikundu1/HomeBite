import { motion } from 'framer-motion';
import { Check, Clock, CreditCard, ShieldCheck, Truck, Utensils, X } from 'lucide-react';

const rows = [
  { feature: 'Chef discovery', icon: Utensils, starter: true, family: true, premium: true },
  { feature: 'Secure checkout', icon: CreditCard, starter: true, family: true, premium: true },
  { feature: 'Priority delivery windows', icon: Truck, starter: false, family: true, premium: true },
  { feature: 'Weekly meal planning', icon: Clock, starter: false, family: true, premium: true },
  { feature: 'Premium chef access', icon: ShieldCheck, starter: false, family: false, premium: true }
];

const plans = ['Starter', 'Family', 'Premium'];

function StatusIcon({ enabled }) {
  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
        enabled ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
      }`}
    >
      {enabled ? <Check size={18} /> : <X size={18} />}
    </span>
  );
}

export default function ComparisonTable() {
  return (
    <section className="bg-[var(--bg-muted)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Compare</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            Everything clear before you choose.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mt-12 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)]"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-6 py-5 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan} className="px-6 py-5 text-center text-sm font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      {plan}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const Icon = row.icon;

                  return (
                    <tr key={row.feature} className="border-b border-[var(--border)] last:border-b-0">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3 font-semibold text-[var(--text-primary)]">
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--bg-muted)] text-[var(--accent)]">
                            <Icon size={20} />
                          </span>
                          {row.feature}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center"><StatusIcon enabled={row.starter} /></td>
                      <td className="px-6 py-5 text-center"><StatusIcon enabled={row.family} /></td>
                      <td className="px-6 py-5 text-center"><StatusIcon enabled={row.premium} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
