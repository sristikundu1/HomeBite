import { motion } from "framer-motion";
import { BookOpen, LifeBuoy, MessageCircle, Search } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: "easeOut",
    },
  }),
};

export default function HelpHero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-br from-orange-50 via-white to-rose-50 dark:from-[#18181b] dark:via-[#101014] dark:to-[#18181b]">
      {/* Decorative Blur */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-orange-400/20 blur-[120px]" />

        <div className="absolute right-[-80px] top-20 h-72 w-72 rounded-full bg-rose-500/20 blur-[120px]" />

        <div className="absolute bottom-[-150px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-300/20 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}

          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-orange-300/40 bg-white/70 px-5 py-2 text-sm font-medium text-orange-600 shadow-lg backdrop-blur dark:border-orange-400/20 dark:bg-white/5 dark:text-orange-300"
          >
            <LifeBuoy size={16} />
            HomeBite Help Center
          </motion.div>

          {/* Heading */}

          <motion.h1
            custom={0.15}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 text-4xl font-black leading-tight tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl"
          >
            How can we
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              {" "}
              help you today?
            </span>
          </motion.h1>

          {/* Description */}

          <motion.p
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]"
          >
            Search our knowledge base, browse popular articles, or contact our
            support team. Everything you need to get the most out of HomeBite.
          </motion.p>

          {/* Search Preview */}

          <motion.div
            custom={0.45}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mx-auto mt-12 max-w-2xl"
          >
            <div className="group flex items-center rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-2 shadow-xl transition-all duration-300 hover:shadow-2xl">
              <Search
                className="ml-4 text-[var(--text-muted)]"
                size={20}
              />

              <input
                type="text"
                placeholder="Search for help articles..."
                className="flex-1 bg-transparent px-4 py-4 text-[15px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              />

              <button className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 font-semibold text-white transition duration-300 hover:scale-105">
                Search
              </button>
            </div>
          </motion.div>

          {/* Quick Links */}

          <motion.div
            custom={0.6}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <button className="group flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500 hover:text-orange-500">
              <BookOpen size={18} />
              Popular Articles
            </button>

            <button className="group flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500 hover:text-orange-500">
              <MessageCircle size={18} />
              Contact Support
            </button>

            <button className="group flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500 hover:text-orange-500">
              <LifeBuoy size={18} />
              FAQ
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}