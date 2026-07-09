import { motion } from 'framer-motion';

function CTA() {
  return (
    <section className="relative overflow-hidden pb-24" id="cta">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="overflow-hidden rounded-[44px] border border-[var(--border)] shadow-[var(--shadow-elevated)]"
        >
          <div className="relative min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
              alt="Chef preparing meal"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,23,42,0.85)] via-[rgba(15,23,42,0.55)] to-[rgba(15,23,42,0.25)]" />

            <div className="relative z-10 flex h-full flex-col justify-center px-8 py-16 sm:px-10 lg:px-16">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-200">
                HomeBite community
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Ready to enjoy homemade meals?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
                Bring the warmth of home to your table with fresh dishes from verified local cooks.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-4 text-sm font-semibold text-[var(--button-text)] shadow-lg shadow-orange-500/25 transition hover:brightness-110">
                  Order Meals
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20">
                  Become a Cook
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;
