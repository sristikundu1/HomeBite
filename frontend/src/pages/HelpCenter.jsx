import { motion } from "framer-motion";

import HelpHero from "../components/help/HelpHero";
import HelpSearch from "../components/help/HelpSearch";
import PopularArticles from "../components/help/PopularArticles";
import HelpCategories from "../components/help/HelpCategories";
import FAQAccordion from "../components/help/FAQAccordion";
import NeedMoreHelp from "../components/help/NeedMoreHelp";
import SupportCTA from "../components/help/SupportCTA";

export default function HelpCenter() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="bg-[var(--bg-page)] text-[var(--text-primary)]"
    >
      <HelpHero />

      <main className="mx-auto max-w-[1400px] px-5 lg:px-8">

        {/* Search */}

        <section className="-mt-14 relative z-20">
          <HelpSearch />
        </section>

        {/* Popular */}

        <section className="py-28">
          <PopularArticles />
        </section>

        {/* Categories */}

        <section className="pb-28">
          <HelpCategories />
        </section>

        {/* FAQ */}

        <section className="pb-28">
          <FAQAccordion />
        </section>

        {/* Help */}

        <section className="pb-28">
          <NeedMoreHelp />
        </section>

      </main>

      {/* CTA */}

      <SupportCTA />
    </motion.div>
  );
}
