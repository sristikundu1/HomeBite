import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel
} from 'react-accessible-accordion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Can I use HomeBite without a paid plan?',
    answer: 'Yes. Starter lets you browse chefs, save favorites, and place standard orders without a monthly subscription.'
  },
  {
    question: 'Which plan is best for families?',
    answer: 'Family is designed for households that order weekly, want bundle-friendly meals, and prefer priority delivery windows.'
  },
  {
    question: 'Can I change plans later?',
    answer: 'You can move between plans as your ordering habits change. Your saved chefs, favorites, and order history stay with your account.'
  },
  {
    question: 'Do chefs pay for these plans?',
    answer: 'These plans are for customers. Chef tools and partner options can be handled through the chef onboarding experience.'
  },
  {
    question: 'Are payments secure?',
    answer: 'HomeBite is designed for secure checkout flows, transparent order totals, and clear payment confirmation before each order.'
  }
];

export default function PricingFAQ() {
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
            Pricing questions, answered simply.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="mt-12"
        >
          <Accordion allowZeroExpanded preExpanded={['item-0']} className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                uuid={`item-${index}`}
                className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)]"
              >
                <AccordionItemHeading>
                  <AccordionItemButton className="group flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold text-[var(--text-primary)] outline-none transition hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent-soft)]">
                    {faq.question}
                    <ChevronDown className="h-5 w-5 shrink-0 text-[var(--icon)] transition duration-300 group-aria-expanded:rotate-180" />
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel className="px-6 pb-6 text-base leading-7 text-[var(--text-secondary)]">
                  {faq.answer}
                </AccordionItemPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
