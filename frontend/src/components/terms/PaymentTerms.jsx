import { motion } from 'framer-motion';
import { CreditCard, ReceiptText, RotateCcw } from 'lucide-react';

const paymentItems = [
  {
    title: 'Payments',
    description: 'Orders must be paid through approved checkout methods and may be subject to provider authorization.',
    icon: CreditCard
  },
  {
    title: 'Receipts',
    description: 'Order confirmations, taxes, fees, and adjustments may appear in receipts or account records.',
    icon: ReceiptText
  },
  {
    title: 'Refund Policy',
    description: 'Refund decisions may depend on timing, preparation status, delivery progress, and platform review.',
    icon: RotateCcw
  }
];

export default function PaymentTerms() {
  return (
    <section id="payments" aria-labelledby="payments-title" className="scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 sm:p-8"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Payments</p>
        <h2 id="payments-title" className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)]">
          Payment and refund terms.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {paymentItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.06, ease: 'easeOut' }}
                className="rounded-2xl bg-[var(--bg-muted)] p-5"
              >
                <Icon className="h-6 w-6 text-[var(--accent)]" />
                <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
