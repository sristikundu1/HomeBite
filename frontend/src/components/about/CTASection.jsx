import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChefHat } from 'lucide-react';

const ctaImage =
  'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=2200&q=85';

export default function CTASection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section className="bg-[var(--bg-page)] px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-[140px]">
      <div className="relative mx-auto flex min-h-[440px] max-w-[1400px] items-center justify-center overflow-hidden rounded-[2.25rem] border border-[var(--border)] shadow-[var(--shadow-elevated)]">
        <motion.img
          src={ctaImage}
          alt="Shared table of authentic homemade meals"
          style={{ y }}
          className="absolute inset-0 h-[115%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/54 to-black/72" />

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-white/75">Start with HomeBite</span>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-white sm:text-5xl">
            Ready to Experience Authentic Homemade Food?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
            Discover trusted local cooks, support neighborhood food makers, and enjoy meals that feel personal again.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <motion.a
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/explore"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
            >
              Browse Meals
              <ArrowRight size={18} />
            </motion.a>
            <motion.a
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/cook"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/15"
            >
              Become a Home Chef
              <ChefHat size={18} />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
