import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity } from 'lucide-react';

const heroImage =
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2200&q=85';

export default function StatusHero() {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 680], [0, 80]);
  const imageScale = useTransform(scrollY, [0, 680], [1.08, 1]);

  return (
    <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden pt-24 sm:min-h-[600px] lg:min-h-[660px]">
      <motion.img
        src={heroImage}
        alt="Service monitoring dashboard"
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/74 via-black/50 to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_28%,rgba(249,115,22,0.24),transparent_28%),radial-gradient(circle_at_78%_72%,rgba(16,185,129,0.2),transparent_32%)]" />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/80 backdrop-blur-xl">
          <Activity size={15} />
          Live health
        </span>
        <h1 className="mt-7 text-5xl font-semibold leading-tight tracking-normal text-white sm:text-6xl lg:text-[72px]">
          System Status
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
          Monitor the health and availability of LocalChefBazaar services in real time.
        </p>
      </motion.div>
    </section>
  );
}
