import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cookieFaqs } from './cookiesData';

export default function CookieFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="frequently-asked-questions" aria-labelledby="cookie-faq-title" className="scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-lg shadow-black/5 sm:p-8"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Frequently Asked Questions</p>
        <h2 id="cookie-faq-title" className="mt-4 text-3xl font-semibold tracking-normal text-[var(--text-primary)]">
          Common cookie questions.
        </h2>
        <div className="mt-8 divide-y divide-[var(--border)]">
          {cookieFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 text-left text-base font-semibold text-[var(--text-primary)]"
                  aria-expanded={isOpen}
                >
                  {faq.question}
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-[var(--icon)]">
                    <ChevronDown size={20} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-sm leading-7 text-[var(--text-secondary)]">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
