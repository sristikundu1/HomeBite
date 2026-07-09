import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How do I order?',
    answer: 'Browse local meals, choose a dish and pickup or delivery window, then place your order through the HomeBite checkout flow.'
  },
  {
    question: 'How do I become a chef?',
    answer: 'Create a chef profile, share your kitchen details and menu, complete the verification steps, and start accepting orders once approved.'
  },
  {
    question: 'How are meals verified?',
    answer: 'HomeBite combines chef onboarding, customer ratings, ingredient transparency, and ongoing quality checks to keep the marketplace trustworthy.'
  },
  {
    question: 'Is payment secure?',
    answer: 'Payments are designed to be processed through secure checkout flows, with order details and chef payouts handled in a protected account experience.'
  },
  {
    question: 'Can I cancel orders?',
    answer: 'Cancellation options depend on the meal preparation window. Orders can usually be changed before the chef begins preparing the meal.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">FAQ</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            Questions before your first bite.
          </h2>
        </motion.div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold text-[var(--text-primary)]"
                  aria-expanded={isOpen}
                >
                  {faq.question}
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={22} className="text-[var(--icon)]" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <p className="px-6 pb-6 text-base leading-7 text-[var(--text-secondary)]">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
