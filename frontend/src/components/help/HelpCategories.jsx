import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { helpCategories } from "./helpData";

export default function HelpCategories() {
  return (
    <section>
      {/* Heading */}

      <div className="mb-14 text-center">
        <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-500">
          Browse Categories
        </span>

        <h2 className="mt-6 text-4xl font-bold text-[var(--text-primary)]">
          Explore Help Topics
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
          Find detailed guides organized by category to quickly solve your
          questions.
        </p>
      </div>

      {/* Grid */}

      <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
        {helpCategories.map((category, index) => {
          const Icon = category.icon;

          return (
            <motion.article
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.07,
              }}
              whileHover={{
                y: -8,
              }}
              className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] p-7 transition-all duration-300 hover:border-orange-400 hover:shadow-2xl"
            >
              {/* Decorative Glow */}

              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-500/5 blur-3xl transition group-hover:bg-orange-500/15" />

              {/* Icon */}

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-lg`}
              >
                <Icon size={28} />
              </div>

              {/* Title */}

              <h3 className="mt-6 text-xl font-bold text-[var(--text-primary)] transition group-hover:text-orange-500">
                {category.title}
              </h3>

              {/* Description */}

              <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">
                {category.description}
              </p>

              {/* Footer */}

              <div className="mt-8 flex items-center justify-between">
                <span className="rounded-full bg-[var(--bg-muted)] px-3 py-1 text-sm font-medium text-[var(--text-secondary)]">
                  {category.articles} Articles
                </span>

                <button className="flex items-center gap-2 text-sm font-semibold text-orange-500 transition-all duration-300 group-hover:gap-3">
                  Explore

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}