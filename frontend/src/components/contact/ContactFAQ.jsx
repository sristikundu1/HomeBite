import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const questions = [
  {
    question: 'How quickly will HomeBite respond?',
    answer: 'Most messages receive a reply within one business day. Active order issues are prioritized during support hours.'
  },
  {
    question: 'Can I contact support about an existing order?',
    answer: 'Yes. Include your order details in the subject or message so our team can find the right context quickly.'
  },
  {
    question: 'How do I ask about becoming a chef?',
    answer: 'Send us a note with your cuisine, city, and availability. Our chef onboarding team will follow up with next steps.'
  },
  {
    question: 'Do you support partnerships?',
    answer: 'Yes. We welcome local business, community, and food-program partnerships that help expand access to homemade meals.'
  }
];

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[var(--bg-muted)] py-20 sm:py-24 lg:py-[140px]">
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
            Before you reach out.
          </h2>
        </motion.div>

        <div className="mt-12 space-y-4">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold text-[var(--text-primary)] transition hover:text-[var(--accent)]"
                  aria-expanded={isOpen}
                >
                  {item.question}
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
                      <p className="px-6 pb-6 text-base leading-7 text-[var(--text-secondary)]">{item.answer}</p>
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
