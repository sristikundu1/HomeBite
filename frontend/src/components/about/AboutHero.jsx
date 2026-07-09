import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChefHat, Sparkles } from 'lucide-react';

const heroImage =
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=2200&q=85';

export default function AboutHero() {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 700], [0, 90]);
  const imageScale = useTransform(scrollY, [0, 700], [1.08, 1]);

  return (
    <section className="relative flex h-[450px] items-center justify-center overflow-hidden pt-20 sm:h-[550px] lg:h-[650px]">
      <motion.img
        src={heroImage}
        alt="Home chef preparing fresh homemade food"
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/48 to-black/78" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(249,115,22,0.24),transparent_28%),radial-gradient(circle_at_80%_68%,rgba(236,72,153,0.18),transparent_30%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/80 backdrop-blur-xl"
        >
          <Sparkles size={15} />
          About HomeBite
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: 'easeOut' }}
          className="mt-7 max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-white sm:text-5xl lg:text-[64px]"
        >
          Connecting Communities Through Homemade Food
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: 'easeOut' }}
          className="mt-6 max-w-3xl text-base leading-8 text-white/82 sm:text-lg"
        >
          HomeBite is a trusted marketplace where passionate home chefs share authentic homemade meals with food lovers in their local communities.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38, ease: 'easeOut' }}
          className="mt-9 flex flex-col gap-3 sm:flex-row"
        >
          <motion.a
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/explore"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
          >
            Explore Meals
            <ArrowRight size={18} />
          </motion.a>
          <motion.a
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/cook"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/15"
          >
            Become a Chef
            <ChefHat size={18} />
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="absolute bottom-8 left-6 hidden rounded-3xl border border-white/15 bg-white/10 px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-black/20 backdrop-blur-xl md:block"
      >
        Trusted cooks. Local kitchens. Fresh stories.
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.65 }}
        className="absolute right-6 top-28 hidden rounded-3xl border border-white/15 bg-white/10 px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-black/20 backdrop-blur-xl md:block"
      >
        4.9 average meal rating
      </motion.div>
    </section>
  );
}
