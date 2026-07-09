import { motion } from 'framer-motion';

function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-page)] py-24" id="newsletter">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="overflow-hidden rounded-[40px] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-soft)]"
        >
          <div className="grid gap-8 px-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-12 lg:px-16 lg:py-16">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
                Fresh updates from HomeBite
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
                Get curated meal drops, chef stories, and neighborhood favorites.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[var(--text-secondary)]">
                Subscribe for weekly inspiration from local home chefs and new dishes near you.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-[480px] rounded-[32px] border border-[var(--border)] bg-[var(--bg-muted)] p-6 shadow-inner">
                <label className="text-sm font-semibold text-[var(--text-primary)]" htmlFor="newsletter-email">
                  Email address
                </label>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 text-[var(--text-primary)] outline-none ring-0 placeholder:text-[var(--text-muted)]"
                  />
                  <button className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-[var(--button-text)] shadow-lg shadow-orange-500/20 transition hover:brightness-110">
                    Subscribe
                  </button>
                </div>
                <p className="mt-4 text-sm text-[var(--text-secondary)]">
                  No spam. Just delicious updates and community highlights.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Newsletter;
