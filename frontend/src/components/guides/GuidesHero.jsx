import { motion, useScroll, useTransform } from 'framer-motion';
import { BookOpen, Search } from 'lucide-react';

const heroImage =
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=2200&q=85';

export default function GuidesHero() {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 650], [0, 80]);
  const imageScale = useTransform(scrollY, [0, 650], [1.08, 1]);

  return (
    <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden pt-24 sm:min-h-[640px]">
      <motion.img
        src={heroImage}
        alt="Premium kitchen preparation for cooking guides"
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/72 via-black/48 to-black/78" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_28%,rgba(249,115,22,0.28),transparent_30%),radial-gradient(circle_at_78%_74%,rgba(236,72,153,0.18),transparent_32%)]" />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/80 backdrop-blur-xl">
          <BookOpen size={15} />
          Cooking Guides
        </span>
        <h1 className="mt-7 text-5xl font-semibold leading-tight tracking-normal text-white sm:text-6xl lg:text-[72px]">
          Cook better homemade meals.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
          Explore chef-tested techniques, thoughtful recipes, and practical kitchen ideas for food lovers and HomeBite cooks.
        </p>
        <div className="mx-auto mt-10 flex max-w-2xl items-center rounded-3xl border border-white/20 bg-white/12 p-2 text-left shadow-2xl backdrop-blur-xl">
          <Search className="ml-4 h-5 w-5 text-white/70" />
          <input
            type="text"
            placeholder="Search cooking guides..."
            className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-white/65"
          />
          <button className="hidden rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 sm:inline-flex">
            Search
          </button>
        </div>
      </motion.div>
    </section>
  );
}
