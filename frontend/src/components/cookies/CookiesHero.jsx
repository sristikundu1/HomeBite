import { motion, useScroll, useTransform } from 'framer-motion';
import { Cookie } from 'lucide-react';

const heroImage =
  'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=2200&q=85';

export default function CookiesHero() {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 680], [0, 80]);
  const imageScale = useTransform(scrollY, [0, 680], [1.08, 1]);

  return (
    <section className="relative flex min-h-[500px] items-center justify-center overflow-hidden pt-24 sm:min-h-[580px] lg:min-h-[640px]">
      <motion.img
        src={heroImage}
        alt="Fresh cookies on a tray"
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/76 via-black/52 to-black/82" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_28%,rgba(249,115,22,0.25),transparent_28%),radial-gradient(circle_at_78%_72%,rgba(236,72,153,0.16),transparent_32%)]" />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/80 backdrop-blur-xl">
          <Cookie size={15} />
          Cookies Policy
        </span>
        <h1 className="mt-7 text-5xl font-semibold leading-tight tracking-normal text-white sm:text-6xl lg:text-[72px]">
          Cookies Policy
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
          Understand how HomeBite uses cookies to keep the marketplace reliable, personalized, and secure.
        </p>
      </motion.div>
    </section>
  );
}
