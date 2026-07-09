import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function ContactPrivacy() {
  return (
    <section id="contact" aria-labelledby="contact-privacy-title" className="scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 sm:p-8"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-muted)] text-[var(--accent)]">
          <Mail size={22} />
        </span>
        <h2 id="contact-privacy-title" className="mt-5 text-3xl font-semibold tracking-normal text-[var(--text-primary)]">
          Contact
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          For privacy questions, account data requests, or policy concerns, contact the LocalChefBazaar privacy team.
        </p>
        <a
          href="mailto:privacy@localchefbazaar.com"
          className="mt-6 inline-flex rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-muted)]"
        >
          privacy@localchefbazaar.com
        </a>
      </motion.div>
    </section>
  );
}
