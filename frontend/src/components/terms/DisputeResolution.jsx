import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';

export default function DisputeResolution() {
  return (
    <section id="dispute-resolution" aria-labelledby="dispute-resolution-title" className="scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 sm:p-8"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-muted)] text-[var(--accent)]">
          <Handshake size={22} />
        </span>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Dispute Resolution</p>
        <h2 id="dispute-resolution-title" className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)]">
          Resolving marketplace concerns.
        </h2>
        <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
          If a dispute arises from orders, chef listings, refunds, account activity, or platform use, users agree to first contact HomeBite support so the issue can be reviewed in good faith before pursuing other remedies.
        </p>
      </motion.div>
    </section>
  );
}
