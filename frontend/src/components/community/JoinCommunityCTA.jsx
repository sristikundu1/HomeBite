import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';

const ctaImage =
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2200&q=85';

export default function JoinCommunityCTA() {
  return (
    <section id="join-community" className="bg-[var(--bg-muted)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-[140px]">
      <div className="relative mx-auto flex min-h-[420px] max-w-[1400px] items-center justify-center overflow-hidden rounded-[2.25rem] border border-[var(--border)] shadow-[var(--shadow-elevated)]">
        <img src={ctaImage} alt="Community members cooking together" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/82 via-black/56 to-black/72" />
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/75 backdrop-blur-xl">
            <Users size={15} />
            Join Community
          </span>
          <h2 className="mt-6 text-4xl font-semibold tracking-normal text-white sm:text-5xl">
            Pull up a chair at the HomeBite table.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
            Meet local cooks, attend tastings, follow chef stories, and help homemade food thrive in your neighborhood.
          </p>
          <motion.a
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/register"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110"
          >
            Create Account
            <ArrowRight size={18} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
