import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

import "react-accessible-accordion/dist/fancy-example.css";

import { ChevronDown } from "lucide-react";
import { faqData } from "./helpData";

export default function FAQAccordion() {
  return (
    <section>

      <div className="mb-14 text-center">

        <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-500">
          Frequently Asked Questions
        </span>

        <h2 className="mt-6 text-4xl font-bold text-[var(--text-primary)]">
          Questions We Get The Most
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
          Can't find your answer? Contact our support team anytime.
        </p>

      </div>

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >

        <Accordion allowZeroExpanded>

          {faqData.map((faq) => (

            <AccordionItem
              key={faq.id}
              className="mb-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] transition-all hover:border-orange-400"
            >

              <AccordionItemHeading>

                <AccordionItemButton className="flex cursor-pointer items-center justify-between px-7 py-6">

                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {faq.question}
                  </h3>

                  <ChevronDown
                    size={22}
                    className="text-orange-500 transition-transform duration-300 accordion-icon"
                  />

                </AccordionItemButton>

              </AccordionItemHeading>

              <AccordionItemPanel>

                <div className="border-t border-[var(--border)] px-7 py-6">

                  <p className="leading-8 text-[var(--text-secondary)]">
                    {faq.answer}
                  </p>

                </div>

              </AccordionItemPanel>

            </AccordionItem>

          ))}

        </Accordion>

      </motion.div>

    </section>
  );
}