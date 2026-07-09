import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, UserRound } from 'lucide-react';
import GiftCardPreview from './GiftCardPreview';
import { amountOptions } from './giftCardData';

export default function GiftCardShowcase() {
  const [form, setForm] = useState({
    recipient: 'Amina',
    email: '',
    message: 'Enjoy a warm homemade meal from your neighborhood.',
    amount: 100
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section id="gift-card-form" className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <GiftCardPreview amount={form.amount} recipient={form.recipient} message={form.message} />

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] p-7 shadow-[var(--shadow-elevated)] sm:p-10"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Purchase Form UI</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-4xl">
            Personalize your gift.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
            This is the gift-card purchase interface only. Payment is not implemented.
          </p>

          <div className="mt-8 grid gap-5">
            <label className="space-y-3">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Recipient name</span>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
                <input
                  type="text"
                  value={form.recipient}
                  onChange={(event) => updateField('recipient', event.target.value)}
                  placeholder="Recipient name"
                  className="w-full rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] py-4 pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none transition duration-300 placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
              </div>
            </label>

            <label className="space-y-3">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Recipient email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon)]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] py-4 pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none transition duration-300 placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
              </div>
            </label>

            <label className="space-y-3">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Message</span>
              <div className="relative">
                <MessageSquare className="pointer-events-none absolute left-4 top-5 h-4 w-4 text-[var(--icon)]" />
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  placeholder="Write a warm note..."
                  className="w-full resize-none rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] py-4 pl-12 pr-4 text-sm text-[var(--text-primary)] outline-none transition duration-300 placeholder:text-[var(--placeholder)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
              </div>
            </label>

            <div>
              <span className="text-sm font-medium text-[var(--text-secondary)]">Amount</span>
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {amountOptions.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => updateField('amount', amount)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      form.amount === amount
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-primary)] hover:border-[var(--accent)]'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
          >
            Preview Gift Card
            <Send size={18} />
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
