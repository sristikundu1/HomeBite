import { motion } from 'framer-motion';

const storyImage =
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1500&q=85';

export default function OurStory() {
  return (
    <section className="bg-[var(--bg-page)] py-20 sm:py-24 lg:py-[140px]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevated)]"
        >
          <img
            src={storyImage}
            alt="Family cooking homemade food together"
            className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[480px]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Our Story</span>
          <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-normal text-[var(--text-primary)] sm:text-5xl">
            Built for the meals that feel personal.
          </h2>
          <div className="mt-8 grid gap-5 text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
            <p>
              HomeBite was created for people who wanted more than another delivery app. We saw talented neighborhood cooks preparing beautiful food at home, while busy families searched for meals that felt fresh, nourishing, and familiar.
            </p>
            <p>
              Our marketplace gives local chefs the tools to share their kitchens with confidence. From family recipes to regional specialties, HomeBite helps independent cooks reach more people and turn trusted food traditions into sustainable income.
            </p>
            <p>
              Every order is a small community connection. Food lovers discover healthier homemade alternatives, families gather around meals with a story, and local economies grow through a platform designed around care, trust, and hospitality.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
