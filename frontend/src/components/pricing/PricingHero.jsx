import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const heroImage =
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=2200&q=85';

export default function PricingHero() {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 680], [0, 80]);
  const imageScale = useTransform(scrollY, [0, 680], [1.08, 1]);

  return (
    <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden pt-24 sm:min-h-[620px] lg:min-h-[680px]">
      <motion.img
        src={heroImage}
        alt="Premium homemade meal spread"
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/72 via-black/48 to-black/78" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_28%,rgba(249,115,22,0.26),transparent_28%),radial-gradient(circle_at_78%_72%,rgba(236,72,153,0.18),transparent_32%)]" />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/80 backdrop-blur-xl">
          <Sparkles size={15} />
          HomeBite Pricing
        </span>
        <h1 className="mt-7 text-5xl font-semibold leading-tight tracking-normal text-white sm:text-6xl lg:text-[72px]">
          Simple pricing
          <span className="block">for everyone.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
          Flexible HomeBite plans for solo food lovers, growing families, and serious homemade meal explorers.
        </p>
        <motion.a
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="#plans"
          className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
        >
          View Plans
          <ArrowRight size={18} />
        </motion.a>
      </motion.div>
    </section>
  );
}
