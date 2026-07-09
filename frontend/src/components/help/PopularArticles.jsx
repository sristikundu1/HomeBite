import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { popularArticles } from "./helpData";

export default function PopularArticles() {
  return (
    <section>
      {/* Heading */}

      <div className="mb-14 text-center">
        <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-500">
          Popular Articles
        </span>

        <h2 className="mt-6 text-4xl font-bold text-[var(--text-primary)]">
          Frequently Read Guides
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
          Start with the articles our community finds most helpful.
        </p>
      </div>

      {/* Grid */}

      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {popularArticles.map((article, index) => {
          const Icon = article.icon;

          return (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -8,
              }}
              className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] p-7 shadow-lg transition-all duration-300 hover:border-orange-400 hover:shadow-2xl"
            >
              {/* Glow */}

              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-500/5 blur-3xl transition group-hover:bg-orange-500/10" />

              {/* Icon */}

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg">
                <Icon size={24} />
              </div>

              {/* Category */}

              <span className="mt-7 inline-block rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-500">
                {article.category}
              </span>

              {/* Title */}

              <h3 className="mt-5 text-xl font-bold leading-8 text-[var(--text-primary)] transition group-hover:text-orange-500">
                {article.title}
              </h3>

              {/* Description */}

              <p className="mt-4 leading-7 text-[var(--text-secondary)]">
                {article.description}
              </p>

              {/* Footer */}

              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">
                  {article.readTime}
                </span>

                <button className="flex items-center gap-2 font-semibold text-orange-500 transition-all duration-300 group-hover:gap-3">
                  Read Article

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